// import { buildPartial } from '../src/builder';
// import { buildNames } from '../src/utils';
import { plural, singular } from 'pluralize';

import { instancePostgraphile } from '../src/index';
// import { variables } from '../src/models';
// const name = buildNames('Users');
import { gql } from 'graphql-request';
const Instance = instancePostgraphile('http://localhost:3020/api/graphql');

const Users = Instance.defineModel('Licenses', { id: 'BigInt' });

Users.$addFragment('idSerie', {
  query: gql`
    {
      id
      serie
    }
  `,
});
test('Partial Without namespace', async () => {
  const r = await Users.findAll(
    {
      first: 2,
    },
    { nameFragment: 'idSerie' },
  );
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});
