'use client'

import { useState, useEffect, useRef } from 'react'
import Typewriter from 'typewriter-effect/dist/core'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

// ─── Typing Hero ─────────────────────────────────────────────
function TypingHero() {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const tw = new Typewriter(ref.current, { delay: 28, cursor: '|' })
    tw
      .pauseFor(500)
      // .typeString("You've started 6 courses this year.")
      // .typeString('<br><span style="color:#71717a">You finished 0.</span>')
      .typeString('<span style="color:#a078ff" class="violet-glow-text">Rapture AI</span> makes quitting impossible.')
      .start()
    return () => { tw.stop() }
  }, [])

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white">
      {/* Line 1: Static */}
      <p className="animate-fade-in block">You've started 6 courses this year. <span className=" text-zinc-500">You finished 0.</span></p>      
      
      {/* Line 2: The only part that animates */}
      <span ref={ref} className="block" />
    </h1>
  )
}

// ─── Hero Mockup ─────────────────────────────────────────────
function HeroMockup() {
  const tasks = [
    { label: 'Week 1 — Setup & Architecture', done: true },
    { label: 'Week 2 — REST API Foundations', done: true },
    { label: 'Week 3 — Auth & JWT', done: false, locked: false, active: true },
    { label: 'Week 4 — Database Design', done: false, locked: true },
    { label: 'Week 5 — Testing & CI', done: false, locked: true },
    { label: 'Week 6 — Performance', done: false, locked: true },
  ]
  return (
    <div className="gradient-border rounded-2xl violet-glow bg-surface p-px">
      <div className="rounded-xl overflow-hidden bg-[#0d0d0d]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="mono text-xs ml-3 text-zinc-600">rapture.ai — curriculum</span>
        </div>
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="mono text-xs mb-1 text-zinc-600">ACTIVE TRACK</p>
              <h3 className="text-white font-bold text-sm">Full-Stack Engineer Path</h3>
            </div>
            <span className="mono text-xs px-2 py-1 rounded-md bg-violet-faint text-violet border border-violet/20">8 weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-[#2a2a2a]">
              <div className="h-full rounded-full w-[33%] bg-linear-to-r from-violet to-[#c4a4ff]" />
            </div>
            <span className="mono text-xs text-zinc-600">2/6 done</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${task.active ? 'bg-violet-faint border border-violet/20' : task.locked ? 'opacity-40' : ''}`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${task.done ? 'bg-emerald-500/20 border border-emerald-500/40' : task.active ? 'border border-violet/60' : 'border border-border'}`}>
                {task.done
                  ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : task.locked
                  ? <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><rect x="1" y="4" width="6" height="5" rx="1" fill="#555" /><path d="M2.5 4V2.5a1.5 1.5 0 013 0V4" stroke="#555" strokeWidth="1.2" /></svg>
                  : <div className="w-1.5 h-1.5 rounded-full bg-violet" />}
              </div>
              <span className={`text-xs font-medium ${task.done ? 'text-zinc-600 line-through' : task.active ? 'text-white' : 'text-zinc-600'}`}>{task.label}</span>
              {task.locked && <span className="ml-auto mono text-[10px] text-zinc-700 bg-surface-raised px-1.5 py-0.5 rounded">LOCKED</span>}
              {task.active && <span className="ml-auto mono text-[10px] text-violet bg-violet-faint px-1.5 py-0.5 rounded border border-violet/20">DUE FRI</span>}
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 p-3 rounded-lg bg-red-500/8 border border-red-500/20 flex items-start gap-2.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mt-0.5 shrink-0"><path d="M7 1L13 12H1L7 1Z" stroke="#f87171" strokeWidth="1.2" strokeLinejoin="round" /><path d="M7 5V8" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="10.5" r="0.6" fill="#f87171" /></svg>
          <p className="text-xs leading-relaxed text-red-400/90"><span className="font-semibold">Deadline in 2 days.</span> Miss it and your contact gets notified.</p>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-page/90 backdrop-blur-md border-b border-border' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md flex items-center justify-center violet-glow-sm bg-violet">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9" />
              <path d="M7 4L10 5.75V9.25L7 11L4 9.25V5.75L7 4Z" fill="#0a0a0a" fillOpacity="0.6" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-tight text-lg">Rapture<span className="text-violet">AI</span></span>
          <div className="hidden md:flex items-center gap-8 ml-6">
            {[['#problem', 'Problem'], ['#how-it-works', 'How It Works'], ['#who', "Who It's For"]].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-zinc-500 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
        </div>
        <button onClick={onWaitlist} className="text-white text-sm font-semibold px-4 py-2 rounded-lg bg-violet">
          Join Waitlist
        </button>
      </div>
    </nav>
  )
}

// ─── Ticker ──────────────────────────────────────────────────
const TICKER_ITEMS = ['HARD TASK LOCKS', 'AI RUBRIC GRADING', 'ACCOUNTABILITY EMAILS', 'LOCKED CURRICULUM', 'SOCIAL RECOVERY', 'MISS A DEADLINE → THEY FIND OUT', 'NO SKIPPING', 'REAL STAKES', 'SEQUENTIAL TASKS ONLY', 'BUILT IN PUBLIC']

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="overflow-hidden border-y border-border py-3 bg-surface">
      <div className="ticker-inner">
        {items.map((item, i) => (
          <span key={i} className="mono text-xs font-semibold tracking-widest px-8 whitespace-nowrap text-violet">
            {item} <span className="text-zinc-700 mx-2">◆</span>
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
  const chartBg = (vals: number[], colorClass: string) => (
    <div className="flex items-end gap-1.5 h-16">
      {vals.map((v, i) => (
        <div key={i} className={`flex-1 rounded-sm ${colorClass}`} style={{ height: `${v}%`, opacity: 0.15 + i * 0.05 }} />
      ))}
    </div>
  )
  return (
    <section id="problem" className="py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest text-violet">THE PROBLEM</span></div>
        <div className="text-center mb-6"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">The Judge &amp; The Defendant</h2></div>
        <div className="text-center mb-16"><p className="text-lg max-w-xl mx-auto text-zinc-500">You know what you need to learn. You just never finish. Here's why — and how Rapture AI fixes it.</p></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden bg-surface border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h3 className="text-white font-bold">Without Rapture AI</h3>
              <span className="ml-auto mono text-xs px-2 py-1 rounded text-red-400 bg-red-500/8 border border-red-500/20">THE DEFENDANT</span>
            </div>
            <div className="p-6 space-y-4">
              {without.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 bg-surface-raised border border-border">{item.e}</div>
                  <div><p className="text-white text-sm font-semibold mb-0.5">{item.title}</p><p className="text-sm leading-relaxed text-zinc-600">{item.sub}</p></div>
                </div>
              ))}
            </div>
            <div className="mx-6 mb-6 p-4 rounded-xl bg-surface-raised border border-border">
              <p className="mono text-xs mb-3 text-zinc-600">COMPLETION RATE — SELF-DIRECTED</p>
              {chartBg([100, 88, 71, 54, 38, 22, 14, 6], 'bg-red-500')}
              <div className="flex justify-between mt-2">
                <span className="mono text-xs text-zinc-700">Day 1</span>
                <span className="mono text-xs text-red-400">Day 56 → 6% finish</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden violet-glow border border-violet/30 bg-surface">
            <div className="px-6 py-4 border-b border-violet/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-faint border border-violet/30">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="#a078ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 className="text-white font-bold">With Rapture AI</h3>
              <span className="ml-auto mono text-xs px-2 py-1 rounded text-violet bg-violet-faint border border-violet/20">THE JUDGE</span>
            </div>
            <div className="p-6 space-y-4">
              {withRapture.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 bg-violet-faint border border-violet/20">{item.e}</div>
                  <div><p className="text-white text-sm font-semibold mb-0.5">{item.title}</p><p className="text-sm leading-relaxed text-zinc-600">{item.sub}</p></div>
                </div>
              ))}
            </div>
            <div className="mx-6 mb-6 p-4 rounded-xl bg-surface-raised border border-violet/15">
              <p className="mono text-xs mb-3 text-zinc-600">COMPLETION RATE — RAPTURE AI</p>
              {chartBg([100, 98, 95, 91, 88, 85, 82, 79], 'bg-violet')}
              <div className="flex justify-between mt-2">
                <span className="mono text-xs text-zinc-700">Day 1</span>
                <span className="mono text-xs text-violet">Day 56 → 79% finish</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stakes Section ───────────────────────────────────────────
function StakesSection() {
  return (
    <section id="stakes" className="py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest text-violet">REAL ACCOUNTABILITY</span></div>
        <div className="text-center mb-6"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Consequences that actually hurt.</h2></div>
        <div className="text-center mb-16"><p className="text-lg max-w-2xl mx-auto text-zinc-500">Motivation fades. Loss aversion doesn't. Rapture AI makes missing a deadline genuinely costly — socially and financially.</p></div>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: '💰', title: 'Put something on the line', desc: 'Before you start, you stake a real amount. Hit every deadline and keep it. Miss one and you lose part of it. The platform decides nothing — you set the amount.', tag: 'FINANCIAL_STAKE: SET_BY_YOU' },
            { icon: '📣', title: 'Social recovery', desc: "Miss a deadline and lose part of your stake? Post your failure publicly on LinkedIn or Twitter mentioning Rapture AI. We verify the post and give you back what you lost. Own it.", tag: 'RECOVERY: POST_PUBLICLY' },
            { icon: '🔄', title: 'Roll over or cash out', desc: "At the end of your cycle, whatever stake you've preserved is yours. Cash it back out or roll it into next month's commitment. Consistent users effectively pay nothing.", tag: 'ROLLOVER: YOUR_CHOICE' },
          ].map(({ icon, title, desc, tag }) => (
            <div key={title} className="gradient-border rounded-2xl p-6 bg-surface border border-border">
              <div className="text-3xl mb-5">{icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-sm leading-relaxed mb-5 text-zinc-500">{desc}</p>
              <div className="mono text-[10px] p-2.5 rounded text-violet bg-violet-faint">{tag}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl overflow-hidden bg-surface border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-violet shadow-[0_0_6px_var(--color-violet)]" />
            <span className="mono text-xs font-semibold tracking-wider text-zinc-600">HOW YOUR STAKE MOVES</span>
          </div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {[
              { label: 'You commit a stake', detail: 'Set before the curriculum locks. Your amount, your call.', icon: '💳', color: 'text-white' },
              { label: 'Miss deadline → lose part', detail: 'Each missed deadline reduces your returnable stake. Contact is also notified automatically.', icon: '📉', color: 'text-red-400' },
              { label: 'Post publicly → recover it', detail: 'Post your failure on social media. We verify it. You get the amount back. No hiding allowed.', icon: '📲', color: 'text-emerald-400' },
            ].map(({ label, detail, icon, color }) => (
              <div key={label} className="p-6 text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <p className={`font-bold mb-2 ${color}`}>{label}</p>
                <p className="text-sm leading-relaxed text-zinc-600">{detail}</p>
              </div>
            ))}
          </div>
        </div>
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
    <div className="rounded-xl overflow-hidden text-sm bg-[#0d0d0d] border border-border">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="mono text-xs text-zinc-600">Curriculum Builder</span>
        {locked
          ? <span className="mono text-xs px-2 py-0.5 rounded text-red-400 bg-red-500/8 border border-red-500/20">🔒 LOCKED</span>
          : <span className="mono text-xs px-2 py-0.5 rounded text-emerald-400 bg-emerald-500/8 border border-emerald-500/20">✏ EDIT MODE</span>}
      </div>
      <div className="p-3 space-y-1.5">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-raised border border-border">
            <div className="w-4 h-4 rounded shrink-0 flex items-center justify-center bg-violet-faint border border-violet/30">
              <div className="w-1.5 h-1.5 rounded-full bg-violet" />
            </div>
            <span className="mono text-[10px] w-12 shrink-0 text-zinc-700">{t.week}</span>
            <span className={`flex-1 text-xs ${locked ? 'text-zinc-600' : 'text-white'}`}>{t.title}</span>
            <span className="mono text-[10px] text-zinc-700">{t.deadline}</span>
          </div>
        ))}
      </div>
      {!locked && !showConfirm && (
        <div className="px-3 pb-3">
          <button onClick={() => setShowConfirm(true)} className="w-full py-2.5 rounded-lg mono text-xs font-bold tracking-wider text-violet bg-violet-faint border border-violet/30">
            LOCK CURRICULUM →
          </button>
        </div>
      )}
      {showConfirm && !locked && (
        <div className="px-3 pb-3 space-y-2">
          <p className="mono text-[10px] px-1 text-zinc-600">Type <span className="text-violet">LOCK MY CURRICULUM</span> to confirm. This cannot be undone.</p>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="LOCK MY CURRICULUM"
            className="w-full px-3 py-2 rounded-lg text-xs mono placeholder-zinc-700 focus:outline-none text-white bg-surface-raised border border-border" />
          <button onClick={() => canLock && setLocked(true)} disabled={!canLock}
            className={`w-full py-2 rounded-lg text-xs font-bold mono tracking-wider ${canLock ? 'bg-red-500/80 text-white' : 'bg-surface-raised text-zinc-700 cursor-not-allowed'}`}>
            {canLock ? '🔒 LOCK FOREVER' : 'TYPE TO UNLOCK BUTTON'}
          </button>
        </div>
      )}
      {locked && (
        <div className="mx-3 mb-3 p-3 rounded-lg text-xs leading-relaxed bg-red-500/6 border border-red-500/15 text-red-400/90">
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
    <div className="rounded-xl overflow-hidden text-sm bg-[#0d0d0d] border border-border">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <span className="mono text-xs text-zinc-600">Week 3 — Auth Task Rubric</span>
        <span className="mono text-xs text-red-400">65/100 — FAIL</span>
      </div>
      <div className="p-4 space-y-2">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-raised">
            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${c.pass ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {c.pass
                ? <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4L3 6L7 2" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" /></svg>
                : <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" /></svg>}
            </div>
            <span className={`flex-1 text-xs ${c.pass ? 'text-zinc-500' : 'text-red-400'}`}>{c.label}</span>
            <span className="mono text-xs text-zinc-700">{c.pass ? `+${c.pts}` : `+0/${c.pts}`}</span>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="p-3 rounded-lg text-xs leading-relaxed bg-red-500/6 border border-red-500/15 text-red-400/90">
          <strong>Verdict: Fail.</strong> Resubmit with rate limiting and proper error codes. You have 24 hours.
        </div>
      </div>
    </div>
  )
}

function EmailMockup() {
  return (
    <div className="rounded-xl overflow-hidden text-sm bg-[#0d0d0d] border border-border">
      <div className="px-4 py-3 border-b border-border">
        <span className="mono text-xs text-zinc-600">Email Delivered — accountability contact</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="rounded-lg p-4 bg-[#0f0f0f] border border-border">
          <div className="border-b border-border pb-3 mb-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs"><span className="w-10 text-zinc-700">From</span><span className="text-zinc-500">accountability@rapture.ai</span></div>
            <div className="flex items-center gap-2 text-xs"><span className="w-10 text-zinc-700">To</span><span className="text-zinc-500">sarah.chen@company.com</span></div>
            <div className="flex items-center gap-2 text-xs"><span className="w-10 text-zinc-700">Sub</span><span className="font-semibold text-red-400">Alex missed their Week 3 deadline</span></div>
          </div>
          <div className="text-xs leading-6 space-y-3 text-zinc-500">
            <p>Hi Sarah,</p>
            <p>You&apos;re receiving this because <span className="text-white font-semibold">Alex Johnson</span> designated you as their accountability contact on Rapture AI.</p>
            <p><span className="text-white font-semibold">Alex has missed the Week 3 — Auth &amp; JWT deadline</span> by <span className="font-semibold text-red-400">2 days</span>. The task has not been submitted.</p>
            <p className="text-zinc-600">No action is required from you. This is an automated notification.</p>
          </div>
        </div>
        <div className="p-3 rounded-lg text-xs bg-red-500/6 border border-red-500/15 text-red-400/90">
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
  { n: '03', badge: 'ACCOUNTABILITY + PENALTY', title: 'Miss a deadline — contact notified, stake reduced', sub: "Your contact gets an email the next morning. And you lose part of your stake. Miss too many and you've forfeited everything. The only recovery: post your failure publicly on social media. Own it.", Mockup: EmailMockup },
]

function WalkthroughSection() {
  return (
    <section id="how-it-works" className="py-28 border-t border-border bg-surface/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-4"><span className="mono text-xs font-semibold tracking-widest text-violet">HOW IT WORKS</span></div>
        <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Three steps. No escape.</h2></div>
        <div className="space-y-20">
          {STEPS.map(({ n, badge, title, sub, Mockup }, i) => (
            <div key={n} className="grid md:grid-cols-2 gap-10 items-center">
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="mono font-black leading-none select-none text-[56px] text-border">{n}</span>
                  <div>
                    <span className="mono text-xs font-semibold tracking-widest block mb-1 text-violet">{badge}</span>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                  </div>
                </div>
                <p className="leading-relaxed text-base text-zinc-500">{sub}</p>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <Mockup />
              </div>
            </div>
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
    <section id="who" className="py-28 border-t border-border bg-surface/40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="mono text-xs font-semibold tracking-widest block mb-4 text-violet">WHO THIS IS FOR</span>
            <h2 className="text-4xl font-black text-white leading-tight mb-6">If excuses are costing you jobs, this is for you.</h2>
            <p className="leading-relaxed text-zinc-500">Rapture AI isn&apos;t gentle. It&apos;s not a motivational platform. It&apos;s a forcing function for developers who understand the stakes but still can&apos;t get themselves to execute.</p>
          </div>
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border hover:border-violet/30 transition-colors">
                <span className="text-xl shrink-0">{b.e}</span>
                <p className="text-sm leading-relaxed"><span className="text-white font-semibold">{b.bold}</span><span className="text-zinc-500">{b.rest}</span></p>
              </div>
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
    <section id="waitlist" className="py-28 border-t border-border">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="mono text-xs font-semibold tracking-widest block mb-4 text-violet">EARLY ACCESS</span>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">Stop planning.<br />Start finishing.</h2>
        <p className="text-lg mb-4 text-zinc-500">
          This is a small project built by one developer in public. We&apos;re onboarding a limited first group manually — every engineer gets set up personally.
        </p>
        {count !== null && (
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-surface border border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="text-sm text-zinc-500"><span className="text-white font-bold">{count}</span> engineers on the waitlist</span>
          </div>
        )}

        {state === 'success' ? (
          <div className="rounded-2xl p-10 bg-emerald-500/6 border border-emerald-500/30">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-emerald-500/15 border border-emerald-500/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12L9 18L21 6" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You&apos;re on the list.</h3>
            <p className="text-sm text-zinc-500">We&apos;ll reach out when your spot opens. Prepare to be held accountable.</p>
          </div>
        ) : (
          <div className={`rounded-2xl p-8 bg-surface border border-border ${shake ? 'shake' : ''}`}>
            {state === 'duplicate' && (
              <div className="mb-5 p-3 rounded-lg text-sm bg-amber-400/8 border border-amber-400/25 text-amber-400">
                <strong>Already registered.</strong> This email is already on the waitlist.
              </div>
            )}
            {state === 'error' && (
              <div className="mb-5 p-3 rounded-lg text-sm bg-red-500/8 border border-red-500/25 text-red-400">
                Something went wrong. Please try again.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid sm:grid-cols-2 gap-4">
                {[{ name: 'firstName', label: 'FIRST NAME', placeholder: 'Alex' }, { name: 'lastName', label: 'LAST NAME', placeholder: 'Johnson' }].map(f => (
                  <div key={f.name}>
                    <label className="mono text-xs block mb-2 text-zinc-600">{f.label}</label>
                    <input name={f.name} type="text" required={f.name === 'firstName'} placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form]} onChange={handleChange} disabled={isDisabled}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 bg-surface-raised border border-border focus:outline-none focus:border-violet/60 focus:ring-[3px] focus:ring-violet/10 disabled:opacity-50" />
                  </div>
                ))}
              </div>
              <div>
                <label className="mono text-xs block mb-2 text-zinc-600">EMAIL ADDRESS</label>
                <input name="email" type="email" required placeholder="alex@company.com"
                  value={form.email} onChange={handleChange} disabled={isDisabled}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-zinc-600 bg-surface-raised border border-border focus:outline-none focus:border-violet/60 focus:ring-[3px] focus:ring-violet/10 disabled:opacity-50" />
              </div>
              <button type="submit" disabled={isDisabled}
                className="w-full py-4 rounded-xl text-white font-bold text-base bg-violet violet-glow disabled:opacity-60 flex items-center justify-center gap-3">
                {state === 'loading'
                  ? <><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>Submitting...</>
                  : 'Request Early Access →'}
              </button>
            </form>
            <p className="text-xs mt-5 text-center text-zinc-700">No spam. Unsubscribe anytime. Built in public by <a href="https://linkedin.com/in/rifatul-islam-ramim" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Rifatul Islam</a> · Dhaka, Bangladesh</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-violet">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="white" fillOpacity="0.9" /></svg>
          </div>
          <span className="font-bold text-white text-sm">Rapture<span className="text-violet">AI</span></span>
        </div>
        <p className="mono text-xs text-zinc-700">© 2026 Rapture AI · rapture.co.im</p>
        <div className="flex gap-6 text-xs text-zinc-700">
          {[['#problem', 'Problem'], ['#how-it-works', 'How It Works'], ['#who', "Who It's For"], ['#waitlist', 'Early Access']].map(([href, label]) => (
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
    <div className="bg-page">
      <Navbar onWaitlist={scrollToWaitlist} />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 noise-bg grid-overlay overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-[160px] w-full">
          <div className="max-w-3xl">
              <div className="visible mb-6">
                <span className="mono text-xs font-semibold tracking-widest rounded-full px-3 py-1.5 text-violet border border-violet/30 bg-violet-faint">
                  EARLY ACCESS — LIMITED SPOTS
                </span>
              </div>
              <TypingHero />
              <p className="mt-8 text-lg leading-relaxed max-w-xl text-zinc-500">
                Build your curriculum. Lock it. Put something real on the line. Miss a deadline and your accountability contact finds out — and you lose part of your stake. Hit every deadline and keep everything.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
                <button onClick={scrollToWaitlist} className="text-white font-bold px-8 py-3.5 rounded-xl text-base bg-violet violet-glow">
                  Get Early Access →
                </button>
                <a href="#how-it-works" className="flex items-center gap-2 py-3.5 text-base font-medium text-zinc-500 hover:text-white transition-colors">
                  <span>See how it works</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            <div className="mockup-rise mt-16 lg:mt-[320px] lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:w-[420px]">
              <HeroMockup />
            </div>
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
