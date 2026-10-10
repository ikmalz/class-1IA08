/**
 * Data jadwal kuliah Class 1IA08 (disalin dari gambar jadwal).
 * `jam` = jam ke-… [mulai, selesai]. Ruang/dosen/penanda ubah di sini saja.
 *
 * Penanda (* atau **) disalin apa adanya dari jadwal asli.
 * Isi MARKER_LEGEND jika ingin menampilkan arti penandanya di halaman.
 */

export const jadwal = [
  { id: 1,  hari: "Senin",  mataKuliah: "Algoritma & Pemrograman 1C",      penanda: "",   jam: [3, 4], ruang: "G425", dosen: "Ety Sutanty" },
  { id: 2,  hari: "Senin",  mataKuliah: "Peng. Tekno. Komp. & Inf. A",     penanda: "**", jam: [5, 6], ruang: "G425", dosen: "Puji Sularsih" },
  { id: 3,  hari: "Senin",  mataKuliah: "Bahasa Inggris",                  penanda: "",   jam: [7, 8], ruang: "G425", dosen: "Suyudi" },
  { id: 5,  hari: "Selasa", mataKuliah: "Peng. Tekno. Komp. & Inf. C",     penanda: "**", jam: [9, 10], ruang: "G315", dosen: "Eel Susilowati" },

  { id: 4,  hari: "Selasa", mataKuliah: "Fisika & Kimia Dasar 1B",         penanda: "",   jam: [1, 2], ruang: "G315", dosen: "Ati Harmoni" },
  { id: 6,  hari: "Selasa", mataKuliah: "Fisika & Kimia Dasar 1A",         penanda: "",   jam: [6, 7], ruang: "G149", dosen: "Aji Abdillah Kharisma" },

  { id: 7,  hari: "Rabu",   mataKuliah: "Matematika Dasar 1",              penanda: "",   jam: [3, 4], ruang: "E523", dosen: "Didiek Pramono" },
  { id: 8,  hari: "Rabu",   mataKuliah: "Algoritma & Pemrograman 1A",      penanda: "",   jam: [5, 6], ruang: "E315", dosen: "Anacostia Kowanda" },
  { id: 9,  hari: "Rabu",   mataKuliah: "Peng. Tekno. Komp. & Inf. B",     penanda: "**", jam: [8, 9], ruang: "E523", dosen: "Eka Fitri Rahayu" },

  { id: 10, hari: "Kamis",  mataKuliah: "Matematika Informatika 1",        penanda: "**", jam: [1, 2], ruang: "G432", dosen: "Vinny Nazalita" },
  { id: 11, hari: "Kamis",  mataKuliah: "Algoritma & Pemrograman 1B",      penanda: "",   jam: [3, 4], ruang: "G432", dosen: "Ratri Purwaningtyas" },
  { id: 12, hari: "Kamis",  mataKuliah: "Pendidikan Pancasila",            penanda: "*",  jam: [6, 7], ruang: "G315", dosen: "Meti Nurhayati" },
  { id: 13, hari: "Kamis",  mataKuliah: "Bahasa Indonesia",                penanda: "",   jam: [8, 9], ruang: "G315", dosen: "Rosi Rosidah" },
];

// Isi artinya jika ingin tampil di bawah jadwal, mis. { "*": "Keterangan …" }
export const MARKER_LEGEND = {
  "*": "",
  "**": "",
};

export const KELAS = "1IA08";

const URUTAN_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** Hari yang punya jadwal, urut Senin → Sabtu */
export const HARI_AKTIF = URUTAN_HARI.filter((h) =>
  jadwal.some((j) => j.hari === h),
);