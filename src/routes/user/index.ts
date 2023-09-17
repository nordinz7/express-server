import express, { Request, Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { DbSingleton } from '../../utils/singletons/db'
import { genJWT } from '../../utils/genJWT'

const router = express.Router()

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.json({ error: 'User already exists' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const mongoRes = await db.users.insertOne({ email, password: hashedPassword })
    genJWT({ _id: mongoRes.insertedId, email }, res)
    res.json({ success: `${email} successfully created` })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/log-out', async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.json({ error: 'User already exists' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const mongoRes = await db.users.insertOne({ email, password: hashedPassword })
    genJWT({ _id: mongoRes.insertedId, email }, res)
    res.json({ success: `${email} successfully created` })
  } catch (error) {
    res.json({ error })
  }
})

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.json({ error: 'User already exists' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const mongoRes = await db.users.insertOne({ email, password: hashedPassword })
    genJWT({ _id: mongoRes.insertedId, email }, res)
    res.json({ success: `${email} successfully created` })
  } catch (error) {
    res.json({ error })
  }
})

router.get('/profile', async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.json({ error: 'User already exists' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const mongoRes = await db.users.insertOne({ email, password: hashedPassword })
    genJWT({ _id: mongoRes.insertedId, email }, res)
    res.json({ success: `${email} successfully created` })
  } catch (error) {
    res.json({ error })
  }
})

router.put('/update-profile', async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.json({ error: 'User already exists' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const mongoRes = await db.users.insertOne({ email, password: hashedPassword })
    genJWT({ _id: mongoRes.insertedId, email }, res)
    res.json({ success: `${email} successfully created` })
  } catch (error) {
    res.json({ error })
  }
})

export default router
