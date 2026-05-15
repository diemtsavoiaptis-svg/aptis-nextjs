import { Suspense } from 'react'
import StudentAccessGate from '@/components/StudentAccessGate'

export default function ListeningLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <StudentAccessGate>
        {children}
      </StudentAccessGate>
    </Suspense>
  )
}
