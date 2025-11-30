<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">Kelola Worksheet</h1>
          <p class="text-gray-600 text-lg">
            Kelola periode check-in dan validasi worksheet peserta.
          </p>
        </div>
        <button
          @click="openPeriodModal()"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Periode
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex -mb-px space-x-8">
          <button
            @click="activeTab = 'periods'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'periods'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Periode
          </button>
          <button
            @click="activeTab = 'worksheets'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'worksheets'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Validasi Worksheet
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Periods Tab -->
      <div v-else-if="activeTab === 'periods'">
        <!-- Periods List -->
        <div class="space-y-4">
          <div v-if="periods.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada periode</h3>
            <p class="mt-2 text-gray-500">
              Klik tombol "Tambah Periode" untuk membuat periode baru.
            </p>
          </div>

          <div
            v-for="period in sortedPeriods"
            :key="period.id || period._id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <div class="px-6 py-4 flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <h3 class="text-lg font-semibold text-gray-900">{{ period.title }}</h3>
                  <span
                    :class="getStatusClass(period.status)"
                    class="ml-3 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusLabel(period.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Periode {{ period.periodNumber }} • {{ formatDate(period.startDate) }} -
                  {{ formatDate(period.deadline) }}
                </p>
                <p v-if="period.description" class="text-sm text-gray-600 mt-2">
                  {{ period.description }}
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <!-- Activate Button -->
                <button
                  v-if="period.status === 'draft'"
                  @click="handleActivate(period)"
                  class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  :disabled="submitting"
                >
                  Aktifkan
                </button>

                <!-- Close Button -->
                <button
                  v-if="period.status === 'active'"
                  @click="handleClose(period)"
                  class="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                  :disabled="submitting"
                >
                  Tutup
                </button>

                <!-- View Worksheets -->
                <button
                  v-if="period.status !== 'draft'"
                  @click="viewWorksheets(period)"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Lihat Worksheet
                </button>

                <!-- Edit Button -->
                <button
                  v-if="period.status !== 'validated'"
                  @click="openPeriodModal(period)"
                  class="p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  v-if="period.status === 'draft'"
                  @click="handleDelete(period)"
                  class="p-2 text-red-500 hover:text-red-700"
                  :disabled="submitting"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Worksheets Tab -->
      <div v-else-if="activeTab === 'worksheets'">
        <!-- Period Selector -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Pilih Periode:</label>
              <select
                v-model="selectedPeriodId"
                @change="loadWorksheets"
                class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">-- Pilih Periode --</option>
                <option
                  v-for="period in periods.filter(p => p.status !== 'draft')"
                  :key="period.id || period._id"
                  :value="period.id || period._id"
                >
                  {{ period.title }} ({{ getStatusLabel(period.status) }})
                </option>
              </select>
            </div>

            <div v-if="selectedPeriodId" class="flex items-center space-x-2">
              <!-- Filter -->
              <select
                v-model="statusFilter"
                @change="loadWorksheets"
                class="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Semua Status</option>
                <option value="pending">Menunggu Validasi</option>
                <option value="completed">Selesai</option>
                <option value="completed_late">Selesai (Terlambat)</option>
                <option value="incomplete">Tidak Selesai</option>
              </select>

              <!-- Send Reminders -->
              <button
                v-if="currentPeriod?.status === 'active'"
                @click="sendReminders"
                class="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 flex items-center"
                :disabled="submitting"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Kirim Pengingat
              </button>

              <!-- Auto Validate -->
              <button
                v-if="currentPeriod?.status === 'closed'"
                @click="runAutoValidation"
                class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center"
                :disabled="submitting"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Validasi Otomatis
              </button>

              <!-- Export -->
              <div class="relative" ref="exportDropdown">
                <button
                  @click="showExportMenu = !showExportMenu"
                  class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                </button>
                <div
                  v-if="showExportMenu"
                  class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10"
                >
                  <button
                    @click="exportCSV"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export CSV
                  </button>
                  <button
                    @click="exportJSON"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div v-if="validationStats" class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow p-4 text-center">
            <p class="text-2xl font-bold text-gray-900">
              {{ validationStats.stats?.totalStudents || 0 }}
            </p>
            <p class="text-sm text-gray-500">Total Peserta</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 text-center">
            <p class="text-2xl font-bold text-green-600">
              {{ validationStats.stats?.completed || 0 }}
            </p>
            <p class="text-sm text-gray-500">Selesai</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 text-center">
            <p class="text-2xl font-bold text-yellow-600">
              {{ validationStats.stats?.completed_late || 0 }}
            </p>
            <p class="text-sm text-gray-500">Terlambat</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 text-center">
            <p class="text-2xl font-bold text-red-600">
              {{ validationStats.stats?.incomplete || 0 }}
            </p>
            <p class="text-sm text-gray-500">Tidak Selesai</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4 text-center">
            <p class="text-2xl font-bold text-gray-600">
              {{ validationStats.stats?.pending || 0 }}
            </p>
            <p class="text-sm text-gray-500">Menunggu</p>
          </div>
        </div>

        <!-- Worksheets Table -->
        <div
          v-if="selectedPeriodId && worksheets.length > 0"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Peserta
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Learning Path
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status Submit
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bukti
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Validasi
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="worksheet in worksheets" :key="worksheet.id || worksheet._id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        v-if="worksheet.userId?.profilePicture"
                        :src="worksheet.userId.profilePicture"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                      <div
                        v-else
                        class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                      >
                        <span class="text-indigo-600 font-medium text-sm">{{
                          getInitials(worksheet.userId?.name)
                        }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ worksheet.userId?.name || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ worksheet.userId?.email || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ worksheet.userId?.learningPathName || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="worksheet.isSubmitted" class="text-green-600 text-sm">
                    ✓ {{ formatDateTime(worksheet.submittedAt) }}
                    <span v-if="worksheet.isLate" class="text-orange-500 ml-1">(Terlambat)</span>
                  </span>
                  <span v-else class="text-gray-400 text-sm">Belum submit</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ worksheet.evidence?.length || 0 }} file
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getValidationStatusClass(worksheet.validationStatus)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getValidationStatusLabel(worksheet.validationStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openDetailModal(worksheet)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Detail
                  </button>
                  <button
                    v-if="worksheet.validationStatus === 'pending'"
                    @click="openValidateModal(worksheet)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Validasi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="selectedPeriodId && worksheets.length === 0"
          class="bg-white rounded-lg shadow p-8 text-center"
        >
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Tidak ada worksheet</h3>
          <p class="mt-2 text-gray-500">
            Belum ada peserta yang mengisi worksheet untuk periode ini.
          </p>
        </div>

        <!-- No Period Selected -->
        <div v-else class="bg-white rounded-lg shadow p-8 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Pilih Periode</h3>
          <p class="mt-2 text-gray-500">Pilih periode untuk melihat worksheet peserta.</p>
        </div>
      </div>
    </div>

    <!-- Period Form Modal -->
    <div v-if="showPeriodModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-50" @click="showPeriodModal = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingPeriod ? 'Edit Periode' : 'Tambah Periode' }}
          </h3>

          <form @submit.prevent="savePeriod">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Nomor Periode *</label
                  >
                  <input
                    v-model.number="periodForm.periodNumber"
                    type="number"
                    min="1"
                    max="10"
                    required
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                  <input
                    v-model="periodForm.title"
                    type="text"
                    required
                    placeholder="Check-in Periode 1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  v-model="periodForm.description"
                  rows="2"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Deskripsi periode (opsional)"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Tanggal Mulai *</label
                  >
                  <input
                    v-model="periodForm.startDate"
                    type="datetime-local"
                    required
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    v-model="periodForm.deadline"
                    type="datetime-local"
                    required
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tanggal Validasi Otomatis *</label
                >
                <input
                  v-model="periodForm.autoValidationDate"
                  type="datetime-local"
                  required
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Sistem akan otomatis memvalidasi worksheet setelah tanggal ini.
                </p>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showPeriodModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ submitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Worksheet Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-50" @click="showDetailModal = false"></div>
        <div
          class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Detail Worksheet</h3>

          <div v-if="selectedWorksheet" class="space-y-4">
            <!-- User Info -->
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
              <div class="flex-shrink-0 h-12 w-12">
                <img
                  v-if="selectedWorksheet.userId?.profilePicture"
                  :src="selectedWorksheet.userId.profilePicture"
                  class="h-12 w-12 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center"
                >
                  <span class="text-indigo-600 font-medium">{{
                    getInitials(selectedWorksheet.userId?.name)
                  }}</span>
                </div>
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">{{ selectedWorksheet.userId?.name }}</p>
                <p class="text-sm text-gray-500">{{ selectedWorksheet.userId?.email }}</p>
                <p class="text-sm text-gray-500">
                  {{ selectedWorksheet.userId?.learningPathName || '-' }} •
                  {{ selectedWorksheet.userId?.university || '-' }}
                </p>
              </div>
            </div>

            <!-- Status -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-500">Status Submit</p>
                <p class="font-medium">
                  <span v-if="selectedWorksheet.isSubmitted" class="text-green-600">
                    Sudah Submit
                    <span v-if="selectedWorksheet.isLate" class="text-orange-500">(Terlambat)</span>
                  </span>
                  <span v-else class="text-gray-400">Belum Submit</span>
                </p>
              </div>
              <div class="p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-500">Status Validasi</p>
                <p class="font-medium">
                  <span :class="getValidationStatusTextClass(selectedWorksheet.validationStatus)">
                    {{ getValidationStatusLabel(selectedWorksheet.validationStatus) }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Activity Description -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Deskripsi Aktivitas</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 whitespace-pre-wrap">
                  {{ selectedWorksheet.activityDescription || 'Tidak ada deskripsi' }}
                </p>
              </div>
            </div>

            <!-- Evidence -->
            <div v-if="selectedWorksheet.evidence?.length > 0">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Bukti ({{ selectedWorksheet.evidence.length }} file)
              </h4>
              <div class="space-y-2">
                <div
                  v-for="(evidence, idx) in selectedWorksheet.evidence"
                  :key="idx"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg
                      v-if="evidence.mimeType?.includes('pdf')"
                      class="w-5 h-5 text-red-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-sm text-gray-700 truncate max-w-[300px]">{{
                      evidence.originalName
                    }}</span>
                    <span class="text-xs text-gray-400 ml-2">{{
                      formatFileSize(evidence.fileSize)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Notes -->
            <div v-if="selectedWorksheet.adminNotes">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Catatan Admin</h4>
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">{{ selectedWorksheet.adminNotes }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="showDetailModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Validate Modal -->
    <div v-if="showValidateModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-50" @click="showValidateModal = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Validasi Worksheet</h3>

          <div v-if="worksheetToValidate" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="font-medium text-gray-900">{{ worksheetToValidate.userId?.name }}</p>
            <p class="text-sm text-gray-500">{{ worksheetToValidate.userId?.email }}</p>
          </div>

          <form @submit.prevent="submitValidation">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Status Validasi *</label
                >
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="validateForm.status"
                      type="radio"
                      value="completed"
                      class="mr-2 text-indigo-600"
                    />
                    <span class="text-sm text-gray-700">✅ Selesai</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="validateForm.status"
                      type="radio"
                      value="completed_late"
                      class="mr-2 text-indigo-600"
                    />
                    <span class="text-sm text-gray-700">⚠️ Selesai (Terlambat)</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="validateForm.status"
                      type="radio"
                      value="incomplete"
                      class="mr-2 text-indigo-600"
                    />
                    <span class="text-sm text-gray-700">❌ Tidak Selesai</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Catatan (Opsional)</label
                >
                <textarea
                  v-model="validateForm.notes"
                  rows="3"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Tambahkan catatan untuk peserta..."
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showValidateModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="!validateForm.status || submitting"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ submitting ? 'Menyimpan...' : 'Simpan Validasi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
      <div
        :class="[
          'px-4 py-3 rounded-lg shadow-lg flex items-center',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
        ]"
      >
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import { useWorksheetStore } from '../../stores/worksheetStore'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'

const router = useRouter()
const worksheetStore = useWorksheetStore()
const authStore = useAuthStore()
const { adminMenuItems } = useAdminMenu()

// User data
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// State
const activeTab = ref('periods')
const selectedPeriodId = ref('')
const statusFilter = ref('')
const showPeriodModal = ref(false)
const showDetailModal = ref(false)
const showValidateModal = ref(false)
const showExportMenu = ref(false)
const editingPeriod = ref(null)
const selectedWorksheet = ref(null)
const worksheetToValidate = ref(null)
const exportDropdown = ref(null)

const periodForm = reactive({
  periodNumber: 1,
  title: '',
  description: '',
  startDate: '',
  deadline: '',
  autoValidationDate: '',
})

const validateForm = reactive({
  status: '',
  notes: '',
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success',
})

// Computed
const loading = computed(() => worksheetStore.loading)
const submitting = computed(() => worksheetStore.submitting)
const periods = computed(() => worksheetStore.periods)
const sortedPeriods = computed(() => worksheetStore.sortedPeriods)
const worksheets = computed(() => worksheetStore.periodWorksheets)
const validationStats = computed(() => worksheetStore.validationStats)
const currentPeriod = computed(() => {
  if (!selectedPeriodId.value) return null
  return periods.value.find(p => (p.id || p._id) === selectedPeriodId.value)
})

// Methods
const fetchData = async () => {
  try {
    await worksheetStore.fetchPeriods()
  } catch (err) {
    showToast('Gagal memuat data', 'error')
  }
}

const loadWorksheets = async () => {
  if (!selectedPeriodId.value) return

  try {
    const filters = {}
    if (statusFilter.value) filters.status = statusFilter.value

    await Promise.all([
      worksheetStore.fetchWorksheetsByPeriod(selectedPeriodId.value, filters),
      worksheetStore.fetchValidationStats(selectedPeriodId.value),
    ])
  } catch (err) {
    showToast('Gagal memuat worksheet', 'error')
  }
}

const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = date => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFileSize = bytes => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getStatusClass = status => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'closed':
      return 'bg-orange-100 text-orange-700'
    case 'validated':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusLabel = status => {
  switch (status) {
    case 'active':
      return 'Aktif'
    case 'closed':
      return 'Ditutup'
    case 'validated':
      return 'Sudah Divalidasi'
    case 'draft':
      return 'Draft'
    default:
      return status
  }
}

const getValidationStatusClass = status => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'completed_late':
      return 'bg-yellow-100 text-yellow-700'
    case 'incomplete':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getValidationStatusTextClass = status => {
  switch (status) {
    case 'completed':
      return 'text-green-600'
    case 'completed_late':
      return 'text-yellow-600'
    case 'incomplete':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getValidationStatusLabel = status => {
  switch (status) {
    case 'completed':
      return 'Selesai'
    case 'completed_late':
      return 'Selesai (Terlambat)'
    case 'incomplete':
      return 'Tidak Selesai'
    case 'pending':
      return 'Menunggu Validasi'
    default:
      return status || 'Menunggu'
  }
}

const getInitials = name => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const openPeriodModal = (period = null) => {
  editingPeriod.value = period

  if (period) {
    periodForm.periodNumber = period.periodNumber
    periodForm.title = period.title
    periodForm.description = period.description || ''
    periodForm.startDate = formatDateForInput(period.startDate)
    periodForm.deadline = formatDateForInput(period.deadline)
    periodForm.autoValidationDate = formatDateForInput(period.autoValidationDate)
  } else {
    const nextNumber = periods.value.length + 1
    periodForm.periodNumber = nextNumber
    periodForm.title = `Check-in Periode ${nextNumber}`
    periodForm.description = ''
    periodForm.startDate = ''
    periodForm.deadline = ''
    periodForm.autoValidationDate = ''
  }

  showPeriodModal.value = true
}

const formatDateForInput = date => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}

const savePeriod = async () => {
  try {
    const data = {
      periodNumber: periodForm.periodNumber,
      title: periodForm.title,
      description: periodForm.description,
      startDate: new Date(periodForm.startDate).toISOString(),
      deadline: new Date(periodForm.deadline).toISOString(),
      autoValidationDate: new Date(periodForm.autoValidationDate).toISOString(),
    }

    if (editingPeriod.value) {
      await worksheetStore.updatePeriod(editingPeriod.value.id || editingPeriod.value._id, data)
      showToast('Periode berhasil diperbarui', 'success')
    } else {
      await worksheetStore.createPeriod(data)
      showToast('Periode berhasil ditambahkan', 'success')
    }

    showPeriodModal.value = false
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal menyimpan periode', 'error')
  }
}

const handleActivate = async period => {
  const result = await Swal.fire({
    title: 'Aktifkan Periode',
    text: 'Aktifkan periode ini? Peserta akan dapat mengisi worksheet.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Aktifkan',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await worksheetStore.activatePeriod(period.id || period._id)
    showToast('Periode berhasil diaktifkan', 'success')
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal mengaktifkan periode', 'error')
  }
}

const handleClose = async period => {
  const result = await Swal.fire({
    title: 'Tutup Periode',
    text: 'Tutup periode ini? Peserta tidak akan dapat mengisi worksheet lagi.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tutup',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await worksheetStore.closePeriod(period.id || period._id)
    showToast('Periode berhasil ditutup', 'success')
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal menutup periode', 'error')
  }
}

const handleDelete = async period => {
  const result = await Swal.fire({
    title: 'Hapus Periode',
    text: 'Hapus periode ini? Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await worksheetStore.deletePeriod(period.id || period._id)
    showToast('Periode berhasil dihapus', 'success')
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal menghapus periode', 'error')
  }
}

const viewWorksheets = period => {
  selectedPeriodId.value = period.id || period._id
  activeTab.value = 'worksheets'
  loadWorksheets()
}

const openDetailModal = worksheet => {
  selectedWorksheet.value = worksheet
  showDetailModal.value = true
}

const openValidateModal = worksheet => {
  worksheetToValidate.value = worksheet
  validateForm.status = worksheet.isLate ? 'completed_late' : 'completed'
  validateForm.notes = ''
  showValidateModal.value = true
}

const submitValidation = async () => {
  if (!worksheetToValidate.value || !validateForm.status) return

  try {
    await worksheetStore.validateWorksheet(
      worksheetToValidate.value.id || worksheetToValidate.value._id,
      validateForm.status,
      validateForm.notes
    )
    showValidateModal.value = false
    showToast('Validasi berhasil disimpan', 'success')
    await loadWorksheets()
  } catch (err) {
    showToast(err.message || 'Gagal menyimpan validasi', 'error')
  }
}

const sendReminders = async () => {
  if (!selectedPeriodId.value) return
  const result = await Swal.fire({
    title: 'Kirim Pengingat',
    text: 'Kirim pengingat ke semua peserta yang belum mengisi worksheet?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Kirim',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    const result = await worksheetStore.sendReminderNotifications(selectedPeriodId.value)
    showToast(`Pengingat terkirim ke ${result.sent} peserta`, 'success')
  } catch (err) {
    showToast(err.message || 'Gagal mengirim pengingat', 'error')
  }
}

const runAutoValidation = async () => {
  if (!selectedPeriodId.value) return
  const result = await Swal.fire({
    title: 'Jalankan Validasi Otomatis',
    text: 'Jalankan validasi otomatis? Semua worksheet akan divalidasi berdasarkan status submit.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Jalankan',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    const result = await worksheetStore.runAutoValidation(selectedPeriodId.value)
    showToast(
      `Validasi selesai: ${result.completed} selesai, ${result.completed_late} terlambat, ${result.incomplete} tidak selesai`,
      'success'
    )
    await loadWorksheets()
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal menjalankan validasi', 'error')
  }
}

const exportCSV = async () => {
  showExportMenu.value = false
  if (!selectedPeriodId.value) return

  try {
    await worksheetStore.exportWorksheetCSV(selectedPeriodId.value)
    showToast('Export CSV berhasil', 'success')
  } catch (err) {
    showToast(err.message || 'Gagal export CSV', 'error')
  }
}

const exportJSON = async () => {
  showExportMenu.value = false
  if (!selectedPeriodId.value) return

  try {
    await worksheetStore.exportWorksheetJSON(selectedPeriodId.value)
    showToast('Export JSON berhasil', 'success')
  } catch (err) {
    showToast(err.message || 'Gagal export JSON', 'error')
  }
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// Close export menu when clicking outside
const handleClickOutside = event => {
  if (exportDropdown.value && !exportDropdown.value.contains(event.target)) {
    showExportMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
