import { Names, OptionsBuild, SchemaPartial } from 'types';
import { buildPartial } from '../builder';
export const variables = {
  all: {
    first: 'Int',
    offset: 'Int',
    condition: '<%name.singular.upper%>Condition',
    filter: '<%name.singular.upper%>Filter',
    orderBy: '[<%name.plural.upper%>OrderBy!]',
  },
  create: {
    data: {
      key: '<%name.singular.lower%>',
      type: '<%name.singular.upper%>Input!',
    },
  },
};
interface Options {
  name: Names;
  namespace: string;
  schema: SchemaPartial;
}
