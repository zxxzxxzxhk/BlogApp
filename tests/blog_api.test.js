const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 11,
    __v: 0,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  for (let blog of initialBlogs) {
    let Oblogbject = new Blog(blog)
    await Oblogbject.save()
  }
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'root', passwordHash })
  await user.save()
})

test('all blogs are returned', async () => {
  await api.get('/api/blogs')
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
  })
})

test('if new blog is added', async () => {
  const newObj = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }
  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const userToken = user.body.token

  await api
    .post('/api/blogs')
    .send(newObj)
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length + 1)
})

test('if the likes property is missing, returning 0 ', async () => {
  const newObj = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  }

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const userToken = user.body.token

  const response = await api
    .post('/api/blogs')
    .send(newObj)
    .set({ Authorization: `Bearer ${userToken}` })
  expect(response.body.likes).toBe(0)
})

test('if the title or url properties are missing from the request data, return code 400', async () => {
  const newObj = {
    title: 'Canonical string reduction',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  }

  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const userToken = user.body.token

  await api
    .post('/api/blogs')
    .send(newObj)
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(400)
})

test('if blog can be deleted', async () => {
  const newObj = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }
  const user = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const userToken = user.body.token

  await api
    .post('/api/blogs')
    .send(newObj)
    .set({ Authorization: `Bearer ${userToken}` })

  const response = await api.get('/api/blogs')
  const id = response.body[2].id
  await api
    .delete(`/api/blogs/${id}`)
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(204)
})

test('if blog can be revised', async () => {
  const blogs = await api.get('/api/blogs')
  const id = blogs.body[0].id

  const blog = {
    title: 'React patterns',
    author: '123',
    url: 'https://reactpatterns.com/',
    likes: 8,
  }
  await api.put(`/api/blogs/${id}`).send(blog).expect(200)

  const response = await api.get('/api/blogs')
  expect(blog.likes).toBe(response.body[0].likes)
})

test('if a token is not provided return 401 for adding', async () => {
  const newObj = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  await api.post('/api/blogs').send(newObj).expect(401)
})

afterAll(async () => {
  await mongoose.connection.close()
})
