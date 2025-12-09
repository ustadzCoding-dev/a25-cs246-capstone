<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
            Manage Teams
          </h1>
          <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
            Kelola semua tim capstone
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportTeamsCSV"
            :disabled="teamStore.teams.length === 0 || exporting"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export tim ke CSV"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {{ exporting ? 'Mengunduh...' : 'Export CSV' }}
          </button>
          <button
            @click="showAutoCreateModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Randomize Tim Otomatis
          </button>
        </div>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg flex flex-col gap-5">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard label="Total Tim" :value="stats.totalTeams" icon="team" color="primary" />
          <StatsCard label="Tim Pending" :value="stats.pendingTeams" icon="clock" color="warning" />
          <StatsCard
            label="Tim Disetujui"
            :value="stats.approvedTeams"
            icon="team"
            color="success"
          />
          <StatsCard label="Tim Ditolak" :value="stats.rejectedTeams" icon="team" color="danger" />
        </div>

        <!-- Error Alert -->
        <div v-if="teamStore.error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div class="flex items-start">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-danger-800">Error</h3>
              <p class="mt-1 text-sm text-danger-700">{{ teamStore.error }}</p>
              <p v-if="teamStore.errorDetails.length > 0" class="mt-2 text-xs text-danger-600">
                <span v-for="(detail, idx) in teamStore.errorDetails" :key="idx" class="block">
                  • {{ detail.field }}: {{ detail.message }}
                </span>
              </p>
            </div>
            <button @click="teamStore.clearError()" class="text-danger-400 hover:text-danger-600">
              ✕
            </button>
          </div>
        </div>

        <!-- Success Alert -->
        <div
          v-if="teamStore.successMessage"
          class="bg-success-50 border border-success-200 rounded-lg p-4"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm text-success-700">{{ teamStore.successMessage }}</p>
            </div>
            <button
              @click="teamStore.clearSuccess()"
              class="text-success-400 hover:text-success-600"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="bg-white rounded-lg shadow">
          <div class="flex border-b border-gray-200">
            <button
              v-for="tab in ['pending', 'approved']"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'px-6 py-4 font-medium text-sm transition-colors',
                activeTab === tab
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900',
              ]"
            >
              <span v-if="tab === 'pending'" class="flex items-center space-x-1">
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Pending ({{ pendingCount }})</span>
              </span>
              <span v-else class="flex items-center space-x-1">
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Approved ({{ approvedCount }})</span>
              </span>
            </button>
          </div>

          <!-- Filters & Search -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseSearch v-model="searchQuery" placeholder="Cari nama tim atau ketua..." />

              <BaseSelect
                v-model="filterUseCase"
                :options="useCaseOptions"
                placeholder="Semua Use Case"
              />
            </div>
          </div>
        </div>

        <!-- Teams Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="font-semibold text-gray-900 lg:text-lg md:text-base sm:text-base text-sm">
              Daftar Tim
            </h2>
            <!-- Select All Checkbox -->
            <div v-if="filteredTeams.length > 0" class="flex items-center space-x-3">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isSomeSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                :title="isAllSelected ? 'Deselect all' : 'Select all'"
              />
              <span class="text-sm text-gray-600">
                {{
                  isAllSelected
                    ? `Semua ${filteredTeams.length} tim dipilih`
                    : isSomeSelected
                      ? `${selectedTeams.size} dari ${filteredTeams.length} tim dipilih`
                      : `Pilih semua ${filteredTeams.length} tim`
                }}
              </span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else-if="filteredTeams.length === 0" class="p-12 text-center">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Tidak ada tim ditemukan</p>
          </div>

          <!-- Bulk Actions Bar -->
          <div
            v-if="selectedTeams.size > 0"
            class="bg-primary-50 border-b border-primary-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10"
          >
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-primary-900">
                {{ selectedTeams.size }} tim dipilih
              </span>
              <div class="flex space-x-2">
                <!-- Approve button - only show on Pending tab -->
                <button
                  v-if="activeTab === 'pending'"
                  @click="bulkApproveTeams"
                  :disabled="selectedTeamsHasPendingInvitations"
                  :class="
                    selectedTeamsHasPendingInvitations
                      ? 'px-3 py-1 text-sm bg-gray-400 text-white rounded cursor-not-allowed'
                      : 'px-3 py-1 text-sm bg-success-600 text-white rounded hover:bg-success-700 transition-colors'
                  "
                  :title="
                    selectedTeamsHasPendingInvitations
                      ? 'Ada tim dengan anggota yang belum accept undangan'
                      : 'Setujui semua tim yang dipilih'
                  "
                >
                  Setujui Semua
                </button>
                <!-- Reject button - only show on Pending tab -->
                <button
                  v-if="activeTab === 'pending'"
                  @click="bulkRejectTeams"
                  :disabled="selectedTeamsHasPendingInvitations"
                  :class="
                    selectedTeamsHasPendingInvitations
                      ? 'px-3 py-1 text-sm bg-gray-400 text-white rounded cursor-not-allowed'
                      : 'px-3 py-1 text-sm bg-danger-600 text-white rounded hover:bg-danger-700 transition-colors'
                  "
                  :title="
                    selectedTeamsHasPendingInvitations
                      ? 'Ada tim dengan anggota yang belum accept undangan'
                      : 'Tolak semua tim yang dipilih'
                  "
                >
                  Tolak Semua
                </button>
                <button
                  @click="bulkDeleteTeams"
                  class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
            <button @click="clearSelection" class="text-sm text-primary-700 hover:text-primary-900">
              Batal Pilih
            </button>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="team in filteredTeams"
              :key="team._id"
              class="p-6 hover:bg-gray-50 transition-colors flex items-center"
            >
              <!-- Checkbox -->
              <input
                type="checkbox"
                :checked="selectedTeams.has(team._id)"
                @change="toggleTeamSelection(team._id)"
                class="mr-4 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-900">{{ team.teamName }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  ID Tim: {{ team.capstoneGroupId || '(Belum di-assign)' }}
                </p>
                <p class="text-sm text-gray-600">
                  Anggota: {{ team.membersUserId?.length || 0 }} | Status:
                  {{ getStatusLabel(team.status) }}
                </p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="viewTeamDetails(team)"
                  class="text-primary-600 hover:text-primary-700 p-2"
                  title="Lihat Detail"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>

                <button
                  v-if="team.status === 'pending'"
                  @click="approveTeam(team)"
                  :disabled="isTeamInvitationsIncomplete(team._id)"
                  :class="
                    isTeamInvitationsIncomplete(team._id)
                      ? 'text-gray-400 cursor-not-allowed p-2'
                      : 'text-success-600 hover:text-success-700 p-2'
                  "
                  :title="getTeamInvitationsDisabledReason(team._id) || 'Setujui'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                <button
                  v-if="team.status === 'pending'"
                  @click="rejectTeam(team)"
                  :disabled="isTeamInvitationsIncomplete(team._id)"
                  :class="
                    isTeamInvitationsIncomplete(team._id)
                      ? 'text-gray-400 cursor-not-allowed p-2'
                      : 'text-danger-600 hover:text-danger-700 p-2'
                  "
                  :title="getTeamInvitationsDisabledReason(team._id) || 'Tolak'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                <button
                  @click="deleteTeam(team)"
                  class="text-danger-600 hover:text-danger-700 p-2"
                  title="Hapus"
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
    </div>

    <!-- Team Details Modal -->
    <BaseModal v-model="showDetailsModal" title="Detail Tim" size="lg">
      <div v-if="selectedTeam" class="space-y-4">
        <!-- Team Info -->
        <div class="bg-gray-100 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedTeam.teamName }}</h3>

          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-700">ID Tim</p>
              <div v-if="selectedTeam.capstoneGroupId" class="text-sm text-gray-600">
                {{ selectedTeam.capstoneGroupId }}
              </div>
              <div v-else class="flex gap-2">
                <input
                  v-model="newCapstoneGroupId"
                  type="text"
                  placeholder="Masukkan ID Tim (contoh: A25-CS246)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  @click="assignCapstoneGroupId"
                  class="px-4 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                >
                  Assign
                </button>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">Status</p>
              <p class="text-sm text-gray-600">{{ selectedTeam.status }}</p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">Use Case</p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">{{
                  selectedTeam.useCaseId?.title || selectedTeam.useCaseId?.name || 'N/A'
                }}</span>
                <span
                  v-if="selectedUseCase?.usecaseId || selectedTeam.useCaseId?.usecaseId"
                  class="ml-2 text-xs text-gray-500"
                  >(
                  {{ selectedUseCase?.usecaseId || selectedTeam.useCaseId?.usecaseId }}
                  )</span
                >
              </p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">
                Anggota ({{ selectedTeam.membersUserId?.length || 0 }})
              </p>
              <ul class="text-sm text-gray-600 space-y-2 mt-2">
                <li
                  v-for="(member, idx) in selectedTeam.membersUserId"
                  :key="idx"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div class="flex-1">
                    <span class="font-medium">{{
                      typeof member === 'object' ? member.name || member.studentId : member
                    }}</span>
                    <span
                      v-if="
                        typeof member === 'object' &&
                        (member.learningPathName || member.learningPath)
                      "
                      class="ml-2 text-xs text-gray-500"
                      >— {{ member.learningPathName || member.learningPath }}</span
                    >
                  </div>
                  <!-- Member action buttons (only for approved teams) -->
                  <div v-if="selectedTeam.status === 'approved'" class="flex space-x-2 ml-2">
                    <button
                      @click="openRemoveMemberModal(member)"
                      class="px-2 py-1 text-xs bg-danger-100 text-danger-700 rounded hover:bg-danger-200 transition-colors"
                      title="Hapus anggota"
                    >
                      Hapus
                    </button>
                    <button
                      @click="openReplaceMemberModal(member)"
                      class="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors"
                      title="Ganti anggota"
                    >
                      Ganti
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Pending Invitations Status -->
            <div v-if="selectedTeam.status === 'pending' && teamInvitations.length > 0">
              <p class="text-sm font-medium text-gray-700">Status Undangan</p>
              <ul class="text-sm space-y-2 mt-2">
                <li
                  v-for="inv in teamInvitations"
                  :key="inv._id"
                  class="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200"
                >
                  <div class="flex-1">
                    <span class="font-medium">{{ inv.memberId?.name || 'Unknown' }}</span>
                    <span class="ml-2 text-xs text-gray-500">{{ inv.memberId?.email }}</span>
                  </div>
                  <div class="flex items-center space-x-2 ml-2">
                    <span
                      v-if="inv.status === 'pending'"
                      class="px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded font-medium"
                    >
                      ⏳ Menunggu
                    </span>
                    <span
                      v-else-if="inv.status === 'accepted'"
                      class="px-2 py-1 text-xs bg-green-200 text-green-800 rounded font-medium"
                    >
                      ✓ Diterima
                    </span>
                    <span
                      v-else-if="inv.status === 'rejected'"
                      class="px-2 py-1 text-xs bg-red-200 text-red-800 rounded font-medium"
                    >
                      ✗ Ditolak
                    </span>
                  </div>
                </li>
              </ul>
              <div
                v-if="teamInvitations.some(inv => inv.status === 'pending')"
                class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded"
              >
                <p class="text-xs text-yellow-800">
                  ⚠️ Tim tidak bisa disetujui karena ada
                  {{ teamInvitations.filter(inv => inv.status === 'pending').length }} anggota yang
                  belum menerima undangan.
                </p>
              </div>
            </div>

            <!-- Show use case composition requirements and actual composition -->
            <div
              v-if="
                selectedUseCase &&
                selectedUseCase.teamComposition &&
                selectedUseCase.teamComposition.length > 0
              "
            >
              <p class="text-sm font-medium text-gray-700">Komposisi Tim (Diperlukan)</p>
              <ul class="text-sm text-gray-600 space-y-1 mt-2">
                <li v-for="(req, idx) in selectedUseCase.teamComposition" :key="idx">
                  • <span class="font-medium">{{ req.learningPathName }}</span
                  >: diperlukan {{ req.count }} — terdapat
                  {{ actualCompositionCounts[req.learningPathName] || 0 }}
                </li>
              </ul>
            </div>

            <div v-if="selectedTeam.submittedAt">
              <p class="text-sm font-medium text-gray-700">Terdaftar</p>
              <p class="text-sm text-gray-600">
                {{ new Date(selectedTeam.submittedAt).toLocaleDateString('id-ID') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">Tidak ada data tim yang dipilih</div>

      <template #footer>
        <div class="flex justify-end">
          <BaseButton variant="outline" @click="showDetailsModal = false"> Tutup </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Reject Confirmation Modal -->
    <BaseModal v-model="showRejectModal" title="Konfirmasi Penolakan" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menolak tim <strong>{{ selectedTeam?.teamName }}</strong
          >?
        </p>
        <BaseTextarea
          v-model="rejectReason"
          label="Alasan Penolakan (Opsional)"
          placeholder="Masukkan alasan penolakan..."
          :rows="4"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showRejectModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="processing" @click="confirmReject">
            Ya, Tolak Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="Konfirmasi Hapus" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus tim <strong>{{ selectedTeam?.teamName }}</strong
          >?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Tindakan ini tidak dapat dibatalkan. Semua data tim akan dihapus permanen.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="processing" @click="confirmDelete">
            Ya, Hapus Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Auto Create Teams Modal -->
    <BaseModal v-model="showAutoCreateModal" title="Randomize Tim Otomatis" size="md">
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-blue-900 mb-2">ℹ️ Informasi</h4>
          <ul class="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Siswa yang belum terdaftar di tim akan di-assign otomatis</li>
            <li>Tim dibuat berdasarkan learning path yang sama</li>
            <li>Anggota tim akan dirandom secara otomatis</li>
            <li>Tim yang dibuat akan langsung disetujui (status: approved)</li>
          </ul>
        </div>

        <div v-if="unregisteredStats" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">📊 Siswa Belum Terdaftar</h4>
          <p class="text-lg font-bold text-primary-600">{{ unregisteredStats.total }} siswa</p>
          <div v-if="unregisteredStats.byLearningPath" class="mt-2 space-y-1">
            <p
              v-for="(count, path) in unregisteredStats.byLearningPath"
              :key="path"
              class="text-sm text-gray-600"
            >
              {{ path }}: {{ count }} siswa
            </p>
          </div>
        </div>

        <BaseSelect
          v-model="autoCreateForm.useCaseId"
          label="Use Case"
          :options="useCaseOptionsForCreate"
          placeholder="Pilih Use Case"
          required
        />

        <!-- Use Case Composition Info -->
        <div
          v-if="selectedUseCaseForCreate"
          class="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
        >
          <h4 class="text-sm font-semibold text-indigo-900 mb-3">
            📋 Komposisi Tim yang Dibutuhkan
          </h4>

          <!-- If use case has team composition requirements -->
          <div
            v-if="
              selectedUseCaseForCreate.teamComposition &&
              selectedUseCaseForCreate.teamComposition.length > 0
            "
          >
            <div class="space-y-2">
              <div
                v-for="(comp, index) in selectedUseCaseForCreate.teamComposition"
                :key="index"
                class="flex justify-between items-center text-sm"
              >
                <span class="text-indigo-700 font-medium">
                  {{ comp.learningPathName || comp.learningPath || 'Unknown' }}
                </span>
                <span class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-semibold">
                  {{ comp.count }} orang
                </span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-indigo-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-indigo-900">Total Anggota per Tim:</span>
                <span class="bg-indigo-600 text-white px-3 py-1 rounded font-bold">
                  {{ selectedUseCaseForCreate.totalTeamSize }} orang
                </span>
              </div>
            </div>
          </div>

          <!-- If no team composition (flexible) -->
          <div v-else class="text-sm text-indigo-700">
            <p class="font-medium">Komposisi Fleksibel</p>
            <p class="text-xs text-indigo-600 mt-1">
              Tim dapat terdiri dari 2-4 anggota dengan learning path yang sama
            </p>
          </div>
        </div>

        <BaseInput
          v-model.number="autoCreateForm.teamSize"
          label="Ukuran Tim"
          type="number"
          min="2"
          max="4"
          placeholder="Jumlah anggota per tim (2-4)"
          :hint="
            selectedUseCaseForCreate?.totalTeamSize
              ? 'Ukuran tim otomatis disesuaikan dengan komposisi use case'
              : 'Jumlah anggota per tim yang akan dibuat'
          "
          :disabled="selectedUseCaseForCreate?.totalTeamSize > 0"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showAutoCreateModal = false"> Batal </BaseButton>
          <BaseButton
            variant="primary"
            :loading="autoCreating"
            :disabled="!autoCreateForm.useCaseId"
            @click="confirmAutoCreate"
          >
            Buat Tim Otomatis
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Remove Member Modal -->
    <RemoveMemberModal
      v-model="showRemoveMemberModal"
      :team="selectedTeam"
      :member="selectedMember"
      @confirm="handleRemoveMember"
    />

    <!-- Replace Member Modal -->
    <ReplaceMemberModal
      v-model="showReplaceMemberModal"
      :team="selectedTeam"
      :old-member="selectedMember"
      :available-members="getAvailableMembersForReplacement()"
      :use-cases="teamStore.useCases"
      @confirm="handleReplaceMember"
    />

    <!-- Bulk Approve Modal -->
    <BaseModal v-model="showBulkApproveModal" title="Konfirmasi Setujui Semua" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menyetujui <strong>{{ selectedTeams.size }} tim</strong>?
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-700">
            💡 Semua anggota tim akan menerima email notifikasi persetujuan.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showBulkApproveModal = false"> Batal </BaseButton>
          <BaseButton variant="success" :loading="bulkProcessing" @click="confirmBulkApprove">
            Ya, Setujui {{ selectedTeams.size }} Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Bulk Reject Modal -->
    <BaseModal v-model="showBulkRejectModal" title="Konfirmasi Tolak Semua" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menolak <strong>{{ selectedTeams.size }} tim</strong>?
        </p>
        <BaseTextarea
          v-model="bulkRejectReason"
          label="Alasan Penolakan (Opsional)"
          placeholder="Masukkan alasan penolakan..."
          :rows="4"
        />
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-700">
            💡 Semua anggota tim akan menerima email notifikasi penolakan dengan alasan ini.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showBulkRejectModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="bulkProcessing" @click="confirmBulkReject">
            Ya, Tolak {{ selectedTeams.size }} Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Bulk Delete Modal -->
    <BaseModal v-model="showBulkDeleteModal" title="Konfirmasi Hapus Semua" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus <strong>{{ selectedTeams.size }} tim</strong>?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-3">
          <p class="text-sm text-danger-700 font-semibold">
            ⚠️ Tindakan ini tidak dapat dibatalkan. Semua data tim akan dihapus.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showBulkDeleteModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="bulkProcessing" @click="confirmBulkDelete">
            Ya, Hapus {{ selectedTeams.size }} Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import api from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import RemoveMemberModal from '../../components/modals/RemoveMemberModal.vue'
import ReplaceMemberModal from '../../components/modals/ReplaceMemberModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const user = computed(() => authStore.user)
const processing = ref(false)

const searchQuery = ref('')
const filterStatus = ref('')
const filterUseCase = ref('')
const activeTab = ref('pending') // 'pending' | 'approved' | 'rejected'

const showDetailsModal = ref(false)
const showRejectModal = ref(false)
const showDeleteModal = ref(false)
const showAutoCreateModal = ref(false)
const showRemoveMemberModal = ref(false)
const showReplaceMemberModal = ref(false)
const showBulkApproveModal = ref(false)
const showBulkRejectModal = ref(false)
const showBulkDeleteModal = ref(false)
const selectedTeam = ref(null)
const selectedMember = ref(null)
const selectedTeams = ref(new Set())
const rejectReason = ref('')
const bulkRejectReason = ref('')
const newCapstoneGroupId = ref('')
const autoCreating = ref(false)
const unregisteredStats = ref(null)
const removingMember = ref(false)
const replacingMember = ref(false)
const bulkProcessing = ref(false)
const exporting = ref(false)
const teamInvitations = ref([])
const loadingInvitations = ref(false)
const teamInvitationsCache = ref({}) // Cache invitations per team ID
const autoCreateForm = ref({
  useCaseId: '',
  teamSize: 4,
})

// Default generation settings (ubah jika perlu)
const defaultBatch = ref(25) // Angkatan (contoh: 25 -> A25)
const defaultProgram = ref('CS') // Program/Prodi (contoh: CS -> Computer Science)

/**
 * Try to infer batch (two-digit) from team members' studentId, fallback to default
 */
const inferBatchFromMembers = team => {
  if (!team || !team.membersUserId) return null
  for (const m of team.membersUserId) {
    if (typeof m === 'object' && m.studentId) {
      const sid = String(m.studentId)
      // match patterns like 'A25', '25', or starting with two digits
      const aMatch = sid.match(/A(\d{2})/i)
      if (aMatch) return Number(aMatch[1])
      const numMatch = sid.match(/^(\d{2})/) // e.g. '25xxxx'
      if (numMatch) return Number(numMatch[1])
    }
  }
  return null
}

/**
 * Try to infer program code from members' learningPath or learningPathName
 */
const inferProgramFromMembers = team => {
  if (!team || !team.membersUserId) return null
  for (const m of team.membersUserId) {
    if (typeof m === 'object') {
      const lp = (m.learningPathName || m.learningPath || '').toString().toLowerCase()
      if (!lp) continue
      if (lp.includes('computer') || lp.includes('cs') || lp.includes('computer science'))
        return 'CS'
      if (lp.includes('information') && lp.includes('systems')) return 'IS'
    }
  }
  return null
}

const generateCapstoneGroupId = (batch, program) => {
  const b = String(batch)
  const p = String(program).toUpperCase()
  const pattern = new RegExp(`^A${b}-${p}(\\d+)$`, 'i')
  let max = 0
  ;(teamStore.teams || []).forEach(t => {
    if (!t.capstoneGroupId) return
    const m = String(t.capstoneGroupId).toUpperCase().match(pattern)
    if (m && m[1]) {
      const num = parseInt(m[1], 10)
      if (!Number.isNaN(num) && num > max) max = num
    }
  })
  const next = String(max + 1).padStart(3, '0')
  return `A${b}-${p}${next}`
}

// Get data from store
const loading = computed(() => teamStore.teamsLoading)
const teams = computed(() => teamStore.teams)
const pagination = computed(() => teamStore.pagination)

// Calculate stats from teams
const stats = computed(() => ({
  totalTeams: teams.value.length,
  pendingTeams: teamStore.pendingTeams.length,
  approvedTeams: teamStore.approvedTeams.length,
  rejectedTeams: teamStore.rejectedTeams.length,
}))

// Tab counts
const pendingCount = computed(() => teams.value.filter(t => t.status === 'pending').length)
const approvedCount = computed(() => teams.value.filter(t => t.status === 'approved').length)

const tableColumns = [
  { key: 'teamName', label: 'Nama Tim', sortable: true },
  { key: 'capstoneGroupId', label: 'ID Tim', sortable: false },
  { key: 'membersUserId', label: 'Jumlah Anggota', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'submittedAt', label: 'Tanggal Daftar', sortable: true },
]

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
]

const { adminMenuItems } = useAdminMenu()

// Generate use case options from store
const useCaseOptions = computed(() => {
  const options = [{ value: '', label: 'Semua Use Case' }]

  console.log('[useCaseOptions] teamStore.useCases:', teamStore.useCases)

  if (teamStore.useCases && teamStore.useCases.length > 0) {
    teamStore.useCases.forEach(useCase => {
      options.push({
        value: useCase.usecaseId || useCase._id,
        label: `${useCase.title} (${useCase.usecaseId})`,
      })
    })
  }

  console.log('[useCaseOptions] final options:', options)
  return options
})

// Use case options for auto-create (without 'Semua' option)
const useCaseOptionsForCreate = computed(() => {
  const options = []
  if (teamStore.useCases && teamStore.useCases.length > 0) {
    teamStore.useCases.forEach(useCase => {
      // Use id or _id (backend toJSON transform changes _id to id)
      const useCaseId = useCase.id || useCase._id
      console.log('[useCaseOptionsForCreate] UseCase:', {
        title: useCase.title,
        id: useCase.id,
        _id: useCase._id,
        useCaseId,
      })
      options.push({
        value: useCaseId,
        label: `${useCase.title} (${useCase.usecaseId})`,
      })
    })
  }
  return options
})

// Get selected use case details for auto-create modal
const selectedUseCaseForCreate = computed(() => {
  if (!autoCreateForm.value.useCaseId || !teamStore.useCases) return null

  const selected = teamStore.useCases.find(uc => {
    const ucId = uc.id || uc._id
    return ucId === autoCreateForm.value.useCaseId
  })

  console.log('[selectedUseCaseForCreate] Selected:', selected)
  return selected || null
})

const filteredTeams = computed(() => {
  let result = teams.value || []

  console.log('[filteredTeams] Initial teams:', result)
  console.log('[filteredTeams] activeTab:', activeTab.value)

  // Filter by active tab (status)
  result = result.filter(team => team.status === activeTab.value)

  // Filter by search query
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      team =>
        team.teamName?.toLowerCase().includes(query) ||
        team.capstoneGroupId?.toLowerCase().includes(query)
    )
  }

  // Filter by use case
  if (filterUseCase.value && filterUseCase.value.trim()) {
    console.log('[filteredTeams] Filtering by use case, before filter count:', result.length)
    result = result.filter(team => {
      // team.useCaseId is an object with usecaseId property
      const teamUseCaseId = team.useCaseId?.usecaseId
      console.log('[filteredTeams] Team:', {
        name: team.teamName,
        useCaseId: team.useCaseId,
        teamUseCaseId: teamUseCaseId,
        filterValue: filterUseCase.value,
        match: teamUseCaseId === filterUseCase.value,
      })
      return teamUseCaseId === filterUseCase.value
    })
    console.log('[filteredTeams] After filter count:', result.length)
  }

  return result
})

