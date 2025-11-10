# 🎨 Styling Guide - Untuk Deby (UI/UX Designer)

Panduan lengkap untuk customize warna, font, dan styling di frontend.

## 📍 File Utama untuk Styling

### 1. `tailwind.config.js` - Konfigurasi Utama

File ini adalah tempat utama untuk customize warna, font, shadows, dan lainnya.

**Lokasi:** `frontend/tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna Primary (Biru) - Ganti dengan warna brand Dicoding
        primary: {
          50: '#eff6ff',   // Paling terang
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // ⭐ Warna utama (dipakai di button, link, dll)
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',  // Paling gelap
        },
        
        // Warna Secondary (Abu-abu)
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // ⭐ Warna utama
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // Warna Success (Hijau)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',  // ⭐ Warna utama
          600: '#16a34a',
          700: '#15803d',
        },
        
        // Warna Warning (Kuning/Orange)
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',  // ⭐ Warna utama
          600: '#d97706',
          700: '#b45309',
        },
        
        // Warna Danger (Merah)
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',  // ⭐ Warna utama
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      
      // Font Family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Tambah font lain kalau perlu:
        // heading: ['Poppins', 'sans-serif'],
      },
      
      // Box Shadow
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'hard': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
```

---

## 🎨 Cara Ganti Warna Brand

### Contoh: Ganti Biru jadi Warna Brand Dicoding

1. **Buka file:** `tailwind.config.js`
2. **Cari bagian:** `primary: { ... }`
3. **Ganti nilai hex:**

```javascript
primary: {
  50: '#f0f9ff',   // Warna brand paling terang
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',  // ⭐ Warna brand utama (ganti ini!)
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',  // Warna brand paling gelap
},
```

4. **Save file**
5. **Refresh browser** (Ctrl + R)
6. **Semua button, link, dan elemen primary akan berubah otomatis!**

---

## 🔤 Cara Ganti Font

### 1. Tambah Google Font di `index.html`

**Lokasi:** `frontend/index.html`

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dicoding Indonesia - Kampus Merdeka</title>
  
  <!-- Tambah Google Font di sini -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
```

### 2. Update `tailwind.config.js`

```javascript
fontFamily: {
  sans: ['Poppins', 'system-ui', 'sans-serif'],  // Font utama
  heading: ['Poppins', 'sans-serif'],            // Font untuk heading
},
```

### 3. Save dan Refresh

Semua text akan otomatis pakai font baru!

---

## 🌈 Cara Pakai Warna di Component

### Background Color
```vue
<div class="bg-primary-500">Background biru</div>
<div class="bg-secondary-100">Background abu-abu terang</div>
<div class="bg-success-500">Background hijau</div>
```

### Text Color
```vue
<p class="text-primary-600">Text biru</p>
<p class="text-gray-700">Text abu-abu</p>
<p class="text-danger-500">Text merah</p>
```

### Border Color
```vue
<div class="border border-primary-500">Border biru</div>
<div class="border-2 border-success-500">Border hijau tebal</div>
```

### Hover Effects
```vue
<button class="bg-primary-500 hover:bg-primary-600">
  Hover untuk warna lebih gelap
</button>
```

---

## 📐 Spacing & Sizing

### Margin & Padding
```vue
<div class="m-4">Margin 1rem (16px)</div>
<div class="p-6">Padding 1.5rem (24px)</div>
<div class="mt-8">Margin top 2rem (32px)</div>
<div class="px-4 py-2">Padding horizontal 1rem, vertical 0.5rem</div>
```

### Width & Height
```vue
<div class="w-full">Width 100%</div>
<div class="w-1/2">Width 50%</div>
<div class="h-screen">Height 100vh</div>
<div class="max-w-md">Max width medium</div>
```

---

## 🎭 Shadow & Rounded

### Box Shadow
```vue
<div class="shadow-soft">Soft shadow</div>
<div class="shadow-medium">Medium shadow</div>
<div class="shadow-hard">Hard shadow</div>
<div class="shadow-lg">Large shadow (Tailwind default)</div>
```

### Rounded Corners
```vue
<div class="rounded">Border radius 0.25rem</div>
<div class="rounded-lg">Border radius 0.5rem</div>
<div class="rounded-full">Border radius 100% (circle)</div>
```

---

## 📱 Responsive Design

### Breakpoints
```vue
<!-- Mobile first approach -->
<div class="text-sm md:text-base lg:text-lg">
  Small di mobile, base di tablet, large di desktop
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  1 kolom di mobile, 2 di tablet, 3 di desktop
</div>
```

**Breakpoints:**
- `sm:` - 640px (mobile landscape)
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (large desktop)

---

## 🔍 Cara Cari Component yang Perlu Diubah

### 1. Buka DevTools (F12)
- Klik elemen yang mau diubah
- Lihat class Tailwind yang dipakai
- Edit di file `.vue` yang sesuai

### 2. Search di VSCode
- Tekan `Ctrl + Shift + F`
- Cari text atau class yang mau diubah
- Edit di file yang muncul

---

## 📚 Referensi Tailwind CSS

### Dokumentasi Lengkap
- **Colors:** https://tailwindcss.com/docs/customizing-colors
- **Typography:** https://tailwindcss.com/docs/font-family
- **Spacing:** https://tailwindcss.com/docs/padding
- **Shadows:** https://tailwindcss.com/docs/box-shadow
- **Responsive:** https://tailwindcss.com/docs/responsive-design

### Cheat Sheet
- https://nerdcave.com/tailwind-cheat-sheet

---

## 💡 Tips

1. **Gunakan warna dengan konsisten**
   - Primary untuk action utama (button, link)
   - Secondary untuk text dan border
   - Success untuk status berhasil
   - Danger untuk error dan delete
   - Warning untuk peringatan

2. **Pakai spacing yang konsisten**
   - Gunakan kelipatan 4 (4, 8, 12, 16, 24, 32)
   - Contoh: `p-4`, `m-8`, `gap-6`

3. **Test di berbagai ukuran layar**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1280px)

4. **Hot reload otomatis**
   - Setiap save file, browser auto refresh
   - Tidak perlu restart server

---

## 🆘 Butuh Bantuan?

Kalau ada yang bingung atau perlu bantuan, tanya Afrizal! 😊

**Happy Styling!** 🎨✨
