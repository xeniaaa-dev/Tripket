import { useId } from 'react'

// HeroUI Spinner (size "sm", color "warning") as the live app renders it: 16px, #f5a524, spins 0.75s linear.
export function Spinner({ className = '' }: { className?: string }) {
  const id = useId()
  return (
    <span className={`inline-flex size-[16px] shrink-0 animate-[spin_0.75s_linear_infinite] text-[#f5a524] ${className}`}>
      <svg viewBox="0 0 24 24" aria-label="Loading" role="presentation" className="size-full">
        <defs>
          <linearGradient id={`${id}-1`} x1="50%" x2="50%" y1="5.271%" y2="91.793%">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id={`${id}-2`} x1="50%" x2="50%" y1="15.24%" y2="87.15%">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <g fill="none" transform="translate(1.5 1.625)">
          <path
            d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021"
            fill={`url(#${id}-1)`}
          />
          <path
            d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118"
            fill={`url(#${id}-2)`}
          />
        </g>
      </svg>
    </span>
  )
}

// HeroUI Skeleton: #eaeaeb at 70%, shimmer sweep 2s linear infinite.
function Skeleton({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden bg-[#eaeaeb]/70 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[schedule-skeleton_2s_linear_infinite] bg-linear-to-r from-transparent via-[#eaeaeb] to-transparent" />
    </div>
  )
}

/** TicketSkeletonList — shown inside an expanded day while its first page loads */
export function TicketSkeletonList({ count }: { count: number }) {
  return (
    <div className="space-y-[8px]">
      <style>{'@keyframes schedule-skeleton{to{transform:translateX(200%)}}'}</style>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-[12px] rounded-[12px] border border-[#f1f5f9] bg-white p-[24px] shadow-[0_10px_15px_-3px_#f1f5f9,0_4px_6px_-4px_#f1f5f9]">
          <div className="flex items-center gap-[12px]">
            <Skeleton className="size-[48px] rounded-full" />
            <div className="flex-1 space-y-[8px]">
              <Skeleton className="h-[16px] w-1/2 rounded-[8px]" />
              <Skeleton className="h-[8px] w-1/3 rounded-[8px]" />
            </div>
          </div>
          <div className="mt-[48px] flex gap-[12px]">
            <Skeleton className="flex h-[48px] flex-1 rounded-[16px]" />
            <Skeleton className="size-[48px] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
