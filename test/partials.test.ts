// import { buildPartial } from '../src/builder';
// import { buildNames } from '../src/utils';
import { plural, singular } from 'pluralize';

import { instancePostgraphile } from '../src/index';
// import { variables } from '../src/models';
// const name = buildNames('Users');
import { gql } from 'graphql-request';
const Instance = instancePostgraphile('http://localhost:3020/api/graphql');

const Users = Instance.defineModel('Licenses', { id: 'BigInt' });

test('FindAll', async () => {
  const r = await Users.findAll({
    first: 2,
  });
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

test('FindOne', async () => {
  const r = await Users.findOne();
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

test('Count', async () => {
  const r = await Users.count();
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

test('FindById', async () => {
  const r = await Users.findByPk('1');
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

test('FindBy', async () => {
  const r = await Users.findBy({ 'id:BigInt': '1' });
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

test('Create', async () => {
  const r = await Users.create({ serie: '001-001', type: 'free', cards: 10, days: 365 });
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});

// test('Delete', async () => {
//   const r = await Users.deleteByPk('8');
//   // console.log(query);
//   console.log(r);

//   return expect(true).toEqual(true);
// });

test('Update', async () => {
  const r = await Users.updateByPk('8', { days: 100 });
  // console.log(query);
  console.log(r);

  return expect(true).toEqual(true);
});