/**
 * Check if team invitations are incomplete
 * Team is complete ONLY if:
 * 1. All members have at least ONE accepted invitation
 * 2. No member has ONLY pending/rejected invitations
 */
const isTeamInvitationsIncomplete = teamId => {
  const invitations = teamInvitationsCache.value[teamId] || []

  // Group invitations by member
  const memberInvitations = {}
  invitations.forEach(inv => {
    const memberId = inv.memberId?._id || inv.memberId
    if (!memberInvitations[memberId]) {
      memberInvitations[memberId] = []
    }
    memberInvitations[memberId].push(inv)
  })

  // Check if each member has at least one accepted invitation
  for (const memberId in memberInvitations) {
    const memberInvs = memberInvitations[memberId]
    const hasAccepted = memberInvs.some(inv => inv.status === 'accepted')
    if (!hasAccepted) {
      // Member has no accepted invitation (only pending/rejected)
      return true
    }
  }

  return false
}

/**
 * Get reason why team invitations are incomplete
 */
const getTeamInvitationsDisabledReason = teamId => {
  const invitations = teamInvitationsCache.value[teamId] || []

  // Group invitations by member
  const memberInvitations = {}
  invitations.forEach(inv => {
    const memberId = inv.memberId?._id || inv.memberId
    if (!memberInvitations[memberId]) {
      memberInvitations[memberId] = []
    }
    memberInvitations[memberId].push(inv)
  })

  // Find members without accepted invitation
  const incompleteMembers = []
  for (const memberId in memberInvitations) {
    const memberInvs = memberInvitations[memberId]
    const hasAccepted = memberInvs.some(inv => inv.status === 'accepted')
    if (!hasAccepted) {
      const memberName =
        memberInvs[0]?.memberId?.name || memberInvs[0]?.memberId?.email || 'Unknown'
      const statuses = memberInvs.map(inv => inv.status).join(', ')
      incompleteMembers.push(`${memberName} (${statuses})`)
    }
  }

  if (incompleteMembers.length > 0) {
    return `Anggota belum accept: ${incompleteMembers.join(', ')}`
  }

  return null
}

