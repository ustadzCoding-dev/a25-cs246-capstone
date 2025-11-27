# Implementasi Upload & Update Foto Profil dengan Cloudinary

## 📋 Ringkasan Implementasi

Fitur upload dan update foto profil untuk student telah berhasil diimplementasikan dengan penyimpanan ke Cloudinary. Student sekarang dapat:

- ✅ Upload foto profil dari ProfilePage
- ✅ Update foto profil (upload foto baru akan replace foto lama)
- ✅ Hapus foto profil
- ✅ Foto tersimpan di Cloudinary dengan URL yang dapat diakses

---

## 🔧 Backend Implementation

### 1. **Cloudinary Configuration** (`src/config/cloudinary.js`)

```javascript
- Konfigurasi Cloudinary SDK dengan credentials dari environment
- Auto-verify credentials pada server startup
```

### 2. **Cloudinary Service** (`src/services/CloudinaryService.js`)

Menyediakan 2 method utama:

#### `uploadProfilePicture(fileBuffer, fileName, userId)`

- Upload file ke Cloudinary folder: `capstone-dicoding/profile-pictures`
- Gunakan public_id: `user-{userId}` untuk unique identifier
- Return: Secure URL dari Cloudinary

#### `deleteProfilePicture(userId)`

- Delete file dari Cloudinary
- Gunakan public_id: `user-{userId}`

### 3. **Multer Profile Picture Middleware** (`src/middleware/multerProfilePicture.js`)

- Memory storage (tidak menyimpan ke disk lokal)
- File filter: Hanya accept image files (JPEG, PNG, GIF, WebP)
- Max size: 5MB per file

### 4. **User Controller** (`src/controllers/userController.js`)

Tambahan 2 controller baru:

#### `uploadProfilePictureController`

- Endpoint: `POST /api/user/profile-picture/upload`
- Auth: Required (protected route)
- Request: multipart/form-data dengan field `profilePicture`
- Response:
  ```json
  {
    "success": true,
    "message": "Profile picture uploaded successfully",
    "data": {
      "profilePicture": "https://res.cloudinary.com/...",
      "user": {...}
    }
  }
  ```

#### `deleteProfilePictureController`

- Endpoint: `DELETE /api/user/profile-picture/delete`
- Auth: Required (protected route)
- Response: User data dengan profilePicture: null

### 5. **Routes** (`src/routes/index.js`)

```javascript
POST   /api/user/profile-picture/upload  - Upload foto
DELETE /api/user/profile-picture/delete  - Hapus foto
```

### 6. **Environment Variables** (`.env`)

```
CLOUDINARY_CLOUD_NAME=dlkft1k84
CLOUDINARY_API_KEY=744741938751142
CLOUDINARY_API_SECRET=1_XUotB_e5c7tjHyTyrAg-Dktck
```

---

## 🎨 Frontend Implementation

### 1. **Profile Picture Service** (`src/services/profilePictureService.js`)

Menyediakan 2 function:

#### `uploadProfilePicture(file)`

- Upload file ke backend endpoint
- Parameter: File object dari input
- Return: Response dengan URL foto dari Cloudinary

#### `deleteProfilePicture()`

- Delete foto dari server
- Return: Response dengan user data updated

### 2. **ProfilePage Component Update** (`src/views/profile/ProfilePage.vue`)

#### UI Updates:

- **Profile Picture Display**: Menampilkan foto dari Cloudinary (jika ada)
- **Upload Button**: Tombol untuk memilih file
- **Delete Button**: Tombol untuk menghapus foto (hanya muncul jika sudah ada foto)
- **Error/Success Messages**: Feedback untuk user

#### New Reactive Variables:

```javascript
uploadingProfilePicture; // Loading state saat upload
deletingProfilePicture; // Loading state saat delete
profilePictureError; // Error message
profilePictureSuccess; // Success message
fileInput; // Reference ke input file
```

#### New Methods:

##### `handleProfilePictureSelect(event)`

- Validasi ukuran file (max 5MB)
- Validasi tipe file (image only)
- Upload ke server via service
- Update user in auth store
- Show success/error message

##### `handleDeleteProfilePicture()`

