import { singular, plural } from 'pluralize';
import { Names, EngineVariables } from 'types';
import { path } from 'ramda';
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

export function engine(tpl: string, data: EngineVariables): string {
  let match;
  // do {
  const re = /<%([^%>]+)?%>/;

  while ((match = re.exec(tpl)) !== null) {
    const val = path<string>(match[1].split('.'), data) || '';
    tpl = tpl.replace(match[0], val);
  }

  return tpl;
}

export const buildBy = (
  _by: Record<string, string>,
): { by: string; fragment: string } => {
  const keys = Object.keys(_by);
  const by = keys.map((v) => capitalize(v)).join('And');
  const fragment = keys[0];

  return {
    by,
    fragment,
  };
};
