import { ref, computed } from 'vue'

/**
 * Composable untuk handle pagination
 * @param {Object} initialState - Initial pagination state
 * @returns {Object} - Pagination state and methods
 */
export const usePagination = (initialState = {}) => {
  const {
    page = 1,
    limit = 10,
    total = 0,
    totalPages = 0
  } = initialState

  const currentPage = ref(page)
  const pageLimit = ref(limit)
  const totalItems = ref(total)
  const totalPageCount = ref(totalPages)

  const hasNextPage = computed(() => currentPage.value < totalPageCount.value)
  const hasPrevPage = computed(() => currentPage.value > 1)
  const startItem = computed(() => (currentPage.value - 1) * pageLimit.value + 1)
  const endItem = computed(() => Math.min(currentPage.value * pageLimit.value, totalItems.value))

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPageCount.value) {
      currentPage.value = pageNum
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const setPageLimit = (limit) => {
    pageLimit.value = limit
    currentPage.value = 1 // Reset to first page
  }

  const updatePagination = (data) => {
    if (data.page) currentPage.value = data.page
    if (data.limit) pageLimit.value = data.limit
    if (data.total) totalItems.value = data.total
    if (data.totalPages) totalPageCount.value = data.totalPages
  }

  const reset = () => {
    currentPage.value = 1
    pageLimit.value = 10
    totalItems.value = 0
    totalPageCount.value = 0
  }

  return {
    // State
    currentPage,
    pageLimit,
    totalItems,
    totalPageCount,

    // Computed
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,

    // Methods
    goToPage,
    nextPage,
    prevPage,
    setPageLimit,
    updatePagination,
    reset
  }
}

export default usePagination
