const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentRouter = require('./controllers/comments')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => logger.info('MONGODB sucessfully connected'))
  .catch((error) => logger.error(error))

app.use(cors())
app.get('/api/version', async (request, response) => {
  response.json('version1')
} )
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', commentRouter)
if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testing')
  app.use('/api/testing', testRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
