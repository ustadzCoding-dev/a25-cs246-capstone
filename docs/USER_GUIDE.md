# 📖 User Guide - DC-09 Capstone Project Management System

Panduan lengkap untuk menggunakan sistem DC-09 Capstone Project Management.

---

## 📋 Table of Contents

1. [Panduan Umum](#panduan-umum)
2. [Panduan Mahasiswa](#panduan-mahasiswa)
3. [Panduan Admin](#panduan-admin)
4. [FAQ](#faq)
5. [Troubleshooting](#troubleshooting)
6. [Tips & Tricks](#tips--tricks)

---

## 🎯 Panduan Umum

### Akses Sistem

**URL Aplikasi:** http://localhost:5173 (Development) atau https://yourdomain.com (Production)

### Login/Register

#### Cara Login

1. **Buka halaman login**

   - Klik tombol "Login" di halaman utama
   - Atau akses langsung: `/login`

2. **Pilih metode login:**

   - **Email & Password:** Masukkan email dan password Anda
   - **Google Sign-In:** Klik tombol "Sign in with Google"

3. **Klik "Login"**
   - Sistem akan memverifikasi kredensial
   - Anda akan diarahkan ke dashboard

#### Cara Register (Mahasiswa Baru)

1. **Buka halaman register**

   - Klik tombol "Register" di halaman login
   - Atau akses langsung: `/register`

2. **Isi form registrasi:**

   - **Nama Lengkap:** Masukkan nama Anda
   - **Email:** Gunakan email aktif (akan diverifikasi)
   - **Password:** Minimal 8 karakter
   - **Learning Path:** Pilih jalur pembelajaran Anda:
     - Front-End Web Development
     - Back-End Web Development
     - Multi-Platform Mobile Development
     - React Native
     - Machine Learning

3. **Klik "Register"**
   - Email verifikasi akan dikirim
   - Verifikasi email Anda
   - Akun siap digunakan

### Navigasi Umum

#### Menu Utama (Mahasiswa)

```
Dashboard
├── Tim Saya (My Team)
├── Dokumen (Documents)
├── Timeline
├── Pengumuman (Announcements)
└── Profil (Profile)
```

#### Menu Utama (Admin)

```
Dashboard
├── Manajemen Tim (Team Management)
├── Dokumen (Documents)
├── Timeline
├── Pengumuman (Announcements)
└── Profil (Profile)
```

### Mengubah Profil

1. **Klik menu "Profil"** di navigasi utama
2. **Edit informasi:**
   - Nama
   - Email
   - Universitas
   - Foto Profil
3. **Klik "Simpan"** untuk menyimpan perubahan

### Logout

1. **Klik avatar/nama Anda** di sudut kanan atas
2. **Pilih "Logout"**
3. Anda akan diarahkan ke halaman login

---

## 👨‍🎓 Panduan Mahasiswa

### 1. Mendaftar Tim

#### Langkah-Langkah Pendaftaran Tim

1. **Buka "Tim Saya"**

   - Klik menu "Tim Saya" di navigasi utama
   - Atau akses: `/student/team`

2. **Klik "Daftar Tim Baru"**

   - Tombol berwarna hijau di halaman Tim Saya

3. **Pilih Use Case**

   - Lihat daftar use case yang tersedia
   - Baca deskripsi setiap use case
   - Pilih use case yang sesuai dengan minat Anda
   - Sistem akan menampilkan:
     - Deskripsi use case
     - Komposisi tim yang dibutuhkan
     - Jumlah slot yang tersedia

4. **Isi Nama Tim**

   - Masukkan nama tim yang unik
   - Nama tim harus berbeda dengan tim lain
   - Contoh: "Team Alpha", "Innovators", "Code Warriors"

5. **Tambahkan Anggota Tim**

   - Sistem akan menampilkan form untuk menambah anggota
   - Jumlah field sesuai dengan komposisi yang dibutuhkan
   - **Untuk setiap anggota:**
     - Masukkan ID Mahasiswa/User ID
     - Sistem akan otomatis mengambil learning path
     - Verifikasi learning path sudah sesuai

6. **Verifikasi Komposisi**

   - Pastikan jumlah anggota sesuai dengan kebutuhan
   - Pastikan learning path sesuai dengan requirement
   - Contoh: Jika butuh 2 Front-End + 3 ML, pastikan sudah tepat

7. **Klik "Daftar Tim"**
   - Form akan divalidasi
   - Jika ada error, perbaiki dan coba lagi
   - Jika berhasil, tim akan dibuat dengan status "Pending"

#### Contoh Pendaftaran

**Use Case:** DC-01 E-Commerce Platform

- **Komposisi:** 2 Front-End + 3 Back-End
- **Nama Tim:** "Team Alpha"
- **Anggota:**
  1. fui0001 (Front-End) ✓
  2. fui0002 (Front-End) ✓
  3. bui0001 (Back-End) ✓
  4. bui0002 (Back-End) ✓
  5. bui0003 (Back-End) ✓

### 2. Mengelola Undangan Tim

#### Menerima Undangan

1. **Buka "Tim Saya"**

   - Lihat bagian "Undangan Tertunda" (Pending Invitations)
   - Sistem menampilkan daftar undangan yang belum dijawab

2. **Lihat Detail Undangan**

   - Nama Tim
   - Nama Leader
   - Use Case yang dipilih
   - Tanggal undangan

3. **Terima atau Tolak**

   - **Klik "Terima"** untuk bergabung dengan tim

     - Status undangan berubah menjadi "Diterima"
     - Anda akan ditambahkan ke tim
     - Email konfirmasi akan dikirim ke leader

   - **Klik "Tolak"** jika ingin menolak
     - Anda dapat menambahkan alasan penolakan
     - Status undangan berubah menjadi "Ditolak"
     - Leader akan menerima notifikasi

#### Melihat Tim Saya

1. **Buka "Tim Saya"**
2. **Lihat informasi tim:**

   - Nama Tim
   - Leader
   - Anggota Tim
   - Use Case
   - Status Tim (Pending/Approved/Rejected)
   - Tanggal Pendaftaran

3. **Jika status "Pending":**

   - Tim sedang menunggu persetujuan admin
   - Anda dapat mengedit anggota tim
   - Klik "Edit Tim" untuk mengubah anggota

4. **Jika status "Approved":**

   - Tim sudah disetujui admin
   - Anda dapat mulai mengerjakan capstone
   - Lihat Team ID yang diberikan admin

5. **Jika status "Rejected":**
   - Tim ditolak oleh admin
   - Baca alasan penolakan
   - Anda dapat mendaftar tim baru dengan perbaikan

### 3. Mengedit Tim (Sebelum Disetujui)

1. **Buka "Tim Saya"**
2. **Klik "Edit Tim"** (hanya tersedia jika status "Pending")
3. **Ubah anggota:**

   - Tambah anggota baru
   - Hapus anggota yang tidak sesuai
   - Verifikasi learning path

4. **Klik "Simpan Perubahan"**
   - Sistem akan memvalidasi komposisi baru
   - Jika valid, tim akan diupdate
   - Undangan baru akan dikirim ke anggota baru

### 4. Melihat Dokumen

1. **Klik menu "Dokumen"**

   - Atau akses: `/student/documents`

2. **Lihat daftar dokumen:**

   - Judul dokumen
   - Deskripsi
   - Kategori
   - Tanggal upload

3. **Download dokumen:**

   - Klik tombol "Download"
   - File akan diunduh ke komputer Anda

4. **Buka link eksternal:**
   - Jika dokumen adalah link eksternal
   - Klik tombol "Buka Link"
   - Link akan dibuka di tab baru

### 5. Melihat Timeline

1. **Klik menu "Timeline"**

   - Atau akses: `/student/timeline`

2. **Lihat milestone capstone:**

   - Judul milestone
   - Deskripsi
   - Tanggal mulai dan berakhir
   - Status (Upcoming/Ongoing/Completed)

3. **Pantau deadline:**
   - Milestone yang akan datang ditampilkan dengan warna berbeda
   - Pastikan tim Anda memenuhi deadline

### 6. Melihat Pengumuman

1. **Klik menu "Pengumuman"**

   - Atau akses: `/student/announcements`

2. **Lihat daftar pengumuman:**

   - Judul pengumuman
   - Isi pengumuman
   - Tipe (Info/Warning/Success/Error)
   - Tanggal pengumuman

3. **Baca pengumuman penting:**
   - Pengumuman berwarna merah adalah penting
   - Pastikan Anda membaca semua pengumuman

---

## 👨‍💼 Panduan Admin

### 1. Dashboard Admin

1. **Buka Dashboard Admin**

   - Klik menu "Dashboard" setelah login sebagai admin
   - Atau akses: `/admin/dashboard`

2. **Lihat statistik:**

   - Total tim
   - Tim pending (menunggu persetujuan)
   - Tim approved (sudah disetujui)
   - Tim rejected (ditolak)
   - Total mahasiswa

3. **Akses menu admin:**
   - Manajemen Tim
   - Dokumen
   - Timeline
   - Pengumuman

### 2. Mengelola Tim

#### Melihat Daftar Tim

1. **Klik "Manajemen Tim"**

   - Atau akses: `/admin/teams`

2. **Filter tim:**

   - **Status:** Pending, Approved, Rejected
   - **Use Case:** Filter berdasarkan use case
   - **Search:** Cari berdasarkan nama tim

3. **Lihat informasi tim:**
   - Nama Tim
   - Leader
   - Anggota
   - Use Case
   - Status
   - Tanggal Pendaftaran

#### Menyetujui Tim

1. **Buka daftar tim dengan status "Pending"**
2. **Klik tim yang ingin disetujui**
3. **Verifikasi informasi:**

   - Cek komposisi tim sesuai requirement
   - Cek semua anggota sudah menerima undangan
   - Cek tidak ada anggota yang menolak

4. **Klik "Setujui Tim"**

   - Sistem akan memvalidasi
   - Jika valid, status berubah menjadi "Approved"
   - Email notifikasi dikirim ke semua anggota tim

5. **Assign Team ID (opsional):**
   - Masukkan Team ID unik
   - Contoh: "A25-CS246-001"
   - Klik "Assign ID"

#### Menolak Tim

1. **Buka daftar tim dengan status "Pending"**
2. **Klik tim yang ingin ditolak**
3. **Klik "Tolak Tim"**
4. **Masukkan alasan penolakan:**
   - Komposisi tidak sesuai
   - Ada anggota yang tidak valid
   - Lainnya
5. **Klik "Kirim"**
   - Status berubah menjadi "Rejected"
   - Email notifikasi dikirim ke leader
   - Leader dapat mendaftar tim baru dengan perbaikan

#### Bulk Operations

1. **Pilih beberapa tim:**

   - Centang checkbox di setiap tim
   - Atau centang "Pilih Semua"

2. **Klik "Bulk Approve":**

   - Semua tim terpilih akan disetujui sekaligus
   - Email notifikasi dikirim ke semua tim

3. **Klik "Bulk Reject":**

   - Semua tim terpilih akan ditolak sekaligus
   - Masukkan alasan penolakan
   - Email notifikasi dikirim ke semua leader

4. **Export ke CSV:**
   - Klik "Export CSV"
   - Data tim akan diunduh dalam format CSV

### 3. Mengelola Dokumen

#### Upload Dokumen

1. **Klik menu "Dokumen"**

   - Atau akses: `/admin/documents`

2. **Klik "Upload Dokumen Baru"**

3. **Isi form upload:**

   - **Judul:** Nama dokumen
   - **Deskripsi:** Penjelasan singkat
   - **Kategori:** Pilih kategori (Guidance, Reference, etc)
   - **File:** Pilih file dari komputer
     - Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
     - Ukuran maksimal: 50MB
   - **Link Eksternal (opsional):** Jika dokumen adalah link

4. **Klik "Upload"**
   - File akan diupload ke Cloudinary
   - Dokumen akan muncul di daftar

#### Edit Dokumen

1. **Buka daftar dokumen**
2. **Klik dokumen yang ingin diedit**
3. **Ubah informasi:**

   - Judul
   - Deskripsi
   - Kategori
   - File (opsional)

4. **Klik "Simpan"**

#### Hapus Dokumen

1. **Buka daftar dokumen**
2. **Klik dokumen yang ingin dihapus**
3. **Klik "Hapus"**
4. **Konfirmasi penghapusan**
   - Dokumen akan dihapus dari sistem

### 4. Mengelola Timeline

#### Membuat Milestone

1. **Klik menu "Timeline"**

   - Atau akses: `/admin/timeline`

2. **Klik "Tambah Milestone"**

3. **Isi form milestone:**

   - **Judul:** Nama milestone
   - **Deskripsi:** Penjelasan detail
   - **Tanggal Mulai:** Kapan milestone dimulai
   - **Tanggal Berakhir:** Kapan milestone berakhir
   - **Status:** Upcoming/Ongoing/Completed

4. **Klik "Buat"**
   - Milestone akan ditambahkan ke timeline

#### Edit Milestone

1. **Buka daftar timeline**
2. **Klik milestone yang ingin diedit**
3. **Ubah informasi**
4. **Klik "Simpan"**

#### Hapus Milestone

1. **Buka daftar timeline**
2. **Klik milestone yang ingin dihapus**
3. **Klik "Hapus"**
4. **Konfirmasi penghapusan**

### 5. Mengelola Pengumuman

#### Membuat Pengumuman

1. **Klik menu "Pengumuman"**

   - Atau akses: `/admin/announcements`

2. **Klik "Buat Pengumuman"**

3. **Isi form pengumuman:**

   - **Judul:** Judul pengumuman
   - **Isi:** Konten pengumuman
   - **Tipe:** Info/Warning/Success/Error
     - Info: Informasi umum
     - Warning: Peringatan penting
     - Success: Berita baik
     - Error: Masalah/kesalahan

4. **Klik "Buat"**
   - Pengumuman akan ditampilkan ke semua mahasiswa

#### Edit Pengumuman

1. **Buka daftar pengumuman**
2. **Klik pengumuman yang ingin diedit**
3. **Ubah informasi**
4. **Klik "Simpan"**

#### Hapus Pengumuman

1. **Buka daftar pengumuman**
2. **Klik pengumuman yang ingin dihapus**
3. **Klik "Hapus"**

### 3. Mengelola Use Cases

#### Melihat Daftar Use Case

1. **Klik menu "Use Cases"**

   - Atau akses: `/admin/usecases`

2. **Lihat daftar use case:**

   - Use Case ID
   - Judul
   - Deskripsi
   - Komposisi tim saat ini
   - Total anggota tim

3. **Lihat komposisi tim:**
   - Learning path yang dibutuhkan
   - Jumlah anggota per learning path
   - Total team size

#### Menambah Use Case Baru

1. **Klik "Tambah Use Case"**

   - Tombol berwarna hijau di halaman Use Cases

2. **Isi form use case:**

   - **Use Case ID:** Identitas unik (contoh: DC-01)
   - **Judul:** Nama use case (contoh: E-Commerce Platform)
   - **Deskripsi:** Penjelasan detail tentang use case
   - **Partner:** Nama perusahaan partner (opsional)
   - **Total Slots:** Jumlah tim yang bisa mengambil use case ini
   - **Difficulty:** Tingkat kesulitan (Easy/Medium/Hard)

3. **Klik "Simpan"**
   - Use case akan ditambahkan ke daftar
   - Komposisi tim bisa diatur setelah dibuat

#### Edit Komposisi Tim

1. **Buka daftar use case**
2. **Klik tombol edit (pensil)** pada use case yang ingin diubah
3. **Atur komposisi tim:**

   - Pilih learning path dari dropdown
   - Masukkan jumlah anggota untuk setiap learning path
   - Sistem otomatis menghitung total team size

4. **Tambah learning path (opsional):**

   - Klik "Tambah Learning Path"
   - Pilih learning path baru
   - Masukkan jumlah anggota

5. **Hapus learning path (opsional):**

   - Klik "Hapus" pada learning path yang ingin dihapus
   - Minimal harus ada 1 learning path

6. **Klik "Simpan"**
   - Komposisi tim akan disimpan
   - Akan ditampilkan di daftar use case

#### Hapus Use Case

1. **Buka daftar use case**
2. **Klik tombol hapus (trash)** pada use case yang ingin dihapus
3. **Konfirmasi penghapusan**

   - Sistem akan menampilkan dialog konfirmasi
   - Pastikan tidak ada tim yang sudah menggunakan use case ini

4. **Klik "Ya, Hapus"**
   - Use case akan dihapus dari sistem

### 4. Mengelola Users

#### Melihat Daftar User

1. **Klik menu "Users"**

   - Atau akses: `/admin/users`

2. **Lihat statistik user:**

   - Total Users: Jumlah seluruh user di sistem
   - Students: Jumlah user dengan role student
   - Admins: Jumlah user dengan role admin

3. **Lihat informasi user dalam tabel:**
   - Nama
   - Email
   - Student ID (Dicoding ID)
   - Role (Student/Admin)
   - Learning Path
   - Status (Active/Inactive - hanya untuk student)

#### Search & Filter User

1. **Search user:**

   - Masukkan nama, email, atau student ID di kolom search
   - Sistem akan menampilkan user yang sesuai secara real-time

2. **Filter berdasarkan role:**

   - Klik dropdown "Filter by Role"
   - Pilih "Student" atau "Admin"
   - Sistem akan menampilkan user dengan role yang dipilih

3. **Reset filter:**
   - Klik tombol "Reset Filters"
   - Semua filter akan dihapus
   - Daftar user akan kembali normal

#### Lihat Detail User

1. **Buka daftar user**
2. **Klik tombol "Lihat"** pada user yang ingin dilihat detailnya
3. **Modal detail user akan muncul dengan informasi:**

   - Nama lengkap
   - Email
   - Student ID (Dicoding ID)
   - Role
   - Learning Path
   - Status (Active/Inactive)
   - Tanggal dibuat

4. **Klik "Tutup"** untuk menutup modal

#### Ubah Role User

1. **Buka daftar user**
2. **Klik tombol "Ubah Role"** pada user yang ingin diubah rolenya
3. **Modal ubah role akan muncul:**

   - Pilih role baru dari dropdown (Student/Admin)
   - Pastikan Anda yakin dengan perubahan ini

4. **Klik "Ubah Role"**

   - Role user akan diubah
   - User akan memiliki akses sesuai role baru

5. **Klik "Batal"** jika ingin membatalkan perubahan

#### Pagination

1. **Navigasi halaman:**

   - Klik tombol "Sebelumnya" untuk halaman sebelumnya
   - Klik tombol "Selanjutnya" untuk halaman berikutnya
   - Klik nomor halaman untuk langsung ke halaman tertentu

2. **Lihat informasi pagination:**
   - Menampilkan X-Y dari Z users
   - Contoh: "Menampilkan 1-10 dari 45 users"

---

## ❓ FAQ

### Pertanyaan Umum

**Q: Bagaimana cara mendaftar tim?**
A: Buka menu "Tim Saya", klik "Daftar Tim Baru", pilih use case, isi nama tim, tambahkan anggota, dan klik "Daftar Tim".

**Q: Berapa jumlah anggota tim yang dibutuhkan?**
A: Tergantung use case yang dipilih. Setiap use case memiliki komposisi yang berbeda (biasanya 5 anggota).

**Q: Apa yang harus dilakukan jika tim ditolak?**
A: Baca alasan penolakan dari admin, perbaiki komposisi atau anggota tim, dan daftar tim baru.

**Q: Bisakah saya mengedit tim setelah disetujui?**
A: Tidak, tim tidak bisa diedit setelah status "Approved". Hubungi admin jika ada perubahan.

**Q: Bagaimana cara mengganti anggota tim yang KE-DO?**
A: Hubungi admin untuk meminta bantuan mengganti anggota.

**Q: Apa itu Team ID?**
A: Team ID adalah identitas unik tim yang diberikan admin setelah tim disetujui.

**Q: Berapa lama proses persetujuan tim?**
A: Biasanya 1-3 hari kerja tergantung jumlah tim yang pending.

**Q: Bagaimana cara download dokumen?**
A: Buka menu "Dokumen", pilih dokumen, klik "Download".

**Q: Apakah saya bisa melihat tim mahasiswa lain?**
A: Tidak, mahasiswa hanya bisa melihat tim mereka sendiri.

**Q: Bagaimana jika lupa password?**
A: Klik "Lupa Password" di halaman login, masukkan email, dan ikuti instruksi yang dikirim.

---

## 🔧 Troubleshooting

### Masalah Login

**Masalah: Tidak bisa login dengan email dan password**

Solusi:

1. Pastikan email dan password sudah benar
2. Cek apakah akun sudah diverifikasi
3. Coba reset password
4. Coba login dengan Google OAuth
5. Hubungi admin jika masalah berlanjut

**Masalah: Google OAuth tidak bekerja**

Solusi:

1. Pastikan browser sudah login ke Google
2. Cek koneksi internet
3. Coba di browser lain
4. Clear cookies dan cache browser
5. Hubungi admin jika masalah berlanjut

### Masalah Pendaftaran Tim

**Masalah: Tidak bisa menambah anggota tim**

Solusi:

1. Pastikan ID mahasiswa sudah benar
2. Pastikan mahasiswa sudah terdaftar di sistem
3. Cek learning path mahasiswa sesuai requirement
4. Refresh halaman dan coba lagi
5. Hubungi admin jika masalah berlanjut

**Masalah: Komposisi tim tidak valid**

Solusi:

1. Verifikasi jumlah anggota sesuai requirement
2. Verifikasi learning path sesuai requirement
3. Contoh: Jika butuh 2 FE + 3 ML, pastikan tepat
4. Perbaiki dan coba daftar lagi

**Masalah: Tidak bisa menerima undangan**

Solusi:

1. Refresh halaman
2. Cek apakah undangan sudah expired
3. Hubungi leader tim
4. Hubungi admin jika masalah berlanjut

---

## 💡 Tips & Tricks

### Tips untuk Mahasiswa

1. **Persiapkan data anggota tim sebelum mendaftar**

   - Kumpulkan ID mahasiswa semua anggota
   - Verifikasi learning path setiap anggota
   - Pastikan semua anggota siap bergabung

2. **Baca deskripsi use case dengan teliti**

   - Pahami requirement dan komposisi
   - Pastikan tim Anda sesuai dengan requirement
   - Tanyakan ke admin jika ada yang tidak jelas

3. **Jangan tunda-tunda menerima undangan**

   - Undangan bisa expire
   - Semakin cepat menerima, semakin cepat tim disetujui
   - Hubungi leader jika ada pertanyaan

4. **Pantau status tim secara berkala**

   - Cek apakah tim sudah disetujui
   - Baca pengumuman dari admin
   - Perhatikan deadline milestone

5. **Download dokumen yang relevan**
   - Baca panduan capstone
   - Pahami requirement project
   - Gunakan sebagai referensi

### Tips untuk Admin

1. **Verifikasi tim dengan teliti**

   - Cek komposisi sesuai requirement
   - Cek semua anggota valid
   - Cek tidak ada duplikasi

2. **Berikan feedback yang jelas saat menolak**

   - Jelaskan alasan penolakan
   - Berikan saran perbaikan
   - Beri kesempatan mendaftar ulang

3. **Buat timeline yang realistis**

   - Pertimbangkan durasi capstone
   - Beri waktu cukup untuk setiap milestone
   - Koordinasikan dengan stakeholder

4. **Komunikasi yang efektif**
   - Buat pengumuman yang jelas
   - Update status tim secara berkala
   - Respons pertanyaan mahasiswa dengan cepat

---

## 📞 Kontak & Support

### Hubungi Admin

- **Email:** asah@dicoding.com
- **WhatsApp:** (Hubungi admin untuk nomor)

### Report Bug

1. Buka GitHub Issues: https://github.com/ustadzCoding/A25-CS246/issues
2. Klik "New Issue"
3. Jelaskan bug dengan detail
4. Sertakan screenshot jika diperlukan
5. Submit issue

### Request Feature

1. Buka GitHub Discussions: https://github.com/ustadzCoding/A25-CS246/discussions
2. Klik "New Discussion"
3. Jelaskan feature yang diinginkan
4. Tunggu feedback dari tim

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0 | **Language:** Indonesian
