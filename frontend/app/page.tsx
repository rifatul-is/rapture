'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────
const V = '#a078ff'
const V_FAINT = 'rgba(160,120,255,0.08)'
const BG = '#0a0a0a'
const SURFACE = '#111111'
const SURFACE_R = '#161616'
const BORDER = '#1e1e1e'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

// ─── FadeUp ──────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} className={className} style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: delay * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─── Typing Hero ─────────────────────────────────────────────
const FULL_TEXT = "You've started 6 courses this year.\nYou finished 0.\nRapture AI makes quitting impossible."

function TypingHero() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const timeouts: ReturnType<typeof setTimeout>[] = []
    function type() {
      if (i <= FULL_TEXT.length) {
        setDisplayed(FULL_TEXT.slice(0, i))
        if (i === FULL_TEXT.length) setDone(true)
        i++
        const delay = FULL_TEXT[i] === '\n' ? 320 : Math.random() * 30 + 22
        timeouts.push(setTimeout(type, delay))
      }
    }
    const start = setTimeout(type, 500)
    return () => { clearTimeout(start); timeouts.forEach(clearTimeout) }
  }, [])

  const lines = displayed.split('\n')
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white">
      {lines.map((line, i) => (
        <span key={i} className="block">
          {i === 2
            ? line.split('Rapture AI').map((part, j) =>
                j === 0
                  ? <span key={j}>{part}</span>
                  : <span key={j}><span style={{ color: V }} className="violet-glow-text">Rapture AI</span>{part}</span>
              )
            : <span style={i === 1 ? { color: '#71717a' } : {}}>{line}</span>
          }
          {i === lines.length - 1 && !done && <span className="cursor-blink" />}
        </span>
      ))}
      {done && <span className="cursor-blink" />}
    </h1>
  )
}

