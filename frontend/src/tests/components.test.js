import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseBadge from '../components/base/BaseBadge.vue'

describe('BaseButton', () => {
  it('renders button with text', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click Me'
      }
    })

    expect(wrapper.text()).toContain('Click Me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('applies primary variant class', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'primary'
      },
      slots: {
        default: 'Primary Button'
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-600')
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('shows loading state', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading'
      }
    })

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})

describe('BaseInput', () => {
  it('renders input with label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'Username',
        modelValue: ''
      }
    })

    expect(wrapper.find('label').text()).toContain('Username')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('updates modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e })
      }
    })

    await wrapper.find('input').setValue('test value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('shows error message when error prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'Email',
        modelValue: '',
        error: 'Invalid email'
      }
    })

    expect(wrapper.text()).toContain('Invalid email')
    // Error border styling is applied via Tailwind classes
    expect(wrapper.html()).toContain('Invalid email')
  })

  it('shows required asterisk when required', () => {
    const wrapper = mount(BaseInput, {
      props: {
        label: 'Password',
        modelValue: '',
        required: true
      }
    })

    expect(wrapper.html()).toContain('*')
  })

  it('applies disabled state', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        disabled: true
      }
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('BaseBadge', () => {
  it('renders badge with text', () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: 'New'
      }
    })

    expect(wrapper.text()).toBe('New')
  })

  it('applies primary variant', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        variant: 'primary'
      },
      slots: {
        default: 'Primary'
      }
    })

    expect(wrapper.classes()).toContain('bg-primary-100')
    expect(wrapper.classes()).toContain('text-primary-800')
  })

  it('applies success variant', () => {
    const wrapper = mount(BaseBadge, {
      props: {
        variant: 'success'
      },
      slots: {
        default: 'Success'
      }
    })

    expect(wrapper.classes()).toContain('bg-success-100')
    expect(wrapper.classes()).toContain('text-success-800')
  })

  it('applies different sizes', () => {
    const wrapperSm = mount(BaseBadge, {
      props: { size: 'sm' },
      slots: { default: 'Small' }
    })

    const wrapperMd = mount(BaseBadge, {
      props: { size: 'md' },
      slots: { default: 'Medium' }
    })

    expect(wrapperSm.classes()).toContain('text-xs')
    expect(wrapperMd.classes()).toContain('text-sm')
  })
})
