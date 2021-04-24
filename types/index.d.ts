import { GraphQLClient, gql } from 'graphql-request';

export interface Names {
  singular: {
    upper: string;
    lower: string;
  };
  plural: {
    upper: string;
    lower: string;
  };
}
export interface Variables {
  query: string;
  model: string;
}

interface Fragment {
  query: string;
  variables?: (namespace?: string) => Variables;
}
export interface ModelState {
  fragments: Record<string, Fragment>;
}

export type StoreModels = Record<string, ModelState>;

export interface FindOptions {
  first?: number;
  offset?: number;
  orderBy?: string[];
  filter?: any;
  condition?: any;
}
export interface QueryOptions {
  variables?: Record<string, any>;
  nameFragment?: string;
  fragment?: string;
  simpleList?: boolean;
}

export interface GraphqlModel {
  findAll: (find: FindOptions, options?: QueryOptions) => Promise<any>;
  findOne: (
    find?: Omit<FindOptions, 'first' | 'offset'>,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  count: (
    find?: Omit<FindOptions, 'first' | 'offset' | 'orderBy'>,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  findBy: (
    pks: Record<string, string | number>,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  findByPk: (pk: string | number, options?: Omit<QueryOptions, '_simpleList'>) => Promise<any>;
  create: (data: any, options?: Omit<QueryOptions, '_simpleList'>) => Promise<any>;
  updateByPk: (
    pk: string | number,
    data: any,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  updateBy: (
    pks: Record<string, string | number>,
    data: any,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  deleteByPk: (pk: string | number, options?: Omit<QueryOptions, '_simpleList'>) => Promise<any>;
  deleteBy: (
    pks: Record<string, string | number>,
    options?: Omit<QueryOptions, '_simpleList'>,
  ) => Promise<any>;
  $request: (query: any, variables: anyi) => Promise<any>;
  $addFragment: (
    nameFragment: string,
    fragment: { query: string; variables?: Record<string, string> },
  ) => void;
}

export interface InstancePostgraphile {
  defineModel: (nameModel: string, primaryKeys: Record<string, string>) => GraphqlModel;
}
