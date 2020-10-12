import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders a by Jason Baddley link', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/by Jason Baddley/i)
  expect(linkElement).toBeInTheDocument()
})
