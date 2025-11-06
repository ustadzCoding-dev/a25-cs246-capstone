# Pull Request

## 📝 Description

<!-- Jelaskan perubahan yang dilakukan dalam PR ini -->

## 🎯 Type of Change

<!-- Centang yang sesuai -->

- [ ] 🆕 Feature baru (non-breaking change yang menambah fungsionalitas)
- [ ] 🐛 Bug fix (non-breaking change yang memperbaiki issue)
- [ ] 💥 Breaking change (fix atau feature yang menyebabkan existing functionality tidak bekerja seperti sebelumnya)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI update
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update

## 🔗 Related Issue

<!-- Link ke issue terkait jika ada -->
Closes #(issue number)

## 📸 Screenshots/Videos

<!-- Jika ada perubahan UI, tambahkan screenshot atau video -->

**Before:**
<!-- Screenshot sebelum perubahan -->

**After:**
<!-- Screenshot setelah perubahan -->

## ✅ Checklist

### General
- [ ] Code saya mengikuti style guidelines project ini
- [ ] Saya telah melakukan self-review terhadap code saya
- [ ] Saya telah menambahkan comments pada code yang kompleks
- [ ] Saya telah update dokumentasi yang relevan
- [ ] Perubahan saya tidak menghasilkan warnings baru
- [ ] Tidak ada console.log() atau debugging code yang tertinggal

### Vue.js Specific (untuk Front-End)
- [ ] Component menggunakan Composition API dengan benar
- [ ] Props didefinisikan dengan type validation
- [ ] Emits dideklarasikan secara eksplisit
- [ ] Reactive data menggunakan ref() atau reactive() dengan tepat
- [ ] Computed properties digunakan untuk derived state
- [ ] Tidak ada manipulasi DOM secara langsung
- [ ] Component naming mengikuti konvensi Vue (PascalCase)
- [ ] Lifecycle hooks digunakan dengan benar (onMounted, onUnmounted, dll)
- [ ] Cleanup dilakukan di onUnmounted jika diperlukan

### Express.js Specific (untuk Back-End)
- [ ] API endpoint mengikuti RESTful conventions
- [ ] Input validation menggunakan Joi
- [ ] Error handling implemented dengan proper status codes
- [ ] Authentication/authorization checked jika diperlukan
- [ ] Database queries optimized (no N+1 queries)
- [ ] CORS configured dengan benar

### Testing
- [ ] Saya telah menambahkan tests untuk perubahan saya
- [ ] All tests passing (`npm run test`)
- [ ] Test coverage tidak menurun

### Integration
- [ ] Tidak ada merge conflicts
- [ ] Branch saya up-to-date dengan develop
- [ ] Build berhasil (`npm run build` untuk frontend)
- [ ] Tested di local environment

## 🧪 How to Test

<!-- Jelaskan langkah-langkah untuk test perubahan ini -->

1. 
2. 
3. 

## 📱 Tested On

<!-- Centang platform yang sudah ditest -->

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile (specify device/browser)

## 🔍 Additional Notes

<!-- Informasi tambahan untuk reviewer -->

## 👥 Reviewers

<!-- Tag team members yang harus review -->

@afrizal @deby @ganza @marsa @rizky

---

**Reminder untuk Reviewer:**
- ✅ Check code quality dan readability
- ✅ Verify Vue.js/Express.js best practices
- ✅ Test functionality locally jika memungkinkan
- ✅ Check for security issues
- ✅ Verify performance impact
- ✅ Ensure documentation is updated
