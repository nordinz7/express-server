import jwt from 'jsonwebtoken'
import { isProduction, jwtSecret } from '../config'
import { Response } from 'express'

export const genJWT = (user: any, res: Response) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      jwtSecret, // Replace with your actual secret key
      {
        expiresIn: '1d'
      }
    )

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })
  } catch (error) {
    res.json({ error })
  }
}
