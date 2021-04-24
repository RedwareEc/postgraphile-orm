import { singular, plural } from 'pluralize';
import { Names, Variables } from 'types';

export function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
export function buildNames(rawName: string): Names {
  const name = plural(rawName);
  return {
    singular: {
      upper: name.charAt(0).toUpperCase() + singular(name).slice(1),
      lower: name.charAt(0).toLowerCase() + singular(name).slice(1),
    },
    plural: {
      lower: name.charAt(0).toLowerCase() + name.slice(1),
      upper: name.charAt(0).toUpperCase() + name.slice(1),
    },
  };
}

export const buildVariables = (
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
