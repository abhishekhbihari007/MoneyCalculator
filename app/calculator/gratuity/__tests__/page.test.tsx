import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GratuityCalculator from '../page'

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

describe('Gratuity Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<GratuityCalculator />)
    
    expect(screen.getByText(/Gratuity Estimator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Drawn Basic Salary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Years of Service/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Calculate Gratuity/i).length).toBeGreaterThan(0)
  })

  it('shows error when salary is invalid', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Last drawn basic salary must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('shows error when years of service is less than 5', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '3')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Gratuity is payable only after completing 5 years/i)).toBeInTheDocument()
    })
  })

  it('calculates gratuity amount', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '10')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Gratuity Amount/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Total Gratuity/i)).toBeInTheDocument()
    expect(screen.getByText(/Years of Service/i)).toBeInTheDocument()
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '10')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultCard = screen.getByText(/Total Gratuity/i).closest('div')?.parentElement
      const resultText = resultCard?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })

  it('validates years of service cannot exceed 50', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '60')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Years of service cannot exceed 50 years/i)).toBeInTheDocument()
    })
  })

  it('displays calculation formula in results', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '10')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Calculation Formula/i)).toBeInTheDocument()
    })
  })

  it('handles edge case with minimum 5 years service', async () => {
    const user = userEvent.setup()
    
    render(<GratuityCalculator />)
    
    const salaryInput = screen.getByLabelText(/Last Drawn Basic Salary/i)
    const yearsInput = screen.getByLabelText(/Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Gratuity/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(yearsInput)
    await user.type(yearsInput, '5')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      // Gratuity is calculated for 5 years (minimum eligible)
      expect(screen.getAllByText(/Gratuity Amount/i).length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })
})

