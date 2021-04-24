/* eslint-disable @typescript-eslint/ban-ts-comment */
import { GraphQLClient, gql } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { buildNames, buildVariables, buildBy, getFragment } from './helpers';
import {
  StoreModels,
  ModelState,
  QueryOptions,
  Variables,
  Names,
  FindOptions,
  InstancePostgraphile,
} from 'types';

interface Ctx {
  model: ModelState;
  variables: Variables;
  names: Names;
  client: GraphQLClient;
  primaryKey: string;
}

const addFragment = ({ model, names }: Pick<Ctx, 'model' | 'names'>) => (
  nameFragment: string,
  fragment: { query: string; variables?: Record<string, string> },
): void => {
  //@ts-ignore
  if (model.fragments[nameFragment]) {
    return void 0;
  }
  model.fragments[nameFragment] = {
    query: gql`fragment ${names.singular.lower}_${nameFragment} on ${names.singular.upper}${fragment.query}`,
    variables: fragment.variables
      ? (namespace?: string) => buildVariables(fragment.variables || {}, namespace)
      : undefined,
  };
};

const findAll = ({ model, variables, names, client, primaryKey }: Ctx) => (
  values: FindOptions,
  options: QueryOptions = {},
) => {
  const partials = getFragment(model, names, primaryKey, options.nameFragment);

  const bodyPagination = `    
  pageInfo {
    hasPreviousPage
    hasNextPage
  }
  totalCount
  docs: nodes {
    ${partials.body}
  }`;

  const gqlFragment = options.fragment
    ? `fragment gql_body on ${names.singular.upper}${options.fragment}`
    : '';
  const query = options.simpleList
    ? gql`query(
      ${variables.query}
     )
     {
       data: all${names.plural.upper}List(
         ${variables.model}
       ){
          ${options.fragment ? '...gql_body' : partials.body}
       }
     }
     ${partials.fragment}
     ${gqlFragment}
   `
    : gql`query(
      ${variables.query}
     )
     {
       data:all${names.plural.upper}(
         ${variables.model}
       ){
          ${options.fragment ? '...gql_body' : bodyPagination}
       }
     }
     ${partials.fragment}
     ${gqlFragment}
   `;
  console.log(query);

  return client.request(query, { ...values, ...options.variables });
};

const findBy = ({ model, variables, names, primaryKey, client }: Ctx) => (
  by: string,
  options: Omit<QueryOptions, '_simpleList'> = {},
) => {
  //
  const partials = getFragment(model, names, primaryKey, options.nameFragment);

  const query = gql`
    query(${variables.query}){
      ${names.singular.lower}By${by}(${variables.model}) {
        ${partials.body}
      }
    }
    ${partials.fragment}
  `;
  return client.request(query, { ...options.variables });
};

const mutationBy = ({ model, variables, names, primaryKey, client }: Ctx) => (
  mutation: 'update' | 'delete',
  by: string,
  options: Omit<QueryOptions, '_simpleList'> = {},
) => {
  //
  const partials = getFragment(model, names, primaryKey, options.nameFragment);

  const query = gql`
    mutation(${variables.query}){
      ${mutation}${names.singular.upper}By${by}(input:{${variables.model}}) {
        doc:${names.singular.lower}{
          ${partials.body}
        }
      }
    }
    ${partials.fragment}
  `;
  return client.request(query, { ...options.variables });
};

const mutationCreate = ({ model, variables, names, primaryKey, client }: Ctx) => (
  options: Omit<QueryOptions, '_simpleList'>,
) => {
  //
  const partials = getFragment(model, names, primaryKey, options.nameFragment);

  const query = gql`
    mutation(${variables.query}){
      create${names.singular.upper}(input:{${variables.model}}) {
        doc:${names.singular.lower}{
          ${partials.body}
        }
      }
    }
    ${partials.fragment}
  `;
  return client.request(query, { ...options.variables });
};

export function instancePostgraphile(url: string, options?: RequestInit): InstancePostgraphile {
  //
  const client = new GraphQLClient(url, options);
  const models: StoreModels = {};

  return {
    defineModel: (nameModel, primaryKeys) => {
      //
      const primaryKey = Object.keys(primaryKeys)[0];
      const primaryKeyType = primaryKeys[primaryKey];

      const names = buildNames(nameModel);
      models[nameModel] = {
        fragments: {},
      };
      const staticVariables = {
        all: buildVariables({
          first: 'Int',
          offset: 'Int',
          filter: `${names.singular.upper}Filter`,
          condition: `${names.singular.upper}Condition`,
          orderBy: `[${names.plural.upper}OrderBy!]`,
        }),
      };

      const model = models[nameModel];

      const updateBy = async (
        pks: Record<string, string | number>,
        data: unknown,
        options: QueryOptions = {},
      ) => {
        const { by, variables, values } = buildBy(
          {
            ...pks,
            [`patch:${names.singular.upper}Patch`]: data,
          },
          ['patch'],
        );
        const r = await mutationBy({ model, names, primaryKey, client, variables })('update', by, {
          ...options,
          variables: {
            ...options.variables,
            ...values,
          },
        });
        return r;
      };
      const deleteBy = async (pks: Record<string, string | number>, options: QueryOptions = {}) => {
        const { by, variables, values } = buildBy({
          ...pks,
        });
        const r = await mutationBy({ model, names, primaryKey, client, variables })('delete', by, {
          ...options,
          variables: {
            ...options.variables,
            ...values,
          },
        });
        return r;
      };
      return {
        findAll: findAll({
          model,
          names,
          client,
          variables: staticVariables.all,
          primaryKey,
        }),
        findOne: async (values, options) => {
          const r = await findAll({
            client,
            names,
            model,
            variables: staticVariables.all,
            primaryKey,
          })(
            {
              ...values,
              first: 1,
            },
            {
              ...options,
              simpleList: true,
            },
          );
          return r;
        },
        count: async (values, options) => {
          const r = await findAll({
            client,
            names,
            model,
            variables: staticVariables.all,
            primaryKey,
          })(values, {
            ...options,
            fragment: gql`
              {
                totalCount
              }
            `,
          });
          return r;
        },
        findBy: async (pks, options = {}) => {
          const { by, variables, values } = buildBy(pks);
          const r = await findBy({ model, names, primaryKey, client, variables })(by, {
            ...options,
            variables: {
              ...options.variables,
              ...values,
            },
          });
          return r;
        },
        findByPk: async (pk, options = {}) => {
          const { by, variables, values } = buildBy({ [`${primaryKey}:${primaryKeyType}`]: pk });
          const r = await findBy({ model, names, primaryKey, client, variables })(by, {
            ...options,
            variables: {
              ...options.variables,
              ...values,
            },
          });
          return r;
        },
        create: async (data, options) => {
          const variables = buildVariables({
            [names.singular.lower]: `${names.singular.upper}Input!`,
          });
          const r = await mutationCreate({ model, client, names, primaryKey, variables })({
            ...options,
            variables: {
              [names.singular.lower]: data,
            },
          });
          return r;
        },
        updateByPk: async (pk, data, options) => {
          const r = await updateBy(
            {
              [`${primaryKey}:${primaryKeyType}`]: pk,
            },
            data,
            options,
          );

          return r;
        },
        updateBy,
        deleteByPk: async (pk, options) => {
          await deleteBy(
            {
              [`${primaryKey}:${primaryKeyType}`]: pk,
            },
            options,
          );
        },
        deleteBy,
        $request: client.request,
        $addFragment: addFragment({ model, names }),
        // $query: {},
      };
    },
  };
}