- Confirmation dialog
- Delete dari server
- Update user in auth store
- Show success/error message

---

## 📱 API Endpoints

### Upload Profile Picture

```
POST /api/user/profile-picture/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- profilePicture: File

Response (200):
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profilePicture": "https://res.cloudinary.com/dlkft1k84/image/upload/...",
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "profilePicture": "https://res.cloudinary.com/...",
      ...
    }
  }
}
```

### Delete Profile Picture

```
DELETE /api/user/profile-picture/delete
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Profile picture deleted successfully",
  "data": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "profilePicture": null,
    ...
  }
}
```

---

## 🔐 Security Features

1. **Authentication Required**: Semua endpoint memerlukan JWT token
2. **File Validation**:
   - Hanya accept image files
   - Max size 5MB
3. **Secure URLs**: Menggunakan HTTPS URL dari Cloudinary
4. **User-specific Storage**: Foto disimpan dengan public_id `user-{userId}`
5. **Overwrite Protection**: Upload baru akan replace upload lama dengan public_id yang sama

---

## 📦 Dependencies Added

```json
{
  "cloudinary": "^1.40.0" (or latest)
}
```

Install dengan:

```bash
npm install cloudinary
```

---

## 🎯 Usage Guide untuk Student

1. **Navigate ke Profile Page** (`/profile`)
2. **Klik "Pilih Foto"** untuk select image dari device
3. **Foto akan di-upload otomatis** ke Cloudinary
4. **Success message** akan ditampilkan
5. **Foto profile akan update** dengan preview dari Cloudinary
6. **Untuk hapus foto**: Klik tombol "Hapus Foto" dan confirm

---

## ✅ Testing Checklist

### Backend Testing:

- [ ] Test upload dengan file gambar valid (JPEG, PNG, GIF, WebP)
- [ ] Test upload dengan file > 5MB (harus error)
- [ ] Test upload dengan file non-image (harus error)
- [ ] Test delete foto yang sudah ada
- [ ] Test delete foto yang belum ada
- [ ] Verify foto tersimpan di Cloudinary
- [ ] Verify URL di database valid dan accessible
- [ ] Test dengan multiple users
- [ ] Test update foto (upload lagi dengan user yang sama)

### Frontend Testing:

- [ ] File input dialog berfungsi
- [ ] Preview foto sebelum upload
- [ ] Loading state saat upload
- [ ] Success message ditampilkan
- [ ] Error message ditampilkan untuk file invalid
- [ ] Foto display update setelah upload
- [ ] Delete button hanya muncul jika ada foto
- [ ] Confirmation dialog sebelum delete
- [ ] Loading state saat delete

---

## 🚀 Next Steps (Optional Enhancements)

1. **Image Cropping**: Tambahkan image cropper sebelum upload
2. **Image Optimization**: Resize image sesuai kebutuhan
3. **Drag & Drop**: Allow drag & drop untuk upload
4. **Progress Bar**: Show upload progress
5. **Multiple Images**: Support multiple profile pictures atau history
6. **Image Filtering**: Filter untuk edit foto (brightness, contrast, etc)

---

## 📝 Notes

- Foto lama akan otomatis di-replace saat upload baru dengan user yang sama
- Tidak perlu manual cleanup di Cloudinary karena menggunakan public_id yang unik per user
- Semua foto tersimpan di folder `capstone-dicoding/profile-pictures`
- URL foto adalah secure URL (HTTPS) dan langsung bisa di-access dari browser

---

## 🐛 Troubleshooting

| Issue                                    | Solution                                         |
| ---------------------------------------- | ------------------------------------------------ |
| Upload error 400 "No file provided"      | Pastikan form memiliki field `profilePicture`    |
| Upload error 400 "File type not allowed" | Hanya support image files (JPEG, PNG, GIF, WebP) |
| Upload error 413 "File too large"        | Max size 5MB, compress image terlebih dahulu     |
| Upload error 500                         | Cek Cloudinary credentials di .env               |
| Foto tidak muncul                        | Cek URL di database, pastikan accessible         |
| Delete error                             | Pastikan foto exist di Cloudinary sebelum delete |

---

Generated: November 27, 2025
