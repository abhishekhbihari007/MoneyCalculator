import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EPFCalculator from '../page'

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

describe('EPF Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<EPFCalculator />)
    
    expect(screen.getByText(/EPF Accumulator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Annual Basic Salary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Age/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate EPF/i)).toBeInTheDocument()
  })

  it('shows error when basic salary is invalid', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Basic salary must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('shows error when current age is invalid', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const ageInput = screen.getByLabelText(/Current Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(ageInput)
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid current age/i)).toBeInTheDocument()
    })
  })

  it('shows error when retirement age is less than current age', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '60')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '50')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Retirement age must be greater than current age/i)).toBeInTheDocument()
    })
  })

  it('calculates EPF projection', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '25')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/EPF Projection/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Final EPF Balance/i)).toBeInTheDocument()
    expect(screen.getByText(/Employee PF/i)).toBeInTheDocument()
    expect(screen.getByText(/Employer PF/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Contribution/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Interest Earned/i)).toBeInTheDocument()
  })

  it('includes current balance in calculation', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const balanceInput = screen.getByLabelText(/Current EPF Balance/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '25')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    await user.clear(balanceInput)
    await user.type(balanceInput, '500000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/EPF Projection/i)).toBeInTheDocument()
    })
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '25')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultText = screen.getByText(/Final EPF Balance/i).closest('div')?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })

  it('displays yearly breakdown', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '25')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Yearly Growth/i)).toBeInTheDocument()
    })
  })

  it('validates current balance cannot be negative', async () => {
    const user = userEvent.setup()
    
    render(<EPFCalculator />)
    
    const salaryInput = screen.getByLabelText(/Annual Basic Salary/i)
    const currentAgeInput = screen.getByLabelText(/Current Age/i)
    const retirementAgeInput = screen.getByLabelText(/Retirement Age/i)
    const balanceInput = screen.getByLabelText(/Current EPF Balance/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate EPF/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '600000')
    await user.clear(currentAgeInput)
    await user.type(currentAgeInput, '25')
    await user.clear(retirementAgeInput)
    await user.type(retirementAgeInput, '60')
    await user.clear(balanceInput)
    await user.type(balanceInput, '-1000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Current EPF balance cannot be negative/i)).toBeInTheDocument()
    })
  })
})

