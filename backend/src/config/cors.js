import cors from 'cors'

const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || ''
  const origins = envOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return origins.length > 0 ? origins : DEFAULT_ORIGINS
}

const corsOptions = () => ({
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins()

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

const corsMiddleware = cors(corsOptions())

export { corsMiddleware, getAllowedOrigins }
