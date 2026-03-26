import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogUserId = typeof blog.user === 'object' ? (blog.user.id || blog.user._id) : blog.user
  const loggedInUserId = user?.id || user?._id
  const canRemove = blog.user && (
    (typeof blog.user === 'object' && blog.user.username === user?.username)
    || (blogUserId && loggedInUserId && blogUserId === loggedInUserId)
  )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => addLike(blog)}>like</button>
          </div>
          {canRemove && <button onClick={() => removeBlog(blog)}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog