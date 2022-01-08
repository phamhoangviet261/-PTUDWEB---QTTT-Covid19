const pgp = require('pg-promise')({
    capSQL: true,
});
const schema = 'public';
const cn = {
  user: 'postgres',
  host: 'localhost',
  database: 'COVID19',
  password: '1',
  port: 5432,
  max: 30,
};

const db = pgp(cn);

exports.load = async tbName => {
    const table = new pgp.helpers.TableName({table: tbName, schema: schema});
    const qStr = pgp.as.format('SELECT * FROM $1', table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/load:', error);
    }
}

exports.get = async (tbName, fieldName, value) => {
    const table = new pgp.helpers.TableName({table: tbName, schema: schema});
    const qStr = pgp.as.format(`SELECT * FROM $1 WHERE "${fieldName}"='${value}'`, table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/get:', error);
    }
}

exports.delete = async (tbName, fieldName, value) => {
    const table = new pgp.helpers.TableName({table: tbName, schema: schema});
    const qStr = pgp.as.format(`DELETE FROM $1 WHERE "${fieldName}"='${value}'`, table);
    try {
        const res = await db.any(qStr);
        return res;
    } catch (error){
        console.log('error db/delete:', error);
    }
}

exports.add = async (tbName, entity) => {
    const table = new pgp.helpers.TableName({table: tbName, schema: schema});
    const qStr = pgp.helpers.insert(entity, null, table) + ' RETURNING *';
    try {
        const res = await db.one(qStr);
        return res;
    } catch (error){
        console.log('error db/add:', error);
    }
}

exports.update = async (tbName, entity, fieldName, id) => {
    const table = new pgp.helpers.TableName({ table: tbName, schema })
    const condition = pgp.as.format(` WHERE "${fieldName}" = '${id}' `, entity);
    const qStr = pgp.helpers.update(entity, null, table) + condition + 'RETURNING *'
    try {
        const res = await db.one(qStr)
        return res
    } catch (error) {
        console.log('error db/update : ', error)
    }
}

exports.updateToken = async (tbName, entity, fieldName, id) => {
    const table = new pgp.helpers.TableName({ table: tbName, schema })
    const condition = pgp.as.format(` WHERE "${fieldName}" = '${id}' `, entity);
    const qStr = pgp.helpers.update(entity, ['token'], table)+ condition + 'RETURNING *'
    try {
        const res = await db.one(qStr)
        return res
    } catch (error) {
        console.log('error db/update : ', error)
    }
}

// Export it to use db.any to query
exports.getN = async (n) => {
    const res = await db.any('select * from "SanPham" order by random() desc limit $1', n);
    return res;
}