// ─── Hero Mockup ─────────────────────────────────────────────
function HeroMockup() {
  const tasks = [
    { label: 'Week 1 — Setup & Architecture', done: true },
    { label: 'Week 2 — REST API Foundations', done: true },
    { label: 'Week 3 — Auth & JWT', done: false, active: true },
    { label: 'Week 4 — Database Design', done: false, locked: true },
    { label: 'Week 5 — Testing & CI', done: false, locked: true },
    { label: 'Week 6 — Performance', done: false, locked: true },
  ]
  return (
    <div className="gradient-border rounded-2xl violet-glow" style={{ background: SURFACE, padding: 1 }}>
      <div className="rounded-xl overflow-hidden" style={{ background: '#0d0d0d' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: BORDER }}>
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(239,68,68,0.6)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(234,179,8,0.6)' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(34,197,94,0.6)' }} />
          <span className="mono text-xs ml-3" style={{ color: '#52525b' }}>rapture.ai — curriculum</span>
        </div>
        <div className="px-5 py-4 border-b" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="mono text-xs mb-1" style={{ color: '#52525b' }}>ACTIVE TRACK</p>
              <h3 className="text-white font-bold text-sm">Full-Stack Engineer Path</h3>
            </div>
            <span className="mono text-xs px-2 py-1 rounded-md" style={{ background: V_FAINT, color: V, border: `1px solid rgba(160,120,255,0.2)` }}>8 weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#2a2a2a' }}>
              <div className="h-full rounded-full" style={{ width: '33%', background: `linear-gradient(to right, ${V}, #c4a4ff)` }} />
            </div>
            <span className="mono text-xs" style={{ color: '#52525b' }}>2/6 done</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${task.active ? '' : ''}`}
              style={task.active ? { background: V_FAINT, border: `1px solid rgba(160,120,255,0.2)` } : task.locked ? { opacity: 0.4 } : {}}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={task.done ? { background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }
                  : task.active ? { border: `1px solid rgba(160,120,255,0.6)` }
                  : { border: `1px solid ${BORDER}` }}>
                {task.done
                  ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : (task as any).locked
                  ? <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><rect x="1" y="4" width="6" height="5" rx="1" fill="#555" /><path d="M2.5 4V2.5a1.5 1.5 0 013 0V4" stroke="#555" strokeWidth="1.2" /></svg>
                  : <div className="w-1.5 h-1.5 rounded-full" style={{ background: V }} />}
              </div>
              <span className="text-xs font-medium" style={task.done ? { color: '#52525b', textDecoration: 'line-through' } : task.active ? { color: 'white' } : { color: '#52525b' }}>{task.label}</span>
              {(task as any).locked && <span className="ml-auto mono text-[10px] px-1.5 py-0.5 rounded" style={{ color: '#3f3f46', background: SURFACE_R }}>LOCKED</span>}
              {task.active && <span className="ml-auto mono text-[10px] px-1.5 py-0.5 rounded" style={{ color: V, background: V_FAINT, border: `1px solid rgba(160,120,255,0.2)` }}>DUE FRI</span>}
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 p-3 rounded-lg flex items-start gap-2.5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 flex-shrink-0"><path d="M7 1L13 12H1L7 1Z" stroke="#f87171" strokeWidth="1.2" strokeLinejoin="round" /><path d="M7 5V8" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="10.5" r="0.6" fill="#f87171" /></svg>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(248,113,113,0.9)' }}><span className="font-semibold">Deadline in 2 days.</span> Miss it and your contact gets notified.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────
function Navbar({ onWaitlist }: { onWaitlist: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? { background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` } : {}}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md flex items-center justify-center violet-glow-sm" style={{ background: V }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9" />
              <path d="M7 4L10 5.75V9.25L7 11L4 9.25V5.75L7 4Z" fill="#0a0a0a" fillOpacity="0.6" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight text-lg">Rapture<span style={{ color: V }}>AI</span></span>
          <div className="hidden md:flex items-center gap-8 ml-6">
            {[['#problem', 'Problem'], ['#how-it-works', 'How It Works'], ['#stakes', 'Stakes'], ['#who', "Who It's For"]].map(([href, label]) => (
              <a key={href} href={href} className="text-sm transition-colors" style={{ color: '#71717a' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>{label}</a>
            ))}
          </div>
        </div>
        <button onClick={onWaitlist} className="btn-primary text-white text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: V }}>
          Join Waitlist
        </button>
      </div>
    </motion.nav>
  )
}