/**
 * Check if any selected team has incomplete invitations
 */
const selectedTeamsHasPendingInvitations = computed(() => {
  return Array.from(selectedTeams.value).some(teamId => {
    return isTeamInvitationsIncomplete(teamId)
  })
})

/**
 * Check if all visible teams are selected
 */
const isAllSelected = computed(() => {
  return (
    filteredTeams.value.length > 0 && filteredTeams.value.every(t => selectedTeams.value.has(t._id))
  )
})

/**
 * Check if some (but not all) visible teams are selected
 */
const isSomeSelected = computed(() => {
  return selectedTeams.value.size > 0 && !isAllSelected.value
})

/**
 * Clear selection when tab changes
 */
watch(activeTab, () => {
  selectedTeams.value.clear()
})

const getStatusVariant = status => {
  const variants = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return variants[status] || 'secondary'
}

const getStatusLabel = status => {
  const labels = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }
  return labels[status] || status
}

/**
 * Check if team has pending invitations (members belum accept)
 */
const hasPendingInvitations = async team => {
  if (team.status !== 'pending') return false

  try {
    const response = await api.get(`/invitations/team/${team._id}`)
    if (response.success) {
      const invitations = response.data || []
      return invitations.some(inv => inv.status === 'pending')
    }
  } catch (error) {
    console.error('[hasPendingInvitations] Error:', error)
  }
  return false
}

