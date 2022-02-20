import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'

test('<CreateBlogFrom /> calls callback function with correct info', () => {
  const createBlog = jest.fn()

  const component = render(<CreateBlogForm createBlog={createBlog} />)

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'otsikko' },
  })
  fireEvent.change(author, {
    target: { value: 'tekijä' },
  })
  fireEvent.change(url, {
    target: { value: 'urli' },
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('otsikko')
  expect(createBlog.mock.calls[0][0].author).toBe('tekijä')
  expect(createBlog.mock.calls[0][0].url).toBe('urli')
})
