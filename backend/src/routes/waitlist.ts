import { Router, Request, Response } from 'express'
import { Resend } from 'resend'
import { prisma } from '../lib/prisma'
import rateLimit from 'express-rate-limit'

const router = Router()
const resend = new Resend(process.env.RESEND_API_KEY)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/', limiter, async (req: Request, res: Response) => {
  const { email, firstName, lastName } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  try {
    await prisma.waitlistEntry.create({ data: { email, firstName, lastName } })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Already on the waitlist' })
    }
    return res.status(500).json({ error: 'Something went wrong' })
  }

  try {
    await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
    })
  } catch {
    console.error('Resend sync failed for:', email)
  }

  try {
    const { data, error } = await resend.contacts.segments.add({
      email: email,
      segmentId: process.env.RESEND_SEGMENT_ID!,
    });
    if (error) {
      console.error('Failed to add contact to segment:', error);
    } else {
      console.log('Contact added to segment:', data);
    }
  } catch (err) {
    console.error('Failed to add contact to segment:', err)
  }

  return res.status(201).json({ success: true })
})

export default router