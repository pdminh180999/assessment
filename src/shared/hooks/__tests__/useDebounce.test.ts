import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })
    expect(result.current).toBe('initial') // Still old value

    await waitFor(() => expect(result.current).toBe('updated'), { timeout: 600 })
  })

  it('should use default delay of 300ms', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'test' } },
    )

    rerender({ value: 'changed' })

    await waitFor(() => expect(result.current).toBe('changed'), { timeout: 400 })
  })
})
