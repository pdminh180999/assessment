import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { useDragDrop } from '@/features'

// Mock card
const mockCard = {
  id: 'card-1',
  wishlistId: 'stack-1',
}

describe('useDragDrop', () => {
  let onDelete: ReturnType<typeof vi.fn>
  let onSwipeLeft: ReturnType<typeof vi.fn>
  let onSwipeRight: ReturnType<typeof vi.fn>
  let onMoveToStack: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onDelete = vi.fn()
    onSwipeLeft = vi.fn()
    onSwipeRight = vi.fn()
    onMoveToStack = vi.fn()
  })

  const setup = () =>
    renderHook(() =>
      useDragDrop({
        onDelete,
        onSwipeLeft,
        onSwipeRight,
        onMoveToStack,
      }),
    )

  // ✅ Drag Start
  it('should set active card on drag start', () => {
    const { result } = setup()

    const event = {
      active: {
        data: {
          current: { card: mockCard },
        },
      },
    } as unknown as DragStartEvent

    act(() => {
      result.current.handleDragStart(event)
    })

    expect(result.current.activeCard).toEqual(mockCard)
    expect(result.current.dragState.isDragging).toBe(true)
  })

  // ✅ Drag Move (delete zone)
  it('should detect delete zone on drag move', () => {
    const { result } = setup()

    const event = {
      over: { id: 'delete-zone' },
    } as unknown as DragMoveEvent

    act(() => {
      result.current.handleDragMove(event)
    })

    expect(result.current.dragState.isOverDelete).toBe(true)
  })

  // ✅ Drag End → Delete
  it('should call onDelete when dropped in delete zone', () => {
    const { result } = setup()

    const event = {
      active: {
        data: { current: { card: mockCard } },
      },
      over: { id: 'delete-zone' },
    } as unknown as DragEndEvent

    act(() => {
      result.current.handleDragEnd(event)
    })

    expect(onDelete).toHaveBeenCalledWith('stack-1', 'card-1')
  })

  // ✅ Drag End → Swipe Left
  it('should call onSwipeLeft', () => {
    const { result } = setup()

    const event = {
      active: {
        data: { current: { card: mockCard } },
      },
      over: { id: 'move-left-zone' },
    } as unknown as DragEndEvent

    act(() => {
      result.current.handleDragEnd(event)
    })

    expect(onSwipeLeft).toHaveBeenCalled()
  })

  // ✅ Drag End → Swipe Right
  it('should call onSwipeRight', () => {
    const { result } = setup()

    const event = {
      active: {
        data: { current: { card: mockCard } },
      },
      over: { id: 'move-right-zone' },
    } as unknown as DragEndEvent

    act(() => {
      result.current.handleDragEnd(event)
    })

    expect(onSwipeRight).toHaveBeenCalled()
  })

  // ✅ Drag End → Move to another stack
  it('should move card to another stack', () => {
    const { result } = setup()

    // simulate drag move first (sets targetStack)
    act(() => {
      result.current.handleDragMove({
        over: {
          id: 'stack-2',
          data: {
            current: {
              type: 'stack',
              stack: { id: 'stack-2' },
            },
          },
        },
      } as unknown as DragMoveEvent)
    })

    const event = {
      active: {
        data: { current: { card: mockCard } },
      },
      over: {
        data: {
          current: { type: 'stack' },
        },
      },
    } as unknown as DragEndEvent

    act(() => {
      result.current.handleDragEnd(event)
    })

    expect(onMoveToStack).toHaveBeenCalledWith(
      'stack-1',
      'stack-2',
      'card-1',
    )
  })

  // ✅ Reset after drag end
  it('should reset state after drag end', () => {
    const { result } = setup()

    const event = {
      active: {
        data: { current: { card: mockCard } },
      },
      over: { id: 'delete-zone' },
    } as unknown as DragEndEvent

    act(() => {
      result.current.handleDragEnd(event)
    })

    expect(result.current.activeCard).toBe(null)
    expect(result.current.dragState.isDragging).toBe(false)
  })
})
