const db = require('./db');
const tbName = 'DonNapTien';
const idFieldName = 'MaDNT'

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
    getByMaTKTT: async (matktt) => {
        return res = await db.run(`SELECT * FROM public."DonNapTien" where "MaTKTT" = '${matktt}'`);   
    },
}