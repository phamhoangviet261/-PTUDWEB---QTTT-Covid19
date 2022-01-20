const db = require('./db');
const tbName = 'NoiDieuTri';
const idFieldName = 'MaNDT'

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
    getNDT: async (manlq) => {
        return res = await db.run(`SELECT * FROM public."NoiDieuTri"
        WHERE "MaNDT" =  (SELECT "MaNDT" FROM public."LichSuNoiDieuTri" WHERE "MaNLQ" = '${manlq}')`);
    },
    getNDT2: async (mapx) => {
        return res = await db.run(`SELECT * FROM public."NoiDieuTri" WHERE "MaPhuongXa" = '${mapx}'`);
    }
}