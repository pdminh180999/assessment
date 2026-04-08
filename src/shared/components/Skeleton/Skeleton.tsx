interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export const Skeleton = ({ className = '', variant = 'text' }: SkeletonProps) => {
  const variants = {
    text: 'h-4 w-full',
    rectangular: 'h-32 w-full',
    circular: 'h-12 w-12 rounded-full',
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${variants[variant]} ${className}`}
      aria-label="Loading..."
    />
  )
}
