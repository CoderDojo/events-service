const fs = require('fs');

module.exports = async (db) => {
  const sqlFile = fs.readFileSync(`${__dirname}/orders.sql`, 'utf8');
  await db.raw(sqlFile);
  await db('cd_orders').insert({
    id: '642860e5-7f5f-4171-90ce-cc501856b882',
    event_id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    user_id: '575fefc6-e9c2-44c8-8e2a-0e1933e6b42e',
    created_at: new Date(),
  });
  await db('cd_orders').insert({
    id: '3a9413a5-0399-42c2-b0c1-e2d384600e87',
    event_id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    user_id: 'cce1e3eb-9211-4b9b-8ce2-d09b40bbca1d',
    created_at: new Date(),
  });
  await db('cd_orders').insert({
    id: 'a57baaf8-cf99-4470-b078-b7e822d22288',
    event_id: 'a60dc59d-2db2-4d5d-a6d3-c08473dee5d4',
    user_id: 'cce1e3eb-9211-4b9b-8ce2-d09b40bbca1d',
    created_at: new Date(),
  });
};
