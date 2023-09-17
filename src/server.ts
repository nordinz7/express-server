import express from 'express'
import { isDevelopment, port } from './config'
import cookieParser from 'cookie-parser'

// routes
import userRoute from './routes/user'

const app = express()

app.use(cookieParser())
app.use(express.json())

// register routes
app.use('/user', userRoute)

app.get('/', (req, res) => {
  res.json({
    root: true
  })
})

app.listen(port, () => isDevelopment && console.log(`Server is running on port ${port}`)
)
