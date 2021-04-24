import { GraphQLClient, gql } from 'graphql-request';
import { buildNames, buildVariables } from './helpers';
import { OptionsQueryModel } from 'types';
interface ModelProps {
  fragments: Record<string, any>;
}

interface OptionsFindAll {
  fragment?: string;
  variables?: any;
  singleList?: boolean;
}

const findAll = () => {
  //
};

export function instancePostgraphile(url: string) {
  //
  const client = new GraphQLClient(url);
  const models: Record<string, ModelProps> = {};

  return {
    defineModel: (name: string, primaryKeys: Record<string, string>) => {
      //
      const names = buildNames(name);
      models[name] = {
        fragments: {},
      };
      const staticVariables = {
        all: buildVariables({
          $first: 'Int',
          $offset: 'Int',
          $filter: `${names.singular.upper}Filter`,
          $condition: `${names.singular.upper}Condition`,
          $orderBy: `[${names.plural.upper}OrderBy!]`,
        }),
      };

      const findAll = (options: OptionsFindAll = {}) => {
        const fragment = models[name].fragments[options.fragment!];
        const query = gql`query(
           ${staticVariables.all.query}
          )
          {
            all${names.plural.upper}List(
              ${staticVariables.all.model}
            ){
              ${options.fragment ? '...' + options.fragment : 'id'}
            }
          }
          ${fragment}
        `;
        return client.request(query, options?.variables);
      };
      return {
        findAll,
        findOne: async (options: OptionsFindAll) => {
          const r = await findAll({
            ...options,
            variables: {
              ...options?.variables,
              first: 1,
            },
          });
          return r;
        },
        count: () => {
          return {};
        },
        findBy: () => {
          //
        },
        findByPk: () => {
          //
        },
        create: () => {
          //
        },
        updateByPk: () => {
          //
        },
        updateBy: () => {
          //
        },
        deleteByPk: () => {
          //
        },
        deleteBy: () => {
          //
        },
        $request: client.request,
        $addFragment: (nameFragment: string, fragment: any) => {
          if (models[name].fragments[nameFragment]) return void 0;
          models[name].fragments[
            nameFragment
          ] = gql`fragment ${nameFragment} on ${names.singular.upper}${fragment}`;
        },
        $query: {},
      };
    },
  };
}
