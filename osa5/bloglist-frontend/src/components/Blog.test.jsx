import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'https://testblog.example.com',
  likes: 7,
  user: {
    id: 'u1',
    username: 'testuser',
    name: 'Test User'
  }
}

const user = {
  id: 'u1',
  username: 'testuser',
  name: 'Test User'
}

describe('Blog component', () => {
  test('renders title and author by default', () => {
    render(
      <Blog
        blog={blog}
        addLike={vi.fn()}
        removeBlog={vi.fn()}
        user={user}
      />
    )

    expect(screen.getByText(/Test Blog Title/)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/)).toBeInTheDocument()
  })

  test('does not render url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        addLike={vi.fn()}
        removeBlog={vi.fn()}
        user={user}
      />
    )

    expect(screen.queryByText(/https:\/\/testblog\.example\.com/)).not.toBeInTheDocument()
    expect(screen.queryByText(/likes 7/)).not.toBeInTheDocument()
  })

  test('renders url, likes and user when view button is clicked', () => {
    render(
      <Blog
        blog={blog}
        addLike={vi.fn()}
        removeBlog={vi.fn()}
        user={user}
      />
    )

    const viewButton = screen.getByRole('button', { name: 'view' })
    fireEvent.click(viewButton)

    expect(screen.getByText('https://testblog.example.com')).toBeInTheDocument()
    expect(screen.getByText('likes 7')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  test('calls like event handler twice when like button is clicked twice', () => {
    const addLike = vi.fn()

    render(
      <Blog
        blog={blog}
        addLike={addLike}
        removeBlog={vi.fn()}
        user={user}
      />
    )

    const viewButton = screen.getByRole('button', { name: 'view' })
    fireEvent.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'like' })
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(addLike).toHaveBeenCalledTimes(2)
  })
})
