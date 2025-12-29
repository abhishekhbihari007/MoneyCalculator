import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TermInsuranceCalculator from '../page'

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

describe('Term Insurance Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<TermInsuranceCalculator />)
    
    expect(screen.getByText(/Term Insurance Calculator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate Coverage/i)).toBeInTheDocument()
  })

  it('shows error when income is invalid', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Annual income must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('shows error when current age is invalid', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const ageInput = screen.getByLabelText(/Current Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(ageInput)
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid current age/i)).toBeInTheDocument()
    })
  })

  it('shows error when retirement age is less than current age', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '60')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '50')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Retirement age must be greater than current age/i)).toBeInTheDocument()
    })
  })

  it('calculates term insurance coverage', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Income Replacement/i)).toBeInTheDocument()
    expect(screen.getByText(/Years to Retirement/i)).toBeInTheDocument()
  })

  it('includes outstanding debts in coverage calculation', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const debtsInput = screen.getByLabelText(/Outstanding Debts/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    await user.clear(debtsInput)
    await user.type(debtsInput, '500000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Outstanding Debts/i)).toBeInTheDocument()
  })

  it('adjusts coverage based on existing assets', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const assetsInput = screen.getByLabelText(/Existing Assets/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    await user.clear(assetsInput)
    await user.type(assetsInput, '2000000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Existing Assets/i)).toBeInTheDocument()
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultText = screen.getByText(/Recommended Coverage/i).closest('div')?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })

  it('handles edge case with zero deductions', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
  })

  it('validates dependents count', async () => {
    const user = userEvent.setup()
    
    render(<TermInsuranceCalculator />)
    
    const incomeInput = screen.getByLabelText(/Annual Income/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const dependentsInput = screen.getByLabelText(/Number of Dependents/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '30')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    await user.clear(dependentsInput)
    await user.type(dependentsInput, '15')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Number of dependents must be between 0 and 10/i)).toBeInTheDocument()
    })
  })
})

