import got, { Options } from 'got';
import { buildNames, buildBy, engine } from './utils';
import { buildPartial } from './builder';
import { variables } from './models';
import * as Templates from './templates';
import {
  Partial,
  Query,
  SchemaPartial,
  BuildQueryOptions,
  OptionsQueryModel,
} from 'types';
import * as R from 'ramda';

interface OptionsPartial {
  namespace?: string;
  prefix?: string;
  fragment?: string;
}

export const defineQueryModel = ({
  name: rawName,
  primaryKeys,
}: OptionsQueryModel) => {
  const KEYS: Record<string, symbol> = {
    list: Symbol(),
    pagination: Symbol(),
    create: Symbol(),
    read: Symbol(),
    update: Symbol(),
    delete: Symbol(),
  };
  const primaryKey = Object.keys(primaryKeys)[0];
  const name = buildNames(rawName);
  const cacheQueries = new Map<symbol, Partial>();
  const fragments = new Map<symbol, string>();

  const basePartials = (schema: SchemaPartial) => (_params?: OptionsPartial) =>
    buildPartial({
      name,
      namespace: _params?.namespace || '',
      schema: {
        ...schema,
        prefix: _params?.prefix || schema.prefix,
      },
      fragment: _params?.fragment || primaryKey,
    });

  /**
   * Partials
   */
  const listPartial = basePartials({
    prefix: 'all',
    custom: {},
    template: Templates.allXList,
    variables: variables.all,
  });

  const paginationPartial = basePartials({
    prefix: 'all',
    custom: {},
    template: Templates.allX,
    variables: variables.all,
  });
  const createPartial = basePartials({
    prefix: 'crud',
    variables: variables.create,
    template: Templates.createX,
    custom: {},
  });
  const readByPartial = (pks: any) =>
    basePartials({
      prefix: 'doc',
      variables: {
        ...pks,
      },
      template: Templates.xBy,
      custom: {
        ...buildBy(pks),
      },
    });
  const updatePartial = (pks: any) =>
    basePartials({
      prefix: 'crud',
      variables: {
        ...variables.create,
        ...pks,
      },
      template: Templates.updateX,
      custom: {
        ...buildBy(pks),
      },
    });
  const deletePartial = (pks: any) =>
    basePartials({
      prefix: 'crud',
      variables: {
        ...variables.create,
        ...pks,
      },
      template: Templates.deleteX,
      custom: {
        ...buildBy(pks),
      },
    });

  const partials = {
    [KEYS.list]: listPartial,
    [KEYS.pagination]: paginationPartial,
    [KEYS.create]: createPartial,
    [KEYS.read]: readByPartial(primaryKeys),
    [KEYS.update]: updatePartial(primaryKeys),
    [KEYS.delete]: deletePartial(primaryKeys),
  };
  /***
   *
   */
  const buildQuery = ({ id, fragment, _extends }: BuildQueryOptions) => {
    let partial: Partial;
    const _partial = cacheQueries.get(id);
    if (_partial) {
      partial = _partial;
      console.log('Load cache', id);
    } else {
      partial = partials[id as any]();
    }
    const extraVariables = _extends?.variables || [];
    const extraFragments = _extends?.fragments || [];
    const extraBody = _extends?.body || [];

    // const partial = cacheQueries.get(id)||
    const fragments = fragment
      ? partial.getFragment(fragment)
      : partial.getFragment();
    const query = engine(Templates.query, {
      name,
      namespace: '',
      variables: {
        model: '',
        query: [partial.variables, ...extraVariables].join('\n'),
      },
      prefix: '',
      custom: {
        body: [partial.partial, ...extraBody].join('\n'),
        fragments: [fragments, ...extraFragments].join('\n'),
      },
    });
    return { query };
  };

  function dinamycQuery(
    _id: string,
    _primaryKeys: Record<string, string>,
    _partial: typeof readByPartial,
    _fragment?: string,
  ) {
    let id: symbol;
    if (KEYS[_id]) {
      id = KEYS[_id];
    } else {
      id = Symbol();
      KEYS[_id] = id;
      partials[id as any] = _partial(_primaryKeys);
    }
    return buildQuery({ id, fragment: _fragment });
  }
  /**
   * AllMethodn
   */

  function findAll(options?: Query.OptionsAll) {
    const key = options?.flat ? KEYS.list : KEYS.pagination;
    return buildQuery({
      id: key,
      fragment: options?.fragment,
      _extends: options?.extends,
    });
  }

  function create() {
    return buildQuery({ id: KEYS.create });
  }

  function findBy(by: Record<string, string>) {
    const id = `findBy${Object.keys(by).join('')}`;
    return dinamycQuery(id, by, readByPartial);
  }
  function updateBy(by: Record<string, string>) {
    const id = `updateBy${Object.keys(by).join('')}`;
    return dinamycQuery(id, by, readByPartial);
  }
  function deleteBy(by: Record<string, string>) {
    const id = `deleteBy${Object.keys(by).join('')}`;
    return dinamycQuery(id, by, readByPartial);
  }
  return {
    findAll,
    create,
    findBy,
    updateBy,
    deleteBy,
    _addFragment: (key: symbol, fragment: string) => {
      fragments.set(key, fragment);
    },
  };
};

export const buildRequestGraqhql = (url: string, options?: Options) => (
  type: 'doc' | 'one' | 'list' | 'pagination' | 'mutation' | 'custom',
) => async (data: { query: string; variables: unknown }) => {
  const r = await got
    .post({
      url,
      json: {
        query: data.query,
        variables: data.variables,
      },
      ...(options as any),
    })
    .json<any>();

  if (r.errors) {
    throw {
      response: {
        name: 'StatusCodeError',
        statusCode: 400,
        message: 'Error in request',
        body: { errors: r.errors },
      },
    };
  }
  switch (type) {
    case 'doc':
      return R.path(['doc'], r.data);
    case 'one':
      return R.path(['all', '0'], r.data) || null;
    case 'list':
      return R.path(['all'], r.data);
    case 'pagination':
      return R.path(['all'], r.data);
    case 'mutation':
      return R.path(['crud', 'doc'], r.data) || R.path(['crud'], r.data);
    default:
      return r.data;
  }
};
const l = [
  {
    query: 'users',
    fragment: '',
    type: 'list',
    children: [
      {
        query: 'Group',
        type: 'doc',
        fragment: '',
      },
    ],
  },
];

export function instancePostgraphile(url: string) {
  const request = buildRequestGraqhql(url);
  return (optionsModel: OptionsQueryModel) => {
    //
    const model = defineQueryModel(optionsModel);
    return {
      findAll: () => {
        const { query } = model.findAll({});
        return { run: () => request('list')({ query, variables }), query };
      },
    };
  };
}
