'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

const EXAM_PREFIXES = [
  '/listening',
  '/reading',
  '/speaking',
  '/writing',
  '/gv',
  '/grammar',
  '/test',
  '/exam',
  '/practice'
]

const WATERMARKS = [
  { left: '4%', top: '8%', rotate: -8, delay: '0s', duration: '15s', opacity: 0.19 },
  { left: '22%', top: '13%', rotate: 3, delay: '-3s', duration: '17s', opacity: 0.17 },
  { left: '48%', top: '9%', rotate: -4, delay: '-5s', duration: '19s', opacity: 0.16 },
  { left: '72%', top: '15%', rotate: 6, delay: '-2s', duration: '16s', opacity: 0.18 },

  { left: '10%', top: '27%', rotate: 5, delay: '-4s', duration: '18s', opacity: 0.18 },
  { left: '34%', top: '31%', rotate: -6, delay: '-7s', duration: '20s', opacity: 0.17 },
  { left: '58%', top: '28%', rotate: 2, delay: '-9s', duration: '21s', opacity: 0.16 },
  { left: '80%', top: '34%', rotate: -7, delay: '-6s', duration: '18s', opacity: 0.18 },

  { left: '5%', top: '48%', rotate: -3, delay: '-8s', duration: '22s', opacity: 0.16 },
  { left: '25%', top: '53%', rotate: 7, delay: '-10s', duration: '17s', opacity: 0.19 },
  { left: '50%', top: '49%', rotate: -5, delay: '-11s', duration: '20s', opacity: 0.17 },
  { left: '74%', top: '55%', rotate: 4, delay: '-12s', duration: '19s', opacity: 0.18 },

  { left: '14%', top: '72%', rotate: 4, delay: '-13s', duration: '21s', opacity: 0.16 },
  { left: '38%', top: '78%', rotate: -7, delay: '-14s', duration: '18s', opacity: 0.18 },
  { left: '62%', top: '73%', rotate: 5, delay: '-15s', duration: '23s', opacity: 0.17 },
  { left: '84%', top: '80%', rotate: -4, delay: '-16s', duration: '20s', opacity: 0.19 },

  { left: '2%', top: '91%', rotate: -5, delay: '-17s', duration: '24s', opacity: 0.15 },
  { left: '29%', top: '92%', rotate: 3, delay: '-18s', duration: '18s', opacity: 0.16 },
  { left: '55%', top: '90%', rotate: -6, delay: '-19s', duration: '22s', opacity: 0.15 },
  { left: '78%', top: '93%', rotate: 5, delay: '-20s', duration: '19s', opacity: 0.16 }
]

export default function ExamWatermark({ children }) {
  const pathname = usePathname()
  const [student, setStudent] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const savedStudent = localStorage.getItem('aptis_student')
      setStudent(savedStudent ? JSON.parse(savedStudent) : null)
    } catch {
      setStudent(null)
    }

    setReady(true)
  }, [])

  const isExamPage = EXAM_PREFIXES.some(prefix => pathname?.startsWith(prefix))

  const isApprovedStudent =
    student?.role === 'student' &&
    student?.status === 'approved'

  const watermarkId = useMemo(() => {
    return `ID: ${student?.studentCode || 'N/A'}`
  }, [student])

  return (
    <>
      {children}

      {ready && isExamPage && isApprovedStudent && (
        <div style={styles.watermarkViewport} aria-hidden="true">
          {WATERMARKS.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.watermarkLine,
                left: item.left,
                top: item.top,
                opacity: item.opacity,
                animationDelay: item.delay,
                animationDuration: item.duration,
                '--wm-rotate': `${item.rotate}deg`
              }}
            >
              <span style={styles.watermarkText}>{watermarkId}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes aptisRandomWatermark {
          0% {
            transform: translate3d(-18px, -8px, 0) rotate(var(--wm-rotate));
          }
          50% {
            transform: translate3d(18px, 10px, 0) rotate(var(--wm-rotate));
          }
          100% {
            transform: translate3d(-18px, -8px, 0) rotate(var(--wm-rotate));
          }
        }
      `}</style>
    </>
  )
}

const styles = {
  watermarkViewport: {
    position: 'fixed',
    inset: 0,
    zIndex: 9997,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  watermarkLine: {
    position: 'absolute',
    minWidth: 150,
    height: 40,
    animationName: 'aptisRandomWatermark',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    transformOrigin: 'center'
  },
  watermarkText: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#7f1d1d',
    fontSize: 17,
    fontWeight: 900,
    letterSpacing: '0.4px',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    textShadow: '0 1px 0 rgba(255,255,255,.55)'
  }
}
