import express, { Request, Response } from 'express'
import { z } from 'zod'
import { DbSingleton } from '../../utils/singletons/db'
import { genJWT } from '../../utils/genJWT'
import asyncHandler from 'express-async-handler'
import protect from '../../middleware/protect'
import bcrypt from 'bcryptjs'
import getHashedPwd from '../../utils/getHashedPwd'

const router = express.Router()

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const userRegisterSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})

router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = userLoginSchema.parse(req.query)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (!found) {
      res.json({ error: 'User not found' })
      return
    }

    const isMatch = await bcrypt.compare(password, found.password)

    if (!isMatch) {
      res.json({ error: 'Invalid credentials' })
      return
    }

    genJWT({ _id: found._id, email: found.email, name: found.name }, res)

    res.json({ success: 'Logged in' })
  } catch (error) {
    res.json({ error })
  }
}))

router.post('/log-out', asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.json({ success: 'Logged out' })
}))

router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password } = userRegisterSchema.parse(req.body)
    const db = await DbSingleton.getInstance()
    const found = await db.users.findOne({ email })

    if (found) {
      res.status(404).json({ error: `Email ${found.email} already registered with account name ${found.name}` })
      return
    }

    const hashedPassword = await getHashedPwd(password)

    const mongoRes = await db.users.insertOne({ name, email, password: hashedPassword })

    if (!mongoRes.insertedId) {
      res.status(500).json({ error: 'Failed to create account' })
      return
    }

    res.status(200).json({ success: `Successfully created new account for ${name} with ${email}` })
  } catch (error) {
    res.json({ error })
  }
}))

router.get('/profile', protect, asyncHandler(async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    res.json(req.user)
  } catch (error) {
    res.json({ error })
  }
}))

router.put('/update-profile', protect, asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const db = await DbSingleton.getInstance()
    const hashedPassword = await getHashedPwd(password)
    // @ts-ignore
    const found = await db.users.updateOne({ email: req.user.email }, {
      $set: {
        email: email || req.user.email,
        ...(hashedPassword && { password: hashedPassword }),
        name: name || req.user.name
      }
    })

    if (!found) {
      res.json({ error: 'Failed to update profile' })
      return
    }

    res.json({ success: `${email} successfully updated` })
  } catch (error) {
    res.json({ error })
  }
}))

export default router
