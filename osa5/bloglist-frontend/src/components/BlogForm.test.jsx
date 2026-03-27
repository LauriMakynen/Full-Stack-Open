import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('calls createBlog with correct details when a new blog is created', async () => {
    const createBlog = vi.fn().mockResolvedValue(undefined)

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: 'Testing React forms' } })
    fireEvent.change(inputs[1], { target: { value: 'Full Stack Open Student' } })
    fireEvent.change(inputs[2], { target: { value: 'https://fullstackopen.com' } })

    const createButton = screen.getByRole('button', { name: 'create' })
    await act(async () => {
      fireEvent.click(createButton)
    })

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React forms',
      author: 'Full Stack Open Student',
      url: 'https://fullstackopen.com'
    })
  })
})