const viewTeamDetails = async team => {
  selectedTeam.value = team
  showDetailsModal.value = true
  teamInvitations.value = []

  // If team belum punya capstoneGroupId, prefill input dengan ID yang digenerate
  if (!team.capstoneGroupId) {
    const inferredBatch = inferBatchFromMembers(team) || defaultBatch.value
    const inferredProgram = inferProgramFromMembers(team) || defaultProgram.value
    try {
      newCapstoneGroupId.value = generateCapstoneGroupId(inferredBatch, inferredProgram)
    } catch (e) {
      // fallback ke format dasar jika error
      newCapstoneGroupId.value = `A${inferredBatch}-${inferredProgram}001`
    }
  } else {
    newCapstoneGroupId.value = ''
  }

  // Fetch team invitations to show pending status
  if (team.status === 'pending') {
    try {
      loadingInvitations.value = true
      const response = await api.get(`/invitations/team/${team._id}`)
      if (response.success) {
        teamInvitations.value = response.data || []
        console.log('[viewTeamDetails] Invitations loaded:', teamInvitations.value.length)
      }
    } catch (error) {
      console.error('[viewTeamDetails] Failed to load invitations:', error)
    } finally {
      loadingInvitations.value = false
    }
  }
}

// Compute selected use case details from store (full object with composition)
const selectedUseCase = computed(() => {
  if (!selectedTeam.value) return null
  const ucId =
    selectedTeam.value.useCaseId?._id ||
    selectedTeam.value.useCaseId?.id ||
    selectedTeam.value.useCaseId
  if (!ucId) return null
  // Try to find in store by _id or id or usecaseId code
  const found = teamStore.useCases.find(
    uc =>
      uc._id === ucId || uc.id === ucId || uc.usecaseId === selectedTeam.value.useCaseId?.usecaseId
  )
  return found || selectedTeam.value.useCaseId || null
})

