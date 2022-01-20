const db = require('./db');
const tbName = 'ChiTietNhuYeuPham';
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
            return res;
        }

        return null;
    },
    add: async user => {
        const res = await db.add(tbName, user);
        return res;
    },
    update: async (dataUpdate) => {
        return res = await db.run(`UPDATE "ChiTietNhuYeuPham" SET "SoLuong" = ${dataUpdate.SoLuong}, "GioiHanSL" = ${dataUpdate.GioiHanSL} WHERE "MaNYP" = '${dataUpdate.MaNYP}' AND "MaSP" = '${dataUpdate.MaSP}'`);        
    },
    delete: async (idPackage, idProduct) => {
        return res = await db.run(`DELETE FROM "ChiTietNhuYeuPham" WHERE "MaNYP" = '${idPackage}' AND "MaSP" = '${idProduct}'`);        
    }
}