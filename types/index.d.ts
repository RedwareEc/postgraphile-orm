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
export interface EngineVariables {
  variables: Variables;
  name: Names;
  prefix: string;
  namespace: string;
  custom?: Record<string, string>;
}

interface SchemaPartial {
  prefix: string;
  variables: Record<string, any>;
  template: string;
  custom: { fragment?: string; [key: string]: string };
}
export interface OptionsBuild {
  name: Names;
  schema: SchemaPartial;
  namespace: string;
  fragment: string;
  // custom?: Record<string, any>;
}

export interface Partial {
  variables: string;
  partial: string;
  getFragment: (fragment?: string | undefined) => string;
}
export interface BuildQueryOptions {
  id: symbol;
  fragment?: string;
  _extends?: {
    variables?: string[];
    fragments?: string[];
    body?: string[];
  };
}
interface OptionsQueryModel {
  name: string;
  primaryKeys: Record<string, string>;
}

export namespace Query {
  export interface OptionsAll {
    fragment?: string;
    flat?: boolean;
    extends?: {
      variables?: string[];
      fragments?: string[];
      body?: string[];
    };
  }
}
