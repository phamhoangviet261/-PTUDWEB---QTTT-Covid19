const db = require('./db');
const tbName = 'NguoiLienQuanCovid';
const idFieldName = 'MaNLQ'

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
    findF1: async (manlq) => {
        return res = await db.run(`SELECT *
        FROM "NguoiLienQuanCovid" 
        where "MaNLQ" IN (SELECT "MaNLQ" FROM "NguoiLienQuanCovid" where "MaNLQTruoc" = '${manlq}')`);   
    },
    findF2: async (manlq) => {
        return res = await db.run(`SELECT *
        FROM "NguoiLienQuanCovid"
        where "MaNLQTruoc" IN (SELECT "MaNLQ"
        FROM "NguoiLienQuanCovid" 
        where "MaNLQ" IN (SELECT "MaNLQ" FROM "NguoiLienQuanCovid" where "MaNLQTruoc" = '${manlq}'))
        `);   
    },
    findF3: async (manlq) => {
        return res = await db.run(`SELECT *
        FROM "NguoiLienQuanCovid" 
        where "MaNLQ" IN (SELECT "MaNLQ" FROM "NguoiLienQuanCovid" where "MaNLQTruoc" = '${manlq}')`);   
    },
    getAll: async () => {
        return res = await db.run(`SELECT * FROM public."NguoiLienQuanCovid" ORDER BY "MaNLQ" ASC `);   
    },
}