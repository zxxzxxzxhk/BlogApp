const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username : 1, name : 1, id: 1 }).populate('comment', { comment : 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  const body = request.body
  const user = request.user


  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: 0,
      user : user.id
    }
  )

  const returnedBlog = await blog.save()
  user.blogs = user.blogs.concat(returnedBlog._id)
  await user.save()
  const updatedBlog = await Blog.findById(returnedBlog._id).populate('user', { username : 1, name : 1, id: 1 }).populate('comment', { comment : 1 })
  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user
  const userId = user.id
  const blog = await Blog.findById(id)

  if (blog.user.toString() === userId.toString()) {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  }
  else {
    response.status(404).json({ error : 'user is not match' })
  }
})

blogsRouter.put('/:id', async (request, response) => {

  const body = request.body
  const id = request.params.id

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  const returnedBlog = await Blog.findByIdAndUpdate(id, blog, { new:true } ).populate('user', { username : 1, name : 1, id: 1 }).populate('comment', { comment : 1 })
  // eslint-disable-next-line no-console
  console.log(returnedBlog)
  response.status(200).json(returnedBlog)
})




module.exports = blogsRouter