// Compute actual composition counts by learningPathName
const actualCompositionCounts = computed(() => {
  const counts = {}
  if (!selectedTeam.value || !selectedTeam.value.membersUserId) return counts
  selectedTeam.value.membersUserId.forEach(member => {
    if (typeof member === 'object') {
      const name = member.learningPathName || member.learningPath || 'Unknown'
      counts[name] = (counts[name] || 0) + 1
    }
  })
  return counts
})

const approveTeam = async team => {
  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.approveTeam(team._id || team.id)
    teamStore.setSuccess('Tim berhasil disetujui')
    showDetailsModal.value = false

    // Clear invitation cache for approved team
    delete teamInvitationsCache.value[team._id || team.id]

    // Auto-switch to approved tab
    activeTab.value = 'approved'

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'approveTeam')
    console.error('Failed to approve team:', err)
  } finally {
    processing.value = false
  }
}

const rejectTeam = team => {
  selectedTeam.value = team
  showRejectModal.value = true
  showDetailsModal.value = false
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    teamStore.setError({ message: 'Alasan penolakan tidak boleh kosong' }, 'confirmReject')
    return
  }

  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.rejectTeam(selectedTeam.value._id || selectedTeam.value.id, rejectReason.value)
    teamStore.setSuccess('Tim berhasil ditolak')
    showRejectModal.value = false
    rejectReason.value = ''

    // Clear invitation cache for rejected team
    delete teamInvitationsCache.value[selectedTeam.value._id || selectedTeam.value.id]

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'confirmReject')
    console.error('Failed to reject team:', err)
  } finally {
    processing.value = false
  }
}

