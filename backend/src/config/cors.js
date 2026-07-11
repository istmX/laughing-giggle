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

    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.github.dev') || origin.endsWith('.app.github.dev')) {
      callback(null, true)
      return
    }

    // For development, allow all origins
    callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

const corsMiddleware = cors(corsOptions())

export { corsMiddleware, getAllowedOrigins }
