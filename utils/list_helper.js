const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs[0].likes
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes)
  const index = likes.indexOf(Math.max(...likes))

  return {
    title: blogs[index].title,
    author: blogs[index].author,
    likes: blogs[index].likes,
  }
}

const mostBlogs = (blogs) => {
  const name = blogs.map((blog) => blog.author)
  const countobj = _.countBy(name)
  const arr = Object.values(countobj)
  const index = arr.indexOf(Math.max(...arr))
  const author = Object.keys(countobj)[index]
  const arrIndex = name.indexOf(author)
  return {
    author: blogs[arrIndex].author,
    blogs: Math.max(...arr),
  }
}

const mostLikes = (blogs) => {
  const name = blogs.map((blog) => blog.author)
  const group = _.groupBy(blogs, 'author')
  const result = _.map(_.keys(group), function(e) {
    return _.reduce(
      group[e],
      function(r, o) {
        return (r.likes += +o.likes), r
      },
      { author: e, likes: 0 },
    )
  })
  const likes = result.map((result) => result.likes)
  const index = likes.indexOf(Math.max(...likes))
  const author = result[index].author
  const arrIndex = name.indexOf(author)

  return {
    author: blogs[arrIndex].author,
    likes: Math.max(...likes),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