const deleteTeam = team => {
  selectedTeam.value = team
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.deleteTeam(selectedTeam.value._id || selectedTeam.value.id)
    teamStore.setSuccess('Tim berhasil dihapus')
    showDeleteModal.value = false

    // Clear invitation cache for deleted team
    delete teamInvitationsCache.value[selectedTeam.value._id || selectedTeam.value.id]

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'confirmDelete')
    console.error('Failed to delete team:', err)
  } finally {
    processing.value = false
  }
}

const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order)
  // TODO: Implement sorting
}

const handlePageChange = page => {
  pagination.value.page = page
  // TODO: Fetch data for new page
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchTeams = async () => {
  try {
    const params = {
      status: filterStatus.value,
      search: searchQuery.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    }

    await teamStore.fetchTeams(params)

    // Fetch invitations for all pending teams
    const pendingTeams = teams.value.filter(t => t.status === 'pending')
    for (const team of pendingTeams) {
      try {
        const response = await api.get(`/invitations/team/${team._id}`)
        if (response.success) {
          teamInvitationsCache.value[team._id] = response.data || []
        }
      } catch (error) {
        console.error(`[fetchTeams] Failed to load invitations for team ${team._id}:`, error)
      }
    }
  } catch (err) {
    console.error('Failed to fetch teams:', err)
  }
}

// Watch filters and refetch
watch([searchQuery, filterStatus, filterUseCase], () => {
  fetchTeams()
})

const assignCapstoneGroupId = async () => {
  if (!newCapstoneGroupId.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Masukkan ID Tim terlebih dahulu' })
    return
  }

  try {
    // Call API to update team with capstoneGroupId
    await teamStore.updateTeam(selectedTeam.value._id, {
      capstoneGroupId: newCapstoneGroupId.value,
    })

    // Update selectedTeam
    selectedTeam.value.capstoneGroupId = newCapstoneGroupId.value
    newCapstoneGroupId.value = ''

    // Refresh teams list
    await fetchTeams()

    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'ID Tim berhasil di-assign!' })
  } catch (err) {
    console.error('Failed to assign capstoneGroupId:', err)
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal assign ID Tim: ' + err.message })
  }
}

