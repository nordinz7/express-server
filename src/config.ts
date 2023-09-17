require('dotenv').config()

const { env } = process
const port = parseInt(env.PORT || '') || 8000
const dbMongoConnectionString = env.DB_MONGO_CONNECTION_STRING || ''
const jwtSecret = env.JWT_SECRET || ''
const isProduction = env.NODE_ENV === 'production'
const isDevelopment = env.NODE_ENV === 'development'

export {
  env,
  port,
  dbMongoConnectionString,
  jwtSecret,
  isProduction,
  isDevelopment
}
