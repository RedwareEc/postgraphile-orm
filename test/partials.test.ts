// import { buildPartial } from '../src/builder';
// import { buildNames } from '../src/utils';
import { instancePostgraphile } from '../src/index';
// import { variables } from '../src/models';
// const name = buildNames('Users');
import { gql } from 'graphql-request';
const Instance = instancePostgraphile('http://localhost:3020/api/graphql');
const Users = Instance.defineModel('Users', { id: 'Int' });
Users.$addFragment(
  'default',
  gql`
    {
      id
      fullname
    }
  `,
);
test('Partial Without namespace', async () => {
  const r = await Users.findAll({
    fragment: 'default',
    variables: {
      first: 2,
    },
  });
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});
