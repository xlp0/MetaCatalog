const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    nama_produk: {
        type: String
    },
    no_produk: {
        type: String,
        unique: true
    },
    harga_utama: Number,
    harga_pemerintah: Number,
    jumlah_stok: Number,
    produk_gambar: String,
    berlaku_sampai: {
        type: Date,
        sparse: true
      },
    nama_manufaktur: String,
    no_produk_penyedia: String,
    uom: String,
    jenis_produk: String,
    kode_kbki: Number,
    tkdn_produk: String,
    nilai_bmp: String,
    sum_tkdn_bmp: Number,
    nama_pemilik_sertifikat_tkdn: String,
    Kind_of_tkdn_product: String,
    spesifikasi: String,
    tanggal_tkdn: {
        type: Date,
        sparse: true
      },
    tanggal_expire_tkdn: {
        type: Date,
        sparse: true
      },
    link_p3dn: String,
    nama_komoditas_kbki: String,
    created_date: {
        type: Date,
        sparse: true
      },
    modified_date: {
      type: Date,
      sparse: true
    },
    komoditas_id: String,
    nama_komoditas: String,
    kelas_harga: String,
    produk_kategori_id: String,
    nama_kategori: String,
    manufaktur_id: String,
    penyedia_id: String,
    nama_penyedia: String
  });

module.exports = mongoose.model('Laptop', laptopSchema);
