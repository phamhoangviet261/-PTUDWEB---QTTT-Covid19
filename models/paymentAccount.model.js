const db = require('./db');
const tbName = 'TaiKhoanThanhToan';
const idFieldName = 'MaTKTT'

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
    tinhTien: async (money, matktt) => {
        return res = await db.run(`update public."TaiKhoanThanhToan" set "SoDu" = '${money}' where "MaTKTT" = '${matktt}'`);        
    },
    naptien: async (money, matktt) => {
        return res = await db.run(`update public."TaiKhoanThanhToan" set "SoDu" = "SoDu" + ${money} where "MaTKTT" = '${matktt}'`);        
    },
    changelimit: async (money, matktt) => {
        return res = await db.run(`update public."TaiKhoanThanhToan" set "HanMucToiThieu" = ${money} where "MaTKTT" = '${matktt}'`);        
    }
}