import { NextFunction, Request, Response } from 'express'
import { DbSingleton } from '../utils/singletons/db'
import AsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config'

export default AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, jwtSecret)
      const db = await DbSingleton.getInstance()
      // @ts-ignore
      const found = await db.users.findOne({ email: decoded.email })
      if (!found) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      // @ts-ignore
      req.user = decoded
      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized, invalid token' })
    }
  } else {
    res.status(401).json({ error: 'Unauthorized, no token' })
  }
})
