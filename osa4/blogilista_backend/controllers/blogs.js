const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

//Toimii GET toiminnolla nyt ilman tokenia, mutta vaatii tokenin POST, DELETE ja PUT pyynnöissä. 24-3-2026
////Muutettu, jotta saadaan haettua bllogit ilman tokenia
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})
//Toimii GET toiminnolla nyt ilman tokenia, mutta vaatii tokenin POST, DELETE ja PUT pyynnöissä. 24-3-2026
//Muutettu, jotta saadaan haettua bllogit ilman tokenia
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { returnDocument: 'after', runValidators: true, context: 'query' } //Korjattu, kun mongo herjas validointivirheestä, 
    // joka johtui siitä, että findByIdAndUpdate ei suoritettu validointia. 23-3-2026
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter