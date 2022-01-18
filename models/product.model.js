const db = require('./db');
const tbName = 'SanPham';
const idFieldName = 'MaSP'

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
    add: async product => {
        const res = await db.add(tbName, product);
        return res;
    },
    update: async (id, dataUpdate) => {
        return res = await db.update(tbName, dataUpdate, idFieldName, id);        
    },
    getPackage: async (productId) => {
        return res = await db.run(`SELECT * FROM "GoiNhuYeuPham" 
        where "MaNYP" in ( select "MaNYP" from "ChiTietNhuYeuPham" where "MaSP" = '${productId}' )`);   
    },
    delete: async (productId) => {
        return res = await db.run(`DELETE FROM "SanPham" WHERE "MaSP" = '${productId}'`);
    }
    
}