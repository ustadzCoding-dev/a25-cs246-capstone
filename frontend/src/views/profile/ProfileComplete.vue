<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <!-- Only show form if NOT admin -->
    <div v-if="!(authStore.isAdmin || user?.role === 'admin')" class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="h-6 w-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Lengkapi Profil Anda</h2>
        <p class="mt-2 text-gray-600">
          Selamat datang, <span class="font-semibold">{{ user?.name }}</span
          >! <br />
          Mohon lengkapi data berikut untuk melanjutkan.
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Learning Path -->
          <BaseSelect
            v-model="form.learningPath"
            label="Learning Path"
            placeholder="Pilih learning path Anda"
            :options="learningPathOptions"
            :error="errors.learningPath"
            required
          />

          <!-- University -->
          <BaseInput
            v-model="form.university"
            label="Universitas"
            placeholder="Contoh: Institut Teknologi Bandung"
            :error="errors.university"
            required
          />

          <!-- Error Alert -->
          <div
            v-if="errorMessage"
            class="p-4 bg-danger-50 border border-danger-200 rounded-lg"
          >
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-danger-600 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-sm text-danger-700">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="loading"
            full-width
          >
            Lanjutkan
          </BaseButton>

          <!-- Info Text -->
          <p class="text-xs text-gray-500 text-center">
            Data ini diperlukan untuk mengatur akses dan fitur yang sesuai
            dengan kebutuhan Anda
          </p>
        </form>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <button
          @click="handleLogout"
          class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Keluar dari akun
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import BaseInput from "../../components/base/BaseInput.vue";
import BaseSelect from "../../components/base/BaseSelect.vue";
import BaseButton from "../../components/base/BaseButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const user = computed(() => authStore.user);
const loading = ref(false);
const errorMessage = ref("");
const learningPathOptions = ref([]);

const form = reactive({
  learningPath: "",
  university: "",
});

const errors = reactive({
  learningPath: "",
  university: "",
});

// Fetch learning paths from backend
const fetchLearningPaths = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/learning-paths');
    if (response.ok) {
      const data = await response.json();
      learningPathOptions.value = data.data.map(path => ({
        value: path.name,
        label: path.name
      }));
      console.log('✅ Learning paths loaded from API:', learningPathOptions.value);
    } else {
      throw new Error('Failed to fetch learning paths');
    }
  } catch (err) {
    console.error('⚠️  Failed to fetch learning paths from API:', err);
    // Fallback to hardcoded options if API fails
    learningPathOptions.value = [
      { value: "Front-End Web & Back-End with AI", label: "Front-End Web & Back-End with AI" },
      { value: "React & Back-End with AI", label: "React & Back-End with AI" },
      { value: "Machine Learning", label: "Machine Learning" },
    ];
    console.log('✅ Using fallback learning paths');
  }
};

const validateForm = () => {
  errors.learningPath = "";
  errors.university = "";

  let isValid = true;

  if (!form.learningPath) {
    errors.learningPath = "Learning path wajib dipilih";
    isValid = false;
  }

  if (!form.university.trim()) {
    errors.university = "Universitas wajib diisi";
    isValid = false;
  } else if (form.university.trim().length < 3) {
    errors.university = "Nama universitas minimal 3 karakter";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    console.log("📝 Submitting profile completion form...");

    await authStore.completeProfile({
      learningPath: form.learningPath.trim(),
      university: form.university.trim(),
    });

    console.log("✅ Profile completion successful, user data:", {
      email: authStore.user?.email,
      dicodingId: authStore.user?.dicodingId,
      learningPath: authStore.user?.learningPath,
      university: authStore.user?.university
    });

    // Small delay to ensure state updates
    await new Promise(resolve => setTimeout(resolve, 500));

    // Redirect to appropriate dashboard
    const redirectPath = authStore.isAdmin ? "/admin/dashboard" : "/dashboard";
    console.log("🔄 Redirecting to:", redirectPath);
    router.replace(redirectPath);
  } catch (err) {
    console.error("Profile completion error:", err);
    errorMessage.value =
      err.message || "Gagal melengkapi profil. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Check if user already has complete profile
onMounted(async () => {
  let currentUser = authStore.user;

  console.log('🔍 Profile check (initial):', {
    user: currentUser?.email,
    role: currentUser?.role,
    isAdmin: authStore.isAdmin,
    dicodingId: currentUser?.dicodingId,
    learningPath: currentUser?.learningPath,
    university: currentUser?.university
  });

  // If user is admin, skip profile completion and go to admin dashboard
  if (authStore.isAdmin || currentUser?.role === 'admin') {
    console.log('👤 Admin user detected, redirecting...');
    router.push("/admin/dashboard");
    return;
  }

  // Fetch learning paths
  await fetchLearningPaths();

  // Re-check user data after potential refresh from authStore.handleGoogleCallback
  // This ensures we have the latest dicodingId from database
  currentUser = authStore.user;
  console.log('🔍 Profile check (after refresh):', {
    user: currentUser?.email,
    dicodingId: currentUser?.dicodingId,
    learningPath: currentUser?.learningPath,
    university: currentUser?.university
  });

  // If profile already complete, redirect to dashboard
  if (
    currentUser?.dicodingId &&
    currentUser?.learningPath &&
    currentUser?.university
  ) {
    console.log('✅ Profile already complete, redirecting to dashboard...');
    const redirectPath = authStore.isAdmin ? "/admin/dashboard" : "/dashboard";
    router.replace(redirectPath);
  }
});
</script>
