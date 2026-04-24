import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './lib/prisma'
import waitlistRouter from './routes/waitlist'
import healthRouter from './routes/health'

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

app.use('/waitlist', waitlistRouter)

app.use('/health', healthRouter)

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})