const db = require('./db');
const tbName = 'LichSuTrangThai';
const idFieldName = 'MaNQL'

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
    getNumberHumanByStatusAndTime: async () => {
        return res = await db.run('select extract(year from "NgayTao") as "Nam", extract(month from "NgayTao") as "Thang", "TrangThai", count(*) as "SoLuong" from public."LichSuTrangThai" group by extract(year from "NgayTao"), extract(month from "NgayTao"), "TrangThai" order by "Nam", "Thang", "TrangThai";');
    },
    getNYPsale: async () => {
        return res = await db.run('select count(*), g."TenGoi" from public."DonHang" d, public."GoiNhuYeuPham" g where d."MaNYP" = g."MaNYP" group by d."MaNYP", g."TenGoi" ;');
    },
    getSPsale: async () => {
        return res = await db.run('select s."TenSP", sum(ct."SoLuong")  from public."ChiTietDonHang" ct, public."SanPham" s where ct."MaSP" = s."MaSP" group by s."MaSP", s."TenSP"');
    },
    getSevenueDNT: async () => {
        return res = await db.run('select extract(year from "ThoiGian") as "Nam", extract(month from "ThoiGian") as "Thang", sum("SoTien") as "SoTien" from public."DonNapTien" group by extract(year from "ThoiGian"), extract(month from "ThoiGian") order by "Nam", "Thang";');
    },
}