import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'testi1',
    author: 'testeri',
    url: 'qwerty'
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent('testi1')
  expect(component.container).toHaveTextContent('testeri')
  expect(component.container).not.toHaveTextContent('qwerty')
})

test('renders url and likes after pressing view', () => {
  const blog = {
    title: 'testi1',
    author: 'testeri',
    url: 'qwerty',
    user: { name:'xxxxx' }
  }
  //const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent('qwerty')
  expect(component.container).toHaveTextContent('likes')
})


test('pressing like twice causes the mock callback to be called twice', () => {
  const blog = {
    title: 'testi1',
    author: 'testeri',
    url: 'qwerty',
    user: { name:'xxxxx' }
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} likeBlog={mockHandler} />
  )

  const view = component.getByText('view')
  fireEvent.click(view)
  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})