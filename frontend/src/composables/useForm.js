import { ref, computed } from 'vue'

/**
 * Composable untuk handle form state dan validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler
 * @param {Object} options - Configuration options
 * @returns {Object} - Form state and methods
 */
export const useForm = (initialValues = {}, onSubmit = null, options = {}) => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    resetOnSubmit = true
  } = options

  const values = ref({ ...initialValues })
  const errors = ref({})
  const touched = ref({})
  const isSubmitting = ref(false)
  const submitError = ref(null)
  const submitSuccess = ref(null)

  const isDirty = computed(() => {
    return JSON.stringify(values.value) !== JSON.stringify(initialValues)
  })

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const setFieldValue = (field, value) => {
    values.value[field] = value

    if (validateOnChange && errors.value[field]) {
      // Clear error when field is corrected
      delete errors.value[field]
    }
  }

  const setFieldError = (field, error) => {
    if (error) {
      errors.value[field] = error
    } else {
      delete errors.value[field]
    }
  }

  const setFieldTouched = (field, isTouched = true) => {
    if (isTouched) {
      touched.value[field] = true
    } else {
      delete touched.value[field]
    }
  }

  const setErrors = (newErrors) => {
    errors.value = { ...newErrors }
  }

  const setValues = (newValues) => {
    values.value = { ...values.value, ...newValues }
  }

  const resetForm = () => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
    submitError.value = null
    submitSuccess.value = null
  }

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault()
    }

    isSubmitting.value = true
    submitError.value = null
    submitSuccess.value = null

    try {
      if (onSubmit) {
        await onSubmit(values.value)
        submitSuccess.value = 'Form submitted successfully'

        if (resetOnSubmit) {
          resetForm()
        }
      }
    } catch (error) {
      submitError.value = error.message || 'Failed to submit form'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    setFieldValue(name, fieldValue)
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setFieldTouched(name, true)
  }

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,

    // Computed
    isDirty,
    isValid,

    // Methods
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors,
    setValues,
    resetForm,
    handleSubmit,
    handleChange,
    handleBlur
  }
}

export default useForm
