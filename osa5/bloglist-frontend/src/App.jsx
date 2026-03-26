import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setBlogs([])
      return
    }

    blogService
      .getAll()
      .then(blogs => {
        setBlogs(blogs)
      })
      .catch((exception) => {
        const errorMessage = exception.response?.data?.error

        if (errorMessage === 'jwt expired') {
          window.localStorage.removeItem('loggedBlogappUser')
          blogService.setToken(null)
          setUser(null)
          showNotification('Session expired, please log in again', 'error')
          return
        }

        showNotification('Failed to fetch blogs', 'error')
      })
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch{
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async ({ title, author, url }) => {
    try {
      const createdBlog = await blogService.create({ title, author, url })
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch (exception) {
      const errorMessage = exception.response?.data?.error || 'Failed to create blog'
      showNotification(errorMessage, 'error')
    }
  }

  const addLike = async (blogToLike) => {
    const blogId = blogToLike.id || blogToLike._id
    const userId = typeof blogToLike.user === 'object'
      ? (blogToLike.user.id || blogToLike.user._id)
      : blogToLike.user
    const fallbackUserId = user?.id || user?._id
    const userForUpdate = userId || fallbackUserId

    if (!userForUpdate) {
      showNotification('Failed to like blog: missing user id', 'error')
      return
    }

    const updatedBlog = {
      user: userForUpdate,
      likes: blogToLike.likes + 1,
      author: blogToLike.author,
      title: blogToLike.title,
      url: blogToLike.url
    }

    try {
      const updatedFromServer = await blogService.update(blogId, updatedBlog)
      const blogForState = {
        ...blogToLike,
        ...updatedFromServer,
        id: updatedFromServer.id || updatedFromServer._id || blogId,
        likes: updatedFromServer.likes ?? updatedBlog.likes,
        user: typeof updatedFromServer.user === 'object' ? updatedFromServer.user : blogToLike.user
      }

      setBlogs(currentBlogs =>
        currentBlogs.map(blog =>
          (blog.id || blog._id) === blogId ? blogForState : blog
        )
      )
    } catch (exception) {
      const errorMessage = exception.response?.data?.error || 'Failed to like blog'
      showNotification(errorMessage, 'error')
    }
  }

  const removeBlog = async (blogToRemove) => {
    const blogId = blogToRemove.id || blogToRemove._id
    const okToRemove = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)

    if (!okToRemove) {
      return
    }

    try {
      await blogService.remove(blogId)
      setBlogs(currentBlogs =>
        currentBlogs.filter(blog => (blog.id || blog._id) !== blogId)
      )
      showNotification(`Removed blog ${blogToRemove.title} by ${blogToRemove.author}`)
    } catch (exception) {
      const errorMessage = exception.response?.data?.error || 'Failed to remove blog'
      showNotification(errorMessage, 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id || blog._id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
            user={user}
          />
        )}
    </div>
  )
}

export default App