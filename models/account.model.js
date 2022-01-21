const db = require('./db');
const tbName = 'Account';
const idFieldName = 'username'

module.exports = {
    all: async () => {
        const res = await db.load(tbName);
        return res;
    },
    topN: async (n) => {
        const res = await db.getN(n);
        return res;
    },
    get: async username => {
        const res = await db.get(tbName, idFieldName, username);
        if (res.length > 0){
            return res[0];
        }

        return null;
    },
    add: async user => {
        const res = await db.add(tbName, user);
        return res;
    },
    update: async (id, dataUpdate) => {
        return res = await db.update(tbName, dataUpdate, idFieldName, id);        
    },
    updatePassword: async (id, newPassword) => {
        return res = await db.run(`update public."Account" 
        set "password" = '${newPassword}' where "username" = '${id}'`);   
    },
    getAdmin: async () => {
        return res = await db.run(`select count(*) from public."Account" where "accountType" = 0`);   
    },
    getAccountAdmin: async () => {
        return res = await db.run(`select * from public."Account" where "accountType" = 0`);   
    },
    ban: async (u) => {
        return res = await db.run(`update public."Account" set "status" = 'banned' where "username" = '${u}'`);   
    },
    unban: async (u) => {
        return res = await db.run(`update public."Account" set "status" = 'active' where "username" = '${u}'`);   
    }
}