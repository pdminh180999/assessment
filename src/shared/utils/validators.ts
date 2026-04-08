export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}

export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}
