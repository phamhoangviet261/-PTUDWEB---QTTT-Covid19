const db = require('./db');
const tbName = 'GoiNhuYeuPham';
const idFieldName = 'MaNYP'

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
    getSPfromNYP: async (nypid) => {
        return res = await db.run(`select * from "SanPham"
        where "MaSP" in (SELECT "MaSP" FROM "ChiTietNhuYeuPham" where "MaNYP" = '${nypid}')`);  
    },
    delete: async (PackageID) => {
        await db.run(`DELETE FROM "ChiTietNhuYeuPham" WHERE "MaNYP" = '${PackageID}'`); 
        return res = await db.run(`DELETE FROM "GoiNhuYeuPham" WHERE "MaNYP" = '${PackageID}'`);  
    }
}