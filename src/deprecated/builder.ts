import { engine } from './utils';
import { Variables, EngineVariables, OptionsBuild, Partial } from 'types';

export const buildQueryVariables = (
  variables: Record<string, string | { key: string; type: string }>,
  namespace = '',
): Variables => {
  const _variables: string[] = [];
  const model: string[] = [];
  for (const key in variables) {
    const value = variables[key];
    if (typeof value === 'string') {
      _variables.push(`$${namespace}${key}: ${value}`);
      model.push(`${key}:$${namespace}${key}`);
    } else {
      _variables.push(`$${namespace}${key}: ${value.type}`);
      model.push(`${value.key}:$${namespace}${key}`);
    }
  }
  // model.push('}');
  return { query: _variables.join('\n'), model: model.join('\n') };
};

export const buildPartial = ({
  schema,
  namespace,
  name,
  fragment,
}: OptionsBuild): Partial => {
  const variables = buildQueryVariables(schema.variables, namespace);
  const ctx: EngineVariables = {
    variables,
    name,
    namespace,
    prefix: schema.prefix,
  };

  const partial = engine(schema.template, ctx);

  return {
    variables: engine(variables.query, ctx),
    partial,
    getFragment: (newFragment?: string) => {
      const custom = { ...schema.custom };
      if (newFragment) {
        custom.fragment = newFragment;
      } else {
        custom.fragment = fragment;
      }
      return engine(
        `fragment body<%namespace%> on <%name.singular.upper%>{
      <%custom.fragment%>
      #REFERENCE
    }
    `,
        { ...ctx, custom },
      );
    },
  };
};
