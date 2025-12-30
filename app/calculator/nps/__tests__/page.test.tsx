import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NPSCalculator from '../page'

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock Header and Footer components
jest.mock('@/components/layout/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})

jest.mock('@/components/layout/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

describe('NPS Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<NPSCalculator />)
    
    expect(screen.getByText(/NPS Wealth Builder/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Monthly Contribution/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate NPS Wealth/i)).toBeInTheDocument()
  })

  it('shows error when employee contribution is invalid', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Employee contribution must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('shows error when current age is invalid', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const ageInput = screen.getByLabelText(/Current Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(ageInput)
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid current age/i)).toBeInTheDocument()
    })
  })

  it('shows error when retirement age is less than current age', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '60')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '50')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Retirement age must be greater than current age/i)).toBeInTheDocument()
    })
  })

  it('calculates NPS projection', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '5000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/NPS Projection/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Total Corpus at Retirement/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Contributed/i)).toBeInTheDocument()
    expect(screen.getByText(/Estimated Returns/i)).toBeInTheDocument()
  })

  it('includes employer contribution in calculation', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const employerInput = screen.getByLabelText(/Employer Contribution/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '5000')
    await user.clear(employerInput)
    await user.type(employerInput, '5000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/NPS Projection/i)).toBeInTheDocument()
    })
  })

  it('validates total contribution limit', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const employerInput = screen.getByLabelText(/Employer Contribution/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '150000')
    await user.clear(employerInput)
    await user.type(employerInput, '100000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Total monthly contribution.*cannot exceed ₹2,00,000/i)).toBeInTheDocument()
    })
  })

  it('validates expected return range', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const returnInput = screen.getByLabelText(/Expected Annual Return/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(returnInput)
    await user.type(returnInput, '50')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Expected return must be between 0% and 30%/i)).toBeInTheDocument()
    })
  })

  it('displays tax benefits in results', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '5000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Annual Tax Benefit/i)).toBeInTheDocument()
      expect(screen.getByText(/Total Tax Benefit/i)).toBeInTheDocument()
    })
  })

  it('displays retirement options (50-50 and 40-60)', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '5000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Option 1: 50% Lump Sum/i)).toBeInTheDocument()
      expect(screen.getByText(/Option 2: 40% Lump Sum/i)).toBeInTheDocument()
      expect(screen.getByText(/Estimated Monthly Pension/i)).toBeInTheDocument()
    })
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<NPSCalculator />)
    
    const contributionInput = screen.getByLabelText(/Your Monthly Contribution/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate NPS Wealth/i })
    
    await user.clear(contributionInput)
    await user.type(contributionInput, '5000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultText = screen.getByText(/Total Corpus at Retirement/i).closest('div')?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })
})



