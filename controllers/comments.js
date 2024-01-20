const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const id = request.params.id



  const comment = new Comment({
    comment : body.comment,
  })

  const returnedComment = await comment.save()
  const blog = await Blog.findById(id)
  blog.comment = blog.comment.concat(returnedComment._id)
  await blog.save()
  const updatedBlog = await Blog.findById(id).populate('user', { username : 1, name : 1, id: 1 }).populate('comment', { comment : 1 })
  response.status(201).json(updatedBlog)
})

module.exports = commentRouter