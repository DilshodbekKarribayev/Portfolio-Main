import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import HeroSection from './HeroSection'

vi.mock('../ui/DarkVeil', () => ({
  default: () => <div data-testid="dark-veil-mock" />,
}))

describe('HeroSection', () => {
  it('renders primary navigation actions', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /diliable/i })).toBeInTheDocument()
    expect(screen.getByText(/dilshodbek karribayev/i)).toBeInTheDocument()
    expect(screen.getByText(/web/i)).toBeInTheDocument()
    expect(screen.getByText(/innovation/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view work/i })).toHaveAttribute('href', '/work')
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '/#contact')
  })
})
