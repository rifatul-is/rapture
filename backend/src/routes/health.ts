import { prisma } from '../lib/prisma'
import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', message: 'Rapture AI backend is running', db: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

export default router