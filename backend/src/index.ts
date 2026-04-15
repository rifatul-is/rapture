import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', message: 'Rapture AI backend is running', db: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})