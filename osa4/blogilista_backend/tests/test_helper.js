const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First test blog',
    author: 'Tester',
    url: 'https://example.com/first',
    likes: 5,
  },
  {
    title: 'Second test blog',
    author: 'Tester',
    url: 'https://example.com/second',
    likes: 3,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
}
