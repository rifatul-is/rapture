'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

// Reusable scroll-triggered fade+slide up
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Staggered children wrapper
function StaggerParent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {children}
    </motion.div>
  )
}

function StaggerChild({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Typing headline
function TypingText({ text, className = '' }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Animated AI feedback panel
function AIFeedbackPanel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [feedback, setFeedback] = useState('')
  const fullFeedback = '"Correct implementation. Middleware properly rejects expired tokens. Consider adding rate limiting before production."'

  useEffect(() => {
    if (!isInView) return
    let i = 0
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setFeedback(fullFeedback.slice(0, i + 1))
        i++
        if (i >= fullFeedback.length) clearInterval(interval)
      }, 18)
      return () => clearInterval(interval)
    }, 800)
    return () => clearTimeout(delay)
  }, [isInView])

  return (
    <div ref={ref} className="p-4 rounded-lg border border-dashed border-white/10" style={{ backgroundColor: '#0d0e0f' }}>
      <div className="mb-1 font-mono text-xs" style={{ color: 'rgba(149,142,160,0.5)' }}>// AI Feedback</div>
      <div className="italic font-mono text-xs" style={{ color: '#cbc3d7' }}>
        {feedback}
        {feedback.length < fullFeedback.length && isInView && <span className="animate-pulse">|</span>}
      </div>
    </div>
  )
}

