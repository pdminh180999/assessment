import { Toast, ToastType } from './Toast'
import { create } from 'zustand'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 left-1/2 z-50 flex flex-col gap-2 max-w-md" style={{transform: 'translate(-50%, 0)'}}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  )
}

// Helper hook for easier toast usage
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast)

  return {
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  }
}