// Fetch unregistered students stats
const fetchUnregisteredStats = async () => {
  try {
    const response = await api.get('/admin/students/unregistered')
    if (response.success && response.data) {
      const students = response.data
      const byPath = {}
      students.forEach(student => {
        const path = student.learningPathName || 'Unknown'
        byPath[path] = (byPath[path] || 0) + 1
      })
      unregisteredStats.value = {
        total: students.length,
        byLearningPath: byPath,
      }
    }
  } catch (err) {
    console.error('Failed to fetch unregistered students:', err)
  }
}

// Auto-create teams for unregistered students
const confirmAutoCreate = async () => {
  if (!autoCreateForm.value.useCaseId) {
    Swal.fire({
      icon: 'warning',
      title: 'Perhatian',
      text: 'Pilih Use Case terlebih dahulu',
    })
    return
  }

  // Confirm action
  const confirm = await Swal.fire({
    icon: 'question',
    title: 'Konfirmasi',
    text: `Buat tim otomatis untuk ${unregisteredStats.value?.total || 0} siswa yang belum terdaftar?`,
    showCancelButton: true,
    confirmButtonText: 'Ya, Buat Tim',
    cancelButtonText: 'Batal',
  })

  if (!confirm.isConfirmed) return

  autoCreating.value = true
  teamStore.clearError()

  try {
    const response = await api.post('/admin/teams/auto-create', {
      useCaseId: autoCreateForm.value.useCaseId,
      teamSize: autoCreateForm.value.teamSize || 4,
    })

    if (response.success) {
      showAutoCreateModal.value = false

      // Refresh teams and stats
      await fetchTeams()
      await fetchUnregisteredStats()

      // Show appropriate message based on results
      if (response.data.teamsCreated === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Ada Tim Dibuat',
          html: `
            <p>${response.message}</p>
            ${
              response.data.skippedStudents
                ? `<p class="text-sm text-gray-600 mt-2">
              <strong>${response.data.skippedStudents}</strong> siswa di-skip karena tidak memiliki learning path yang valid.
            </p>`
                : ''
            }
            <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-left">
              <p class="text-sm font-semibold text-yellow-800 mb-2">💡 Saran:</p>
              <ul class="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>Pastikan semua siswa memiliki learning path yang ter-assign</li>
                <li>Cek data siswa di database untuk field 'learningPathName' atau 'learningPath'</li>
                <li>Minimal 2 siswa dengan learning path yang sama diperlukan untuk membuat tim</li>
              </ul>
            </div>
          `,
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          html: `
            <p>${response.message}</p>
            <p class="text-sm text-gray-600 mt-2">
              <strong>${response.data.teamsCreated}</strong> tim dibuat<br>
              <strong>${response.data.studentsAssigned}</strong> siswa di-assign
            </p>
            ${
              response.data.skippedStudents
                ? `<p class="text-sm text-orange-600 mt-2">
              ⚠️ <strong>${response.data.skippedStudents}</strong> siswa di-skip (tidak ada learning path)
            </p>`
                : ''
            }
          `,
        })
      }

      // Reset form
      autoCreateForm.value = {
        useCaseId: '',
        teamSize: 4,
      }
    }
  } catch (err) {
    console.error('Failed to auto-create teams:', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: err.message || 'Gagal membuat tim otomatis',
    })
  } finally {
    autoCreating.value = false
  }
}

// Watch auto-create modal to fetch stats when opened
watch(showAutoCreateModal, newVal => {
  if (newVal) {
    fetchUnregisteredStats()
  }
})

// Watch selected use case to auto-adjust team size if composition is defined
watch(
  () => autoCreateForm.value.useCaseId,
  newUseCaseId => {
    if (newUseCaseId && selectedUseCaseForCreate.value) {
      // If use case has team composition, set team size to totalTeamSize
      if (
        selectedUseCaseForCreate.value.totalTeamSize &&
        selectedUseCaseForCreate.value.totalTeamSize > 0
      ) {
        autoCreateForm.value.teamSize = selectedUseCaseForCreate.value.totalTeamSize
        console.log(
          '[Watch useCaseId] Auto-adjusted team size to:',
          selectedUseCaseForCreate.value.totalTeamSize
        )
      }
    }
  }
)

/**
 * Export teams to CSV
 */
const exportTeamsCSV = async () => {
  exporting.value = true
  try {
    // Get filter options
    const filters = {
      status: filterStatus.value || undefined,
      useCaseId: filterUseCase.value || undefined,
      search: searchQuery.value || undefined,
    }

    // Call API directly to get CSV
    const response = await api.get('/capstone-group/export-csv', {
      params: filters,
    })

    // Create blob from response data
    const blob = new Blob([response], { type: 'text/csv; charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `teams-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'File CSV berhasil diunduh',
    })
  } catch (error) {
    console.error('Failed to export teams:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal mengunduh file CSV',
    })
  } finally {
    exporting.value = false
  }
}

/**
 * Toggle team selection
 */
const toggleTeamSelection = teamId => {
  if (selectedTeams.value.has(teamId)) {
    selectedTeams.value.delete(teamId)
  } else {
    selectedTeams.value.add(teamId)
  }
}

/**
 * Clear all selections
 */
const clearSelection = () => {
  selectedTeams.value.clear()
}

