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
    addToCart: async (MaNLQ, MaNYP, TongTien, TenGoi) => {
        return res = await db.run(`INSERT INTO public."GioHang"("MaNLQ", "MaNYP", "SoLuong", "TongTien", "TenGoi") VALUES ('${MaNLQ}', '${MaNYP}', 1, ${TongTien}, '${TenGoi}')`);
    },
    getTotal: async (MaNLQ) => {
        return res = await db.run(`SELECT Sum("TongTien") as "TongTien" FROM public."GioHang" WHERE "MaNLQ" = '${MaNLQ}'`);
    },
    delete: async (MaGH) => {
        return res = await db.run (`DELETE FROM public."GioHang" WHERE "MaGH" = '${MaGH}'`);
    },
    plus: async (MaGH, GiaTien) => {
        return res = await db.run(`UPDATE public."GioHang" SET "SoLuong" = "SoLuong" + 1, "TongTien" = "TongTien" + ${GiaTien} WHERE "MaGH" = '${MaGH}'`);
    },
    minus: async (MaGH, GiaTien) => {
        return res = await db.run(`UPDATE public."GioHang" SET "SoLuong" = "SoLuong" - 1, "TongTien" = "TongTien" - ${GiaTien} WHERE "MaGH" = '${MaGH}'`);
    }

}