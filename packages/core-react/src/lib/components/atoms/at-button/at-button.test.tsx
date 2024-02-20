import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AtButton } from './index'

describe('atButton', () => {
  it('should render', async () => {
    const label = 'test button'
    render(<AtButton label={label} />)
    expect(screen.getByText(label)).toBeDefined()
  })
})