/**
 * Toggle select all visible teams
 */
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all visible teams
    filteredTeams.value.forEach(t => selectedTeams.value.delete(t._id))
  } else {
    // Select all visible teams
    filteredTeams.value.forEach(t => selectedTeams.value.add(t._id))
  }
}

/**
 * Show bulk approve modal
 */
const bulkApproveTeams = () => {
  if (selectedTeams.value.size === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Tim',
      text: 'Pilih minimal 1 tim untuk disetujui',
    })
    return
  }
  showBulkApproveModal.value = true
}

/**
 * Show bulk reject modal
 */
const bulkRejectTeams = () => {
  if (selectedTeams.value.size === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Tim',
      text: 'Pilih minimal 1 tim untuk ditolak',
    })
    return
  }
  bulkRejectReason.value = ''
  showBulkRejectModal.value = true
}

/**
 * Show bulk delete modal
 */
const bulkDeleteTeams = () => {
  if (selectedTeams.value.size === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Pilih Tim',
      text: 'Pilih minimal 1 tim untuk dihapus',
    })
    return
  }
  showBulkDeleteModal.value = true
}

/**
 * Confirm bulk approve
 */
const confirmBulkApprove = async () => {
  bulkProcessing.value = true
  try {
    const teamIds = Array.from(selectedTeams.value)
    const response = await teamStore.bulkApproveTeams(teamIds)

    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${teamIds.length} tim berhasil disetujui`,
      })

      // Clear invitation cache for approved teams
      teamIds.forEach(id => {
        delete teamInvitationsCache.value[id]
      })

      showBulkApproveModal.value = false
      selectedTeams.value.clear()

      // Reset filter to show all teams (including approved ones)
      filterStatus.value = ''

      // Auto-switch to approved tab
      activeTab.value = 'approved'

      await fetchTeams()
    }
  } catch (error) {
    console.error('Failed to bulk approve teams:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal menyetujui tim',
    })
  } finally {
    bulkProcessing.value = false
  }
}

/**
 * Confirm bulk reject
 */
const confirmBulkReject = async () => {
  bulkProcessing.value = true
  try {
    const teamIds = Array.from(selectedTeams.value)
    const response = await teamStore.bulkRejectTeams(teamIds, bulkRejectReason.value)

    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${teamIds.length} tim berhasil ditolak`,
      })

      // Clear invitation cache for rejected teams
      teamIds.forEach(id => {
        delete teamInvitationsCache.value[id]
      })

      showBulkRejectModal.value = false
      selectedTeams.value.clear()
      bulkRejectReason.value = ''

      // Reset filter to show all teams
      filterStatus.value = ''

      await fetchTeams()
    }
  } catch (error) {
    console.error('Failed to bulk reject teams:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal menolak tim',
    })
  } finally {
    bulkProcessing.value = false
  }
}

/**
 * Confirm bulk delete
 */
const confirmBulkDelete = async () => {
  bulkProcessing.value = true
  try {
    const teamIds = Array.from(selectedTeams.value)
    const response = await teamStore.bulkDeleteTeams(teamIds)

    if (response.success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${teamIds.length} tim berhasil dihapus`,
      })

      // Clear invitation cache for deleted teams
      teamIds.forEach(id => {
        delete teamInvitationsCache.value[id]
      })

      showBulkDeleteModal.value = false
      selectedTeams.value.clear()

      // Reset filter to show remaining teams
      filterStatus.value = ''

      await fetchTeams()
    }
  } catch (error) {
    console.error('Failed to bulk delete teams:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal menghapus tim',
    })
  } finally {
    bulkProcessing.value = false
  }
}

/**
 * Open remove member modal
 */
const openRemoveMemberModal = member => {
  selectedMember.value = member
  showRemoveMemberModal.value = true
}

/**
 * Open replace member modal
 */
const openReplaceMemberModal = member => {
  selectedMember.value = member
  showReplaceMemberModal.value = true
}

/**
 * Get available members for replacement (all students except current team members)
 */
const getAvailableMembersForReplacement = () => {
  if (!selectedTeam.value) return []

  // Get current team member IDs
  const currentMemberIds = new Set(
    selectedTeam.value.membersUserId?.map(m => m._id || m.id || m.studentId) || []
  )

  // For now, return empty array - in real implementation, fetch from API
  // This would be: GET /api/students/available or similar
  return []
}

/**
 * Handle remove member confirmation
 */
const handleRemoveMember = async data => {
  if (!selectedTeam.value) return

  removingMember.value = true
  try {
    const response = await teamStore.removeTeamMember(selectedTeam.value._id, data.memberId)

    if (response.success) {
      // Update selected team with new data
      selectedTeam.value = response.data

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Anggota berhasil dihapus dari tim',
      })

      showRemoveMemberModal.value = false
      selectedMember.value = null

      // Refresh teams list
      await fetchTeams()
    }
  } catch (error) {
    console.error('Failed to remove member:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal menghapus anggota',
    })
  } finally {
    removingMember.value = false
  }
}

/**
 * Handle replace member confirmation
 */
const handleReplaceMember = async data => {
  if (!selectedTeam.value) return

  replacingMember.value = true
  try {
    const response = await teamStore.replaceTeamMember(
      selectedTeam.value._id,
      data.oldMemberId,
      data.newMemberId
    )

    if (response.success) {
      // Update selected team with new data
      selectedTeam.value = response.data

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Anggota berhasil diganti',
      })

      showReplaceMemberModal.value = false
      selectedMember.value = null

      // Refresh teams list
      await fetchTeams()
    }
  } catch (error) {
    console.error('Failed to replace member:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Gagal mengganti anggota',
    })
  } finally {
    replacingMember.value = false
  }
}

onMounted(() => {
  // Fetch use cases for filter dropdown
  teamStore.fetchUseCases()

  // Fetch teams
  fetchTeams()
})
</script>
