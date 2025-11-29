# Capstone Worksheet / Check-in Progress Feature

## Overview

Fitur Capstone Worksheet adalah sistem check-in progress individu yang memungkinkan peserta capstone project untuk melaporkan aktivitas mereka secara berkala (bi-weekly). Fitur ini membantu Tim Dicoding untuk melakukan monitoring terhadap progress capstone masing-masing individu.

## Fitur Utama

### Untuk Peserta (Student)

1. **Melihat Periode Worksheet**
   - Melihat semua periode check-in yang tersedia
   - Melihat status setiap periode (Draft, Aktif, Ditutup, Sudah Divalidasi)
   - Melihat deadline dan sisa waktu pengisian

2. **Mengisi Worksheet**
   - Menulis deskripsi aktivitas yang telah dilakukan selama periode tersebut (minimal 50 karakter)
   - Menyimpan draft sebelum submit
   - Upload bukti berupa screenshot atau dokumen PDF (maksimal 5 file, 5MB per file)

3. **Submit Worksheet**
   - Submit worksheet sebelum deadline
   - Sistem otomatis menandai jika terlambat submit

4. **Melihat Status Validasi**
   - Melihat status validasi worksheet:
     - **Selesai** - Worksheet diisi tepat waktu dan sesuai ketentuan
     - **Selesai, Terlambat** - Worksheet diisi melewati deadline
     - **Tidak Selesai** - Tidak mengisi worksheet sama sekali
   - Melihat catatan dari admin (jika ada)

### Untuk Admin

1. **Kelola Periode Worksheet**
   - Membuat periode baru dengan nomor periode, judul, deskripsi, tanggal mulai, deadline, dan tanggal validasi otomatis
   - Mengaktifkan periode (dari Draft ke Aktif)
   - Menutup periode (dari Aktif ke Ditutup)
   - Mengedit dan menghapus periode

2. **Validasi Worksheet**
   - Melihat semua worksheet yang disubmit untuk setiap periode
   - Melihat statistik pengisian worksheet
   - Validasi manual setiap worksheet dengan status:
     - Selesai
     - Selesai, Terlambat
     - Tidak Selesai
   - Menambahkan catatan validasi

3. **Validasi Otomatis**
   - Menjalankan validasi otomatis untuk semua worksheet dalam satu periode
   - Sistem otomatis menentukan status berdasarkan:
     - Apakah worksheet sudah disubmit
     - Apakah submit tepat waktu atau terlambat
     - Apakah deskripsi aktivitas memenuhi ketentuan minimal

4. **Kirim Notifikasi Pengingat**
   - Mengirim email pengingat ke peserta yang belum mengisi worksheet
   - Pengingat dikirim beberapa hari sebelum deadline

5. **Export Data**
   - Export data worksheet ke format CSV untuk rekapitulasi
   - Export data worksheet ke format JSON

## Struktur Database

### WorksheetPeriod (Periode Worksheet)

```javascript
{
  periodNumber: Number,        // Nomor periode (1, 2, 3, dst)
  title: String,               // Judul periode
  description: String,         // Deskripsi (opsional)
  startDate: Date,             // Tanggal mulai
  deadline: Date,              // Deadline pengisian
  autoValidationDate: Date,    // Tanggal validasi otomatis
  status: String,              // draft, active, closed, validated
  isAutoValidated: Boolean,    // Flag validasi otomatis
  createdBy: ObjectId,         // Admin yang membuat
  reminderSettings: {
    reminderDaysBefore: Number,
    reminderSent: Boolean,
    reminderSentAt: Date
  }
}
```

### Worksheet (Worksheet Individu)

```javascript
{
  userId: ObjectId,            // Referensi ke User
  periodId: ObjectId,          // Referensi ke WorksheetPeriod
  activityDescription: String, // Deskripsi aktivitas (min 50 karakter)
  evidence: [{                 // Bukti/lampiran
    originalName: String,
    fileName: String,
    filePath: String,
    mimeType: String,
    fileSize: Number,
    uploadedAt: Date
  }],
  submittedAt: Date,           // Tanggal submit
  isSubmitted: Boolean,        // Flag sudah submit
  isLate: Boolean,             // Flag terlambat
  validationStatus: String,    // pending, completed, completed_late, incomplete
  adminNotes: String,          // Catatan dari admin
  validatedBy: ObjectId,       // Admin yang memvalidasi
  validatedAt: Date            // Tanggal validasi
}
```

## API Endpoints

