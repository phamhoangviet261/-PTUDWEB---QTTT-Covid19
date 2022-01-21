const db = require('./db');
const tbName = 'Account';
const idFieldName = 'username'

module.exports = {
    all: async () => {
        const res = await db.load(tbName);
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
    updateToken: async (id, dataUpdate) => {
        return res = await db.updateToken(tbName, dataUpdate, idFieldName, id);        
    },
    getListOrder: async (id) => {
        return res = await db.run(`select * 
        from public."DonHang" d, public."GoiNhuYeuPham" g 
        where d."MaNLQ" = '${id}' and d."MaNYP" = g."MaNYP"`);   
    },
    getListDetailOrder: async (id) => {
        return res = await db.run(`select * 
        from public."ChiTietDonHang" c, public."SanPham" s 
        where c."MaDH" = '${id}' and c."MaSP" = s."MaSP"`);   
    },
    getUserInfo: async (id) => {
        return res = await db.run(`select * 
        from public."NguoiLienQuanCovid" n, public."PhuongXa" px, public."QuanHuyen" qh, public."TinhThanhPho" t
        where "MaNLQ" = '${id}' and n."MaPhuongXa" = px."MaPhuongXa" and px."MaQuanHuyen" = qh."MaQuanHuyen"
        and qh."MaTinhTP" = t."MaTinhTP"`);   
    },
    getHistoryManagement: async (id) => {
        return res = await db.run(`select * 
        from public."LichSuQuanLy" ls, public."NguoiQuanLy" n
        where ls."MaNQL" = n."MaNQL" and ls."MaNLQ" = '${id}'`);   
    },
    getHistoryStatus: async (id) => {
        return res = await db.run(`select * 
        from public."LichSuTrangThai" 
        where "MaNLQ" = '${id}' order by "STT" ASC`);   
    },
    getHistoryHospital: async (id) => {
        return res = await db.run(`select * 
        from public."LichSuNoiDieuTri" ls, public."NoiDieuTri" ndt, public."PhuongXa" px, public."QuanHuyen" qh, public."TinhThanhPho" t
        where ls."MaNLQ" = '${id}'and ls."MaNDT" = ndt."MaNDT" and ndt."MaPhuongXa" = px."MaPhuongXa" 
        and px."MaQuanHuyen" = qh."MaQuanHuyen" and t."MaTinhTP" = qh."MaTinhTP"`);   
    },
}