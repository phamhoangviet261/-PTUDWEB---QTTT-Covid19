const db = require('./db');
const tbName = 'GioHang';
const idFieldName = 'MaGH'


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
    ofOne: async (MaNLQ) => {
        return res = await db.run(`SELECT * FROM public."GioHang" WHERE "MaNLQ" = '${MaNLQ}'`);
    },
    addToCart: async (MaNLQ, MaNYP) => {
        return res = await db.run(`INSERT INTO public."GioHang"("MaNLQ", "MaNYP") VALUES ('${MaNLQ}', '${MaNYP}')`);
    }

}