### Periode

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/worksheet/periods` | Ambil semua periode | All |
| GET | `/api/worksheet/periods/:id` | Ambil periode by ID | All |
| POST | `/api/worksheet/periods` | Buat periode baru | Admin |
| PUT | `/api/worksheet/periods/:id` | Update periode | Admin |
| DELETE | `/api/worksheet/periods/:id` | Hapus periode | Admin |
| PUT | `/api/worksheet/periods/:id/activate` | Aktifkan periode | Admin |
| PUT | `/api/worksheet/periods/:id/close` | Tutup periode | Admin |

### Worksheet (Student)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/worksheet/my-worksheets` | Ambil worksheet user | Student |
| GET | `/api/worksheet/my-worksheets/:periodId` | Ambil worksheet per periode | Student |
| POST | `/api/worksheet/save-draft/:periodId` | Simpan draft | Student |
| POST | `/api/worksheet/submit/:periodId` | Submit worksheet | Student |
| POST | `/api/worksheet/upload-evidence/:periodId` | Upload bukti | Student |
| DELETE | `/api/worksheet/evidence/:periodId/:evidenceId` | Hapus bukti | Student |

### Worksheet (Admin)

| Method | Endpoint | Deskripsi | Akses |
|--------|----------|-----------|-------|
| GET | `/api/worksheet/admin/period/:periodId` | Ambil worksheet per periode | Admin |
| GET | `/api/worksheet/admin/period/:periodId/stats` | Statistik validasi | Admin |
| GET | `/api/worksheet/admin/detail/:worksheetId` | Detail worksheet | Admin |
| PUT | `/api/worksheet/admin/validate/:worksheetId` | Validasi worksheet | Admin |
| POST | `/api/worksheet/admin/period/:periodId/auto-validate` | Validasi otomatis | Admin |
| GET | `/api/worksheet/admin/period/:periodId/export` | Export JSON | Admin |
| GET | `/api/worksheet/admin/period/:periodId/export-csv` | Export CSV | Admin |
| POST | `/api/worksheet/admin/period/:periodId/send-reminders` | Kirim pengingat | Admin |

## Alur Penggunaan

### Admin: Setup Periode

1. Login sebagai admin
2. Buka menu "Worksheet"
3. Klik "Tambah Periode"
4. Isi detail periode:
   - Nomor periode (1, 2, 3)
   - Judul (contoh: "Check-in Periode 1")
   - Deskripsi (opsional)
   - Tanggal mulai
   - Deadline
   - Tanggal validasi otomatis
5. Simpan sebagai draft
6. Aktifkan periode saat waktunya tiba

### Student: Mengisi Worksheet

1. Login sebagai student
2. Buka menu "Worksheet"
3. Cari periode yang sedang aktif
4. Isi deskripsi aktivitas (minimal 50 karakter)
5. Upload bukti (screenshot/PDF)
6. Simpan draft atau langsung submit
7. Setelah submit, tidak bisa mengubah lagi

### Admin: Validasi Worksheet

1. Login sebagai admin
2. Buka menu "Worksheet"
3. Pilih tab "Validasi Worksheet"
4. Pilih periode yang ingin divalidasi
5. Lihat statistik dan daftar worksheet
6. Validasi manual atau jalankan validasi otomatis
7. Export data untuk rekapitulasi

## Notifikasi Email

### Pengingat Worksheet

Email dikirim ke peserta yang belum mengisi worksheet beberapa hari sebelum deadline. Berisi:
- Nama periode
- Deadline
- Sisa waktu
- Link untuk mengisi worksheet

### Hasil Validasi

Email dikirim setelah worksheet divalidasi. Berisi:
- Status validasi (Selesai/Selesai Terlambat/Tidak Selesai)
- Catatan dari admin (jika ada)

## Format File Upload

File yang diperbolehkan untuk bukti:
- Gambar: JPEG, PNG, GIF, WebP
- Dokumen: PDF

Batasan:
- Maksimal 5 file per worksheet
- Maksimal 5MB per file

## Tips Penggunaan

### Untuk Peserta

1. **Isi worksheet secepat mungkin** - Jangan menunggu deadline, simpan draft saat sudah ada progress
2. **Sertakan bukti yang relevan** - Screenshot commit, progress report, atau dokumen lainnya
3. **Jelaskan dengan detail** - Deskripsi yang baik membantu admin memvalidasi lebih cepat

### Untuk Admin

1. **Set deadline yang realistis** - Berikan waktu yang cukup untuk peserta mengisi
2. **Kirim pengingat H-3** - Bantu peserta yang mungkin lupa
3. **Validasi segera setelah deadline** - Agar peserta tahu statusnya
4. **Export data secara berkala** - Untuk backup dan pelaporan

## Troubleshooting

### Peserta tidak bisa submit

1. Pastikan periode masih aktif
2. Pastikan deskripsi minimal 50 karakter
3. Cek apakah sudah pernah submit sebelumnya

### Upload bukti gagal

1. Pastikan format file sesuai (JPEG, PNG, GIF, WebP, PDF)
2. Pastikan ukuran file tidak lebih dari 5MB
3. Pastikan total file tidak lebih dari 5

### Email pengingat tidak terkirim

1. Pastikan konfigurasi SMTP sudah benar di environment
2. Cek log server untuk error detail
3. Pastikan email peserta valid