// ─── Ticker ──────────────────────────────────────────────────
const TICKER_ITEMS = ['HARD TASK LOCKS', 'AI RUBRIC GRADING', 'ACCOUNTABILITY EMAILS', 'LOCKED CURRICULUM', 'SOCIAL RECOVERY', 'MISS A DEADLINE → THEY FIND OUT', 'NO SKIPPING', 'REAL STAKES', 'SEQUENTIAL TASKS ONLY', 'BUILT IN PUBLIC']

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="overflow-hidden border-y py-3" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span key={i} className="mono text-xs font-semibold tracking-widest px-8 whitespace-nowrap" style={{ color: V }}>
            {item} <span style={{ color: '#3f3f46', margin: '0 8px' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Problem Section ─────────────────────────────────────────
function ProblemSection() {
  const without = [
    { e: '📖', title: 'Open course. Watch 3 videos.', sub: "Close tab. Tell yourself you'll pick it up tomorrow." },
    { e: '⏭', title: 'Skip any module, any time.', sub: 'Jump to the fun parts. Miss the fundamentals. Build on sand.' },
    { e: '📊', title: 'Self-reported progress.', sub: '"I basically finished it." You\'ve watched 12% and paused for 6 weeks.' },
    { e: '🤷', title: 'Zero accountability.', sub: "Nobody knows you quit. So quitting costs nothing." },
  ]
  const withRapture = [
    { e: '🔒', title: 'Modules unlock only when earned.', sub: "Can't skip Week 3 until the AI grades your Week 2 project as passing." },
    { e: '📋', title: 'AI-graded tasks with rubrics.', sub: 'Every deliverable is scored against strict criteria. Partial credit denied.' },
    { e: '📧', title: 'Real accountability emails.', sub: 'Miss a deadline and your contact gets an email. No hiding.' },
    { e: '⏱', title: 'Hard deadlines, not suggestions.', sub: "Deadlines are enforced. The curriculum doesn't wait for you." },
  ]
  const chartBg = (vals: number[], color: string) => (
    <div className="flex items-end gap-1.5 h-16">
      {vals.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${v}%`, background: color.replace('{o}', String(0.15 + i * 0.05)) }} />
      ))}
    </div>
  )
  return (
    <section id="problem" className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest" style={{ color: V }}>THE PROBLEM</span></FadeUp>
        <FadeUp className="text-center mb-6"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">The Judge &amp; The Defendant</h2></FadeUp>
        <FadeUp className="text-center mb-16"><p className="text-lg max-w-xl mx-auto" style={{ color: '#71717a' }}>You know what you need to learn. You just never finish. Here's why — and how Rapture AI fixes it.</p></FadeUp>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Without */}
          <FadeUp delay={1} className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: BORDER }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h3 className="text-white font-bold">Without Rapture AI</h3>
              <span className="ml-auto mono text-xs px-2 py-1 rounded" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>THE DEFENDANT</span>
            </div>
            <div className="p-6 space-y-4">
              {without.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: SURFACE_R, border: `1px solid ${BORDER}` }}>{item.e}</div>
                  <div><p className="text-white text-sm font-semibold mb-0.5">{item.title}</p><p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{item.sub}</p></div>
                </div>
              ))}
            </div>
            <div className="mx-6 mb-6 p-4 rounded-xl" style={{ background: SURFACE_R, border: `1px solid ${BORDER}` }}>
              <p className="mono text-xs mb-3" style={{ color: '#52525b' }}>COMPLETION RATE — SELF-DIRECTED</p>
              {chartBg([100, 88, 71, 54, 38, 22, 14, 6], 'rgba(239,68,68,{o})')}
              <div className="flex justify-between mt-2">
                <span className="mono text-xs" style={{ color: '#3f3f46' }}>Day 1</span>
                <span className="mono text-xs" style={{ color: '#f87171' }}>Day 56 → 6% finish</span>
              </div>
            </div>
          </FadeUp>
          {/* With */}
          <FadeUp delay={2} className="rounded-2xl overflow-hidden violet-glow" style={{ background: SURFACE, border: `1px solid rgba(160,120,255,0.3)` }}>
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(160,120,255,0.2)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: V_FAINT, border: `1px solid rgba(160,120,255,0.3)` }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke={V} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="text-white font-bold">With Rapture AI</h3>
              <span className="ml-auto mono text-xs px-2 py-1 rounded" style={{ color: V, background: V_FAINT, border: `1px solid rgba(160,120,255,0.2)` }}>THE JUDGE</span>
            </div>
            <div className="p-6 space-y-4">
              {withRapture.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: V_FAINT, border: `1px solid rgba(160,120,255,0.2)` }}>{item.e}</div>
                  <div><p className="text-white text-sm font-semibold mb-0.5">{item.title}</p><p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{item.sub}</p></div>
                </div>
              ))}
            </div>
            <div className="mx-6 mb-6 p-4 rounded-xl" style={{ background: SURFACE_R, border: `1px solid rgba(160,120,255,0.15)` }}>
              <p className="mono text-xs mb-3" style={{ color: '#52525b' }}>COMPLETION RATE — RAPTURE AI</p>
              {chartBg([100, 98, 95, 91, 88, 85, 82, 79], `rgba(160,120,255,{o})`)}
              <div className="flex justify-between mt-2">
                <span className="mono text-xs" style={{ color: '#3f3f46' }}>Day 1</span>
                <span className="mono text-xs" style={{ color: V }}>Day 56 → 79% finish</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Stakes Section ───────────────────────────────────────────
function StakesSection() {
  return (
    <section id="stakes" className="py-28 border-t relative overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(160,120,255,0.05) 0%, transparent 70%)' }} />
      <div className="relative max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest" style={{ color: V }}>REAL ACCOUNTABILITY</span></FadeUp>
        <FadeUp className="text-center mb-6"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Consequences that actually hurt.</h2></FadeUp>
        <FadeUp className="text-center mb-16"><p className="text-lg max-w-2xl mx-auto" style={{ color: '#71717a' }}>Motivation fades. Loss aversion doesn't. Rapture AI makes missing a deadline genuinely costly — socially and financially. Details on exact amounts will be set at launch.</p></FadeUp>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: '💰', title: 'Put something on the line', desc: 'Before you start, you stake a real amount. Hit every deadline and keep it. Miss one and you lose part of it. The platform decides nothing — you set the amount.', tag: 'FINANCIAL_STAKE: SET_BY_YOU' },
            { icon: '📣', title: 'Social recovery', desc: "Miss a deadline and lose part of your stake? Post your failure publicly on LinkedIn or Twitter mentioning Rapture AI. We verify the post and give you back what you lost. Own it.", tag: 'RECOVERY: POST_PUBLICLY' },
            { icon: '🔄', title: 'Roll over or cash out', desc: "At the end of your cycle, whatever stake you've preserved is yours. Cash it back out or roll it into next month's commitment. Consistent users effectively pay nothing.", tag: 'ROLLOVER: YOUR_CHOICE' },
          ].map(({ icon, title, desc, tag }) => (
            <FadeUp key={title} delay={1}>
              <div className="feature-card gradient-border rounded-2xl p-6 h-full" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <div className="text-3xl mb-5">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#71717a' }}>{desc}</p>
                <div className="mono text-[10px] p-2.5 rounded" style={{ color: V, background: V_FAINT }}>{tag}</div>
              </div>
            </FadeUp>
          ))}
        </div>
        {/* Mockup */}
        <FadeUp delay={2}>
          <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: BORDER }}>
              <div className="w-2 h-2 rounded-full" style={{ background: V, boxShadow: `0 0 6px ${V}` }} />
              <span className="mono text-xs font-semibold tracking-wider" style={{ color: '#52525b' }}>HOW YOUR STAKE MOVES</span>
            </div>
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: BORDER }}>
              {[
                { label: 'You commit a stake', detail: 'Set before the curriculum locks. Your amount, your call.', icon: '💳', color: 'white' },
                { label: 'Miss deadline → lose part', detail: 'Each missed deadline reduces your returnable stake. Contact is also notified automatically.', icon: '📉', color: '#f87171' },
                { label: 'Post publicly → recover it', detail: 'Post your failure on social media. We verify it. You get the amount back. No hiding allowed.', icon: '📲', color: '#34d399' },
              ].map(({ label, detail, icon, color }) => (
                <div key={label} className="p-6 text-center">
                  <div className="text-4xl mb-4">{icon}</div>
                  <p className="font-bold mb-2" style={{ color }}>{label}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Walkthrough Mockups ──────────────────────────────────────
function CurriculumMockup() {
  const [locked, setLocked] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const canLock = confirmText === 'LOCK MY CURRICULUM'
  const tasks = [
    { week: 'Week 1', title: 'Git workflow & project setup', deadline: 'May 5' },
    { week: 'Week 2', title: 'REST API design in Node.js', deadline: 'May 12' },
    { week: 'Week 3', title: 'Auth, JWT & middleware', deadline: 'May 19' },
    { week: 'Week 4', title: 'PostgreSQL & Prisma ORM', deadline: 'May 26' },
  ]
  return (
    <div className="rounded-xl overflow-hidden text-sm" style={{ background: '#0d0d0d', border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
        <span className="mono text-xs" style={{ color: '#52525b' }}>Curriculum Builder</span>
        {locked
          ? <span className="mono text-xs px-2 py-0.5 rounded" style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>🔒 LOCKED</span>
          : <span className="mono text-xs px-2 py-0.5 rounded" style={{ color: '#34d399', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>✏ EDIT MODE</span>}
      </div>
      <div className="p-3 space-y-1.5">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: SURFACE_R, border: `1px solid ${BORDER}` }}>
            <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: V_FAINT, border: `1px solid rgba(160,120,255,0.3)` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: V }} />
            </div>
            <span className="mono text-[10px] w-12 flex-shrink-0" style={{ color: '#3f3f46' }}>{t.week}</span>
            <span className="flex-1 text-xs" style={{ color: locked ? '#52525b' : 'white' }}>{t.title}</span>
            <span className="mono text-[10px]" style={{ color: '#3f3f46' }}>{t.deadline}</span>
          </div>
        ))}
      </div>
      {!locked && !showConfirm && (
        <div className="px-3 pb-3">
          <button onClick={() => setShowConfirm(true)} className="w-full py-2.5 rounded-lg mono text-xs font-bold tracking-wider transition-colors"
            style={{ background: V_FAINT, border: `1px solid rgba(160,120,255,0.3)`, color: V }}>
            LOCK CURRICULUM →
          </button>
        </div>
      )}
      {showConfirm && !locked && (
        <div className="px-3 pb-3 space-y-2">
          <p className="mono text-[10px] px-1" style={{ color: '#52525b' }}>Type <span style={{ color: V }}>LOCK MY CURRICULUM</span> to confirm. This cannot be undone.</p>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="LOCK MY CURRICULUM"
            className="w-full px-3 py-2 rounded-lg text-xs mono placeholder-zinc-700 focus:outline-none"
            style={{ background: SURFACE_R, border: `1px solid ${BORDER}`, color: 'white' }} />
          <button onClick={() => canLock && setLocked(true)} disabled={!canLock}
            className="w-full py-2 rounded-lg text-xs font-bold mono tracking-wider transition-all"
            style={canLock ? { background: 'rgba(239,68,68,0.8)', color: 'white' } : { background: SURFACE_R, color: '#3f3f46', cursor: 'not-allowed' }}>
            {canLock ? '🔒 LOCK FOREVER' : 'TYPE TO UNLOCK BUTTON'}
          </button>
        </div>
      )}
      {locked && (
        <div className="mx-3 mb-3 p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.9)' }}>
          <strong>Curriculum locked.</strong> No edits permitted. Deadline enforcement is now active.
        </div>
      )}
    </div>
  )
}

function RubricMockup() {
  const criteria = [
    { label: 'JWT secret stored in env vars only', pts: 10, pass: true },
    { label: 'Refresh token rotation implemented', pts: 20, pass: true },
    { label: 'Rate limiting on /auth endpoints', pts: 15, pass: false },
    { label: 'Bcrypt rounds ≥ 12', pts: 10, pass: true },
    { label: 'Auth errors return 401, not 403', pts: 10, pass: false },
  ]
  return (
    <div className="rounded-xl overflow-hidden text-sm" style={{ background: '#0d0d0d', border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: BORDER }}>
        <span className="mono text-xs" style={{ color: '#52525b' }}>Week 3 — Auth Task Rubric</span>
        <span className="mono text-xs" style={{ color: '#f87171' }}>65/100 — FAIL</span>
      </div>
      <div className="p-4 space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: SURFACE_R }}>
            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={c.pass ? { background: 'rgba(34,197,94,0.2)' } : { background: 'rgba(239,68,68,0.2)' }}>
              {c.pass
                ? <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4L3 6L7 2" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" /></svg>
                : <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" /></svg>}
            </div>
            <span className="flex-1 text-xs" style={{ color: c.pass ? '#71717a' : '#f87171' }}>{c.label}</span>
            <span className="mono text-xs" style={{ color: '#3f3f46' }}>{c.pass ? `+${c.pts}` : `+0/${c.pts}`}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.9)' }}>
          <strong>Verdict: Fail.</strong> Resubmit with rate limiting and proper error codes. You have 24 hours.
        </div>
      </div>
    </div>
  )
}

function EmailMockup() {
  return (
    <div className="rounded-xl overflow-hidden text-sm" style={{ background: '#0d0d0d', border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: BORDER }}>
        <span className="mono text-xs" style={{ color: '#52525b' }}>Email Delivered — accountability contact</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="rounded-lg p-4" style={{ background: '#0f0f0f', border: `1px solid ${BORDER}` }}>
          <div className="border-b pb-3 mb-4 space-y-1.5" style={{ borderColor: BORDER }}>
            <div className="flex items-center gap-2 text-xs"><span className="w-10" style={{ color: '#3f3f46' }}>From</span><span style={{ color: '#71717a' }}>accountability@rapture.ai</span></div>
            <div className="flex items-center gap-2 text-xs"><span className="w-10" style={{ color: '#3f3f46' }}>To</span><span style={{ color: '#71717a' }}>sarah.chen@company.com</span></div>
            <div className="flex items-center gap-2 text-xs"><span className="w-10" style={{ color: '#3f3f46' }}>Sub</span><span className="font-semibold" style={{ color: '#f87171' }}>Alex missed their Week 3 deadline</span></div>
          </div>
          <div className="text-xs leading-6 space-y-3" style={{ color: '#71717a' }}>
            <p>Hi Sarah,</p>
            <p>You&apos;re receiving this because <span className="text-white font-semibold">Alex Johnson</span> designated you as their accountability contact on Rapture AI.</p>
            <p><span className="text-white font-semibold">Alex has missed the Week 3 — Auth &amp; JWT deadline</span> by <span className="font-semibold" style={{ color: '#f87171' }}>2 days</span>. The task has not been submitted.</p>
            <p className="text-xs" style={{ color: '#52525b' }}>No action is required from you. This is an automated notification.</p>
          </div>
        </div>
        <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(248,113,113,0.9)' }}>
          <strong>Stake penalty applied.</strong> Post publicly mentioning @RaptureAI to recover it within 72 hours.
        </div>
      </div>
    </div>
  )
}

// ─── Walkthrough Section ──────────────────────────────────────
const STEPS = [
  { n: '01', badge: 'CURRICULUM BUILDER', title: 'Build your curriculum — then lock it forever', sub: "Design every task, milestone, and deadline to fit your goals. Use a template or start blank. Once you hit Lock, it's immutable — no editing, no goal-shifting, no lowering the bar when it gets hard.", Mockup: CurriculumMockup },
  { n: '02', badge: 'AI GRADING', title: 'Every task has a locked rubric — pass or fail', sub: 'Each task comes with strict criteria defined at creation. The AI grades your submission against every point. No vague feedback. No partial credit for effort. Pass at 70+ or resubmit.', Mockup: RubricMockup },
  { n: '03', badge: 'ACCOUNTABILITY + PENALTY', title: 'Miss a deadline — contact notified, stake reduced', sub: 'Your contact gets an email the next morning. And you lose part of your stake. Miss too many and you\'ve forfeited everything. The only recovery: post your failure publicly on social media. Own it.', Mockup: EmailMockup },
]

function WalkthroughSection() {
  return (
    <section id="how-it-works" className="py-28 border-t" style={{ borderColor: BORDER, background: 'rgba(17,17,17,0.4)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest" style={{ color: V }}>HOW IT WORKS</span></FadeUp>
        <FadeUp className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Three steps. No escape.</h2></FadeUp>
        <div className="space-y-20">
          {STEPS.map(({ n, badge, title, sub, Mockup }, i) => (
            <FadeUp key={n} delay={1} className={`grid md:grid-cols-2 gap-10 items-center`}>
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="mono font-black leading-none select-none" style={{ fontSize: 56, color: BORDER }}>{n}</span>
                  <div>
                    <span className="mono text-xs font-semibold tracking-widest block mb-1" style={{ color: V }}>{badge}</span>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                  </div>
                </div>
                <p className="leading-relaxed text-base" style={{ color: '#71717a' }}>{sub}</p>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <Mockup />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Who Section ──────────────────────────────────────────────
function WhoSection() {
  const bullets = [
    { e: '🎯', bold: 'Junior devs job-hunting', rest: ' who need a portfolio project and a deadline to ship it.' },
    { e: '🔄', bold: 'Career-switchers', rest: ' who have started 5 courses and finished 0.' },
    { e: '💼', bold: 'Self-taught engineers', rest: ' who lack a structured path to fill gaps in their skillset.' },
    { e: '📈', bold: 'Mid-level engineers', rest: ' leveling up for senior roles who procrastinate on the hard stuff.' },
    { e: '⏰', bold: 'Busy developers', rest: ' who need external pressure to prioritize learning.' },
    { e: '🧠', bold: 'Anyone who knows what to learn', rest: ' but needs real consequences to actually do it.' },
  ]
  return (
    <section id="who" className="py-28 border-t" style={{ borderColor: BORDER, background: 'rgba(17,17,17,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <FadeUp><span className="mono text-xs font-semibold tracking-widest block mb-4" style={{ color: V }}>WHO THIS IS FOR</span></FadeUp>
            <FadeUp delay={1}><h2 className="text-4xl font-black text-white leading-tight mb-6">If excuses are costing you jobs, this is for you.</h2></FadeUp>
            <FadeUp delay={2}><p className="leading-relaxed" style={{ color: '#71717a' }}>Rapture AI isn&apos;t gentle. It&apos;s not a motivational platform. It&apos;s a forcing function for developers who understand the stakes but still can&apos;t get themselves to execute.</p></FadeUp>
          </div>
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <FadeUp key={i} delay={i + 1}>
                <div className="flex items-start gap-4 p-4 rounded-xl transition-colors" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(160,120,255,0.3)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER }}>
                  <span className="text-xl flex-shrink-0">{b.e}</span>
                  <p className="text-sm leading-relaxed"><span className="text-white font-semibold">{b.bold}</span><span style={{ color: '#71717a' }}>{b.rest}</span></p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Waitlist Section ─────────────────────────────────────────
function WaitlistSection() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [state, setState] = useState<FormState>('idle')
  const [count, setCount] = useState<number | null>(null)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/waitlist/count`)
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {})
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setState('success')
      setCount(c => (c ?? 0) + 1)
      setForm({ firstName: '', lastName: '', email: '' })
    } else if (res.status === 409) {
      setState('duplicate')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      setState('error')
    }
  }

  const isDisabled = state === 'loading' || state === 'success'

  return (
    <section id="waitlist" className="py-28 border-t relative overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(160,120,255,0.07) 0%, transparent 70%)' }} />
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <FadeUp><span className="mono text-xs font-semibold tracking-widest block mb-4" style={{ color: V }}>EARLY ACCESS</span></FadeUp>
        <FadeUp delay={1}><h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">Stop planning.<br />Start finishing.</h2></FadeUp>
        <FadeUp delay={2}>
          <p className="text-lg mb-4" style={{ color: '#71717a' }}>
            This is a small project built by one developer in public. We&apos;re onboarding a limited first group manually — every engineer gets set up personally.
          </p>
          {count !== null && (
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
              <span className="text-sm" style={{ color: '#71717a' }}><span className="text-white font-bold">{count}</span> engineers on the waitlist</span>
            </div>
          )}
        </FadeUp>

        {state === 'success' ? (
          <FadeUp className="rounded-2xl p-10" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12L9 18L21 6" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You&apos;re on the list.</h3>
            <p className="text-sm" style={{ color: '#71717a' }}>We&apos;ll reach out when your spot opens. Prepare to be held accountable.</p>
          </FadeUp>
        ) : (
          <FadeUp delay={3}>
            <div className={`rounded-2xl p-8 ${shake ? 'shake' : ''}`} style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              {state === 'duplicate' && (
                <div className="mb-5 p-3 rounded-lg text-sm" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
                  <strong>Already registered.</strong> This email is already on the waitlist.
                </div>
              )}
              {state === 'error' && (
                <div className="mb-5 p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  Something went wrong. Please try again.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[{ name: 'firstName', label: 'FIRST NAME', placeholder: 'Alex' }, { name: 'lastName', label: 'LAST NAME', placeholder: 'Johnson' }].map(f => (
                    <div key={f.name}>
                      <label className="mono text-xs block mb-2" style={{ color: '#52525b' }}>{f.label}</label>
                      <input name={f.name} type="text" required={f.name === 'firstName'} placeholder={f.placeholder}
                        value={form[f.name as keyof typeof form]} onChange={handleChange} disabled={isDisabled}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none transition-all duration-200 disabled:opacity-50"
                        style={{ background: SURFACE_R, border: `1px solid ${BORDER}` }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(160,120,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(160,120,255,0.1)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mono text-xs block mb-2" style={{ color: '#52525b' }}>EMAIL ADDRESS</label>
                  <input name="email" type="email" required placeholder="alex@company.com"
                    value={form.email} onChange={handleChange} disabled={isDisabled}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none transition-all duration-200 disabled:opacity-50"
                    style={{ background: SURFACE_R, border: `1px solid ${BORDER}` }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(160,120,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(160,120,255,0.1)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none' }} />
                </div>
                <motion.button type="submit" disabled={isDisabled} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 rounded-xl text-white font-bold text-base violet-glow disabled:opacity-60 flex items-center justify-center gap-3"
                  style={{ background: V }}>
                  {state === 'loading'
                    ? <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>Submitting...</>
                    : 'Request Early Access →'}
                </motion.button>
              </form>
              <p className="text-xs mt-5 text-center" style={{ color: '#3f3f46' }}>No spam. Unsubscribe anytime. Built in public by <a href="https://linkedin.com/in/rifatul-islam-ramim" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Rifatul Islam</a> · Dhaka, Bangladesh</p>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: BORDER }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: V }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9" /></svg>
          </div>
          <span className="font-bold text-white text-sm">Rapture<span style={{ color: V }}>AI</span></span>
        </div>
        <p className="mono text-xs" style={{ color: '#3f3f46' }}>© 2026 Rapture AI · rapture.co.im</p>
        <div className="flex gap-6 text-xs" style={{ color: '#3f3f46' }}>
          {[['#problem', 'Problem'], ['#how-it-works', 'How It Works'], ['#who', 'Who It\'s For'], ['#waitlist', 'Early Access']].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function Home() {
  function scrollToWaitlist() {
    const el = document.getElementById('waitlist')
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
  }

  return (
    <div style={{ background: BG }}>
      <Navbar onWaitlist={scrollToWaitlist} />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 noise-bg grid-overlay overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(160,120,255,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-6">
                <span className="mono text-xs font-semibold tracking-widest rounded-full px-3 py-1.5" style={{ color: V, border: `1px solid rgba(160,120,255,0.3)`, background: V_FAINT }}>
                  EARLY ACCESS — LIMITED SPOTS
                </span>
              </motion.div>
              <TypingHero />
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}
                className="mt-8 text-lg leading-relaxed" style={{ color: '#71717a' }}>
                Build your curriculum. Lock it. Put something real on the line. Miss a deadline and your accountability contact finds out — and you lose part of your stake. Hit every deadline and keep everything.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 2.1 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
                <button onClick={scrollToWaitlist} className="btn-primary text-white font-bold px-8 py-3.5 rounded-xl text-base violet-glow" style={{ background: V }}>
                  Get Early Access →
                </button>
                <a href="#how-it-works" className="flex items-center gap-2 py-3.5 text-base font-medium transition-colors" style={{ color: '#71717a' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                  <span>See how it works</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </motion.div>
            </div>
            {/* Right — mockup */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <HeroMockup />
            </motion.div>
          </div>
        </div>
      </section>

      <Ticker />
      <ProblemSection />
      <StakesSection />
      <WalkthroughSection />
      <WhoSection />
      <WaitlistSection />
      <Footer />
    </div>
  )
}