export default function Home() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [state, setState] = useState<FormState>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setState('success')
      setForm({ firstName: '', lastName: '', email: '' })
    } else if (res.status === 409) {
      setState('duplicate')
    } else {
      setState('error')
    }
  }

  const isDisabled = state === 'loading' || state === 'success'

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#e3e2e3' }}>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 flex items-center justify-between px-8 h-16 border-b border-white/5 shadow-2xl shadow-black/40"
        style={{ backgroundColor: 'rgba(18,19,21,0.7)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex items-center gap-4">
          <div className="font-mono text-lg font-bold tracking-tighter text-violet-400">Rapture AI</div>
          <div className="hidden md:flex gap-6 ml-8">
            <a className="font-mono text-[0.6875rem] text-violet-400 uppercase tracking-widest" href="#methodology">Methodology</a>
            <a className="font-mono text-[0.6875rem] text-gray-400 hover:text-white transition-colors uppercase tracking-widest" href="#stakes">Stakes</a>
            <a className="font-mono text-[0.6875rem] text-gray-400 hover:text-white transition-colors uppercase tracking-widest" href="#waitlist">Early Access</a>
          </div>
        </div>
        <a href="#waitlist"
          className="px-4 py-1.5 border border-violet-500/30 rounded font-mono text-[10px] uppercase tracking-wider transition-all text-violet-300 hover:bg-violet-500/10">
          Join Waitlist
        </a>
      </motion.nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-32 text-center relative overflow-hidden">

        {/* Animated gradient orb */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full -z-10 pointer-events-none"
          style={{ background: 'rgba(208,188,255,0.07)', filter: 'blur(120px)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center px-3 py-1 rounded-full border border-white/10"
          style={{ backgroundColor: '#1b1c1d' }}
        >
          <span className="material-symbols-outlined text-xs text-violet-400 mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          <span className="font-mono text-[0.6875rem] text-violet-400 uppercase tracking-[0.2em]">Enforced Engineering Discipline</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-6xl md:text-8xl font-light text-center editorial-header mb-8 leading-[1.1]"
          style={{ color: '#e3e2e3' }}
        >
          <TypingText text="Your AI instructor." />
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{ color: '#a078ff' }}
          >
            No excuses.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="max-w-3xl mx-auto text-lg md:text-xl mb-12 font-light leading-relaxed"
          style={{ color: '#958ea0' }}
        >
          Eliminate the skills gap with structured AI-driven curriculums locked by real accountability.
          If you miss the task, your accountability contact finds out. No skipping. No excuses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#waitlist"
            className="px-8 py-4 font-medium rounded-lg hover:brightness-110 transition-all shadow-lg"
            style={{ background: 'linear-gradient(135deg, #d0bcff, #a078ff)', color: '#23005c' }}>
            Commit to Growth
          </a>
          <a href="#methodology"
            className="px-8 py-4 font-medium rounded-lg transition-all border border-white/10 hover:bg-white/5"
            style={{ color: '#e3e2e3' }}>
            The Methodology
          </a>
        </motion.div>
      </section>

      {/* The Problem */}
      <section id="methodology" className="max-w-5xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <h2 className="text-3xl font-light mb-6">The &quot;Judge and Defendant&quot; Problem</h2>
            <p className="leading-relaxed mb-6" style={{ color: '#958ea0' }}>
              Self-learning fails because you are both the student and the teacher. When things get hard,
              the teacher in you lets the student off the hook. You skip the hard problems, ignore the
              edge cases, and call &quot;good enough&quot; finished.
            </p>
            <div className="font-mono text-xs border-l-2 border-red-500/30 pl-4 py-2"
              style={{ color: 'rgba(255,180,171,0.8)', backgroundColor: 'rgba(255,180,171,0.05)' }}>
              // RESULT: Fragmented knowledge and zero production readiness.
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="rounded-2xl p-8 border border-white/5 shadow-inner" style={{ backgroundColor: '#1f2021' }}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-lg border border-white/5 opacity-50" style={{ backgroundColor: '#1b1c1d' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ffb4ab' }}>cancel</span>
                  <div className="text-sm font-mono">Without Rapture: I&apos;ll finish this tomorrow.</div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-violet-500/20" style={{ backgroundColor: 'rgba(208,188,255,0.07)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#d0bcff' }}>check_circle</span>
                  <div className="text-sm font-mono" style={{ color: '#d0bcff' }}>Rapture AI: Task locked. Accountability active.</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-8 py-32 border-y border-white/5" style={{ backgroundColor: '#0d0e0f' }}>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <FadeUp delay={0.1} className="w-full md:w-1/2 order-2 md:order-1">
            <div className="rounded-xl p-6 shadow-2xl border border-white/10" style={{ backgroundColor: '#1f2021' }}>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#958ea0' }}>Your Goal</div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="font-mono text-xs space-y-3 leading-relaxed" style={{ color: 'rgba(149,142,160,0.5)' }}>
                <p style={{ color: '#e3e2e3' }}>
                  Target role: <span style={{ color: '#a078ff' }}>Senior Node.js Engineer</span>.
                  Current: Python/Django. Target: Node + TypeScript + System Design.
                  Available: <span style={{ color: '#a078ff' }}>15 hrs/week</span>. Deadline: 8 weeks.
                </p>
                <div className="h-[1px] bg-white/5 w-full" />
                <div className="flex items-center gap-2" style={{ color: '#d0bcff' }}>
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>Generating locked 8-week curriculum...</span>
                </div>
                <div style={{ color: 'rgba(78,222,163,0.8)' }}>Week 1: Node.js fundamentals + Express APIs</div>
                <div style={{ color: 'rgba(78,222,163,0.8)' }}>Week 2: Prisma + PostgreSQL + Auth</div>
                <div style={{ color: 'rgba(149,142,160,0.5)' }}>Weeks 3–8: locked until you pass each week.</div>
              </div>
            </div>
          </FadeUp>
          <FadeUp className="w-full md:w-1/2 order-1 md:order-2">
            <div className="font-mono text-[0.6875rem] text-violet-400 mb-4 uppercase tracking-widest">Goal-Driven Curriculums</div>
            <h2 className="text-4xl font-light mb-6">Built around your target role</h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#958ea0' }}>
              Tell Rapture AI your target role, current skills, and deadline. It generates a locked
              week-by-week curriculum you cannot edit or skip. Every task is a step toward that specific role.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-xl" style={{ color: '#d0bcff' }}>target</span>
                <span className="text-sm">Zero generic content. Every task closes a gap in your profile.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-xl" style={{ color: '#d0bcff' }}>lock</span>
                <span className="text-sm">Once the curriculum starts, it cannot be edited or paused.</span>
              </li>
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Stakes */}
      <section id="stakes" className="max-w-7xl mx-auto px-8 py-32">
        <FadeUp className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4">How accountability works</h2>
          <p style={{ color: '#958ea0' }}>The secret to consistency isn&apos;t motivation. It&apos;s consequences.</p>
        </FadeUp>
        <StaggerParent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'lock', title: 'Hard Task Locks', desc: 'You cannot access the next task until you submit the current one and pass the AI rubric review. No skipping. No reordering.', tag: 'ENFORCED_PROGRESSION: ON' },
            { icon: 'mail', title: 'Deadline Emails', desc: 'Miss a deadline? Rapture AI automatically emails your accountability contact. You chose them. They will ask questions.', tag: 'AUTO_NOTIFY: ACTIVE' },
            { icon: 'psychology', title: 'Rubric Grading', desc: 'Every task has a locked rubric set at creation. The AI grades your submission strictly against it — not vibes, not effort.', tag: 'RUBRIC_LOCKED: TRUE' },
          ].map(({ icon, title, desc, tag }) => (
            <StaggerChild key={title}>
              <div className="rounded-2xl p-8 border border-white/5 hover:border-violet-500/30 transition-colors group glow-hover h-full"
                style={{ backgroundColor: '#1f2021' }}>
                <span className="material-symbols-outlined text-4xl mb-6 block group-hover:scale-110 transition-transform" style={{ color: '#d0bcff' }}>{icon}</span>
                <h3 className="text-xl font-medium mb-4">{title}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#958ea0' }}>{desc}</p>
                <div className="font-mono text-[10px] p-3 rounded" style={{ color: '#a078ff', backgroundColor: 'rgba(208,188,255,0.05)' }}>{tag}</div>
              </div>
            </StaggerChild>
          ))}
        </StaggerParent>
      </section>

      {/* Artifacts */}
      <section className="max-w-7xl mx-auto px-8 py-32 border-t border-white/5">
        <div className="grid md:grid-cols-12 gap-8">
          <FadeUp className="md:col-span-5">
            <div className="font-mono text-[0.6875rem] text-violet-400 mb-4 uppercase tracking-widest">Evidence of Progress</div>
            <h2 className="text-4xl font-light mb-6">Artifacts, Not Chat</h2>
            <p className="mb-8 leading-relaxed" style={{ color: '#958ea0' }}>
              You don&apos;t &quot;talk&quot; about what you&apos;ve learned. You submit real work — code, written explanations,
              or design decisions — and the AI grades them against a locked rubric.
            </p>
            <div className="space-y-6">
              {[
                { icon: 'code', title: 'Code Submissions', sub: 'Graded against functional and structural rubric.' },
                { icon: 'edit_note', title: 'Written Responses', sub: 'Graded for accuracy, depth, and clarity.' },
                { icon: 'architecture', title: 'Design Decisions', sub: 'Graded for trade-off awareness and correctness.' },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10" style={{ backgroundColor: '#1f2021' }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: '#d0bcff' }}>{icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-xs" style={{ color: '#958ea0' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="md:col-span-7">
            <div className="rounded-2xl border border-white/5 overflow-hidden relative min-h-[400px]" style={{ backgroundColor: '#1f2021' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
              <div className="p-8 font-mono text-xs">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <span style={{ color: '#4edea3' }}>✓ PASSED</span>
                    <span style={{ color: 'rgba(149,142,160,0.4)' }}>Build #841</span>
                  </div>
                  <div style={{ color: '#a078ff' }}>Rubric: WEEK_2_EXPRESS_API</div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: '// Auth Check', key: 'JWT validation', val: 'VALID' },
                    { label: '// Error Handling', key: '401 on bad token', val: 'VALID' },
                  ].map(({ label, key, val }) => (
                    <div key={key} className="p-4 rounded-lg border border-white/5" style={{ backgroundColor: '#0d0e0f' }}>
                      <div className="mb-1" style={{ color: 'rgba(149,142,160,0.5)' }}>{label}</div>
                      <div className="flex justify-between">
                        <span>{key}</span>
                        <span style={{ color: '#4edea3' }}>{val}</span>
                      </div>
                    </div>
                  ))}
                  <AIFeedbackPanel />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* State machine */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <FadeUp className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4 editorial-header">The Rapture State Machine</h2>
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#958ea0' }}>Deterministic growth flow</p>
        </FadeUp>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] timeline-line -translate-y-1/2 hidden md:block" />
          <StaggerParent className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
            {[
              { n: '01', label: 'INTAKE', sub: 'Goal Analysis' },
              { n: '02', label: 'LOCK', sub: 'Locked Path' },
              { n: '03', label: 'EXECUTE', sub: 'Code/Write' },
              { n: '04', label: 'SUBMIT', sub: 'Artifact' },
              { n: '05', label: 'REVIEW', sub: 'Rubric Audit' },
              { n: '06', label: 'ADVANCE', sub: 'Next Task' },
            ].map(({ n, label, sub }) => (
              <StaggerChild key={n}>
                <div className="border border-white/10 p-4 rounded-xl text-center glow-hover transition-all"
                  style={{ backgroundColor: '#0a0a0a' }}>
                  <div className="font-mono text-[10px] text-violet-400 mb-2">{n}. {label}</div>
                  <div className="text-xs font-medium">{sub}</div>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="border-t border-white/5 py-32 text-center" style={{ backgroundColor: '#0d0e0f' }}>
        <FadeUp>
          <h2 className="text-4xl md:text-5xl font-light mb-4 editorial-header">
            Stop planning. Start shipping.
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.3em] mb-12" style={{ color: '#958ea0' }}>
            Early access — limited spots
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto px-4">
            <div className="flex gap-3">
              <input
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                disabled={isDisabled}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-sm font-light placeholder-white/20 focus:outline-none focus:border-violet-500/50 disabled:opacity-50 transition-colors"
                style={{ backgroundColor: '#1f2021', color: '#e3e2e3' }}
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                disabled={isDisabled}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-sm font-light placeholder-white/20 focus:outline-none focus:border-violet-500/50 disabled:opacity-50 transition-colors"
                style={{ backgroundColor: '#1f2021', color: '#e3e2e3' }}
              />
            </div>
            <div className="flex gap-3">
              <input
                name="email"
                type="email"
                placeholder="engineer@domain.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isDisabled}
                className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-sm font-light placeholder-white/20 focus:outline-none focus:border-violet-500/50 disabled:opacity-50 transition-colors"
                style={{ backgroundColor: '#1f2021', color: '#e3e2e3' }}
              />
              <motion.button
                type="submit"
                disabled={isDisabled}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="px-6 py-3 font-medium rounded-lg transition-all disabled:opacity-50 whitespace-nowrap"
                style={{ backgroundColor: '#e3e2e3', color: '#0a0a0a' }}
              >
                {state === 'loading' ? 'Joining...' : state === 'success' ? "You're in ✓" : 'Apply Now'}
              </motion.button>
            </div>

            {state === 'success' && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm mt-1" style={{ color: '#4edea3' }}>
                You&apos;re on the list. We&apos;ll email you when we launch.
              </motion.p>
            )}
            {state === 'duplicate' && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm mt-1" style={{ color: '#c3d000' }}>
                You&apos;re already on the waitlist.
              </motion.p>
            )}
            {state === 'error' && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm mt-1" style={{ color: '#ffb4ab' }}>
                Something went wrong. Try again.
              </motion.p>
            )}
          </form>
        </FadeUp>

        <p className="text-[10px] font-mono uppercase tracking-widest mt-8" style={{ color: 'rgba(149,142,160,0.5)' }}>
          Built in public by{' '}
          <a href="https://linkedin.com/in/rifatul-islam-ramim" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition-colors underline">
            Rifatul Islam
          </a>
          {' '}· Dhaka, Bangladesh
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5" style={{ color: '#958ea0' }}>
        <div className="font-mono text-xs font-bold tracking-tighter text-violet-400 opacity-50">Rapture AI © 2026</div>
        <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest">
          <a className="hover:text-white transition-colors" href="#methodology">Methodology</a>
          <a className="hover:text-white transition-colors" href="#stakes">How It Works</a>
          <a className="hover:text-white transition-colors" href="#waitlist">Early Access</a>
        </div>
        <div className="font-mono text-[10px]" style={{ color: 'rgba(149,142,160,0.4)' }}>
          rapture.co.im — coming soon
        </div>
      </footer>

    </main>
  )
}
