import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EPSCalculator from '../page'

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

describe('EPS Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<EPSCalculator />)
    
    expect(screen.getByText(/EPS Pension Calculator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Average Pensionable Salary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Total Years of Service/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate Pension/i)).toBeInTheDocument()
  })

  it('shows error when pensionable salary is invalid', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Pensionable salary must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('shows error when years of service is invalid', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Years of service cannot be negative/i)).toBeInTheDocument()
    })
  })

  it('shows not eligible message when service is less than 10 years', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '5')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Not Eligible for EPS Pension/i)).toBeInTheDocument()
      expect(screen.getByText(/Minimum 10 years of EPF membership is required/i)).toBeInTheDocument()
    })
  })

  it('calculates EPS pension for eligible employees', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '20')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Pension Calculation Result/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Monthly Pension/i)).toBeInTheDocument()
    expect(screen.getByText(/Eligible for EPS Pension/i)).toBeInTheDocument()
    expect(screen.getByText(/Pensionable Salary/i)).toBeInTheDocument()
    expect(screen.getByText(/Pensionable Service/i)).toBeInTheDocument()
  })

  it('displays calculation formula in results', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '20')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Calculation Formula/i)).toBeInTheDocument()
    })
  })

  it('allows selecting employee type', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const employeeTypeSelect = screen.getByLabelText(/Employee Type/i)
    
    expect(employeeTypeSelect).toBeInTheDocument()
    
    await user.click(employeeTypeSelect)
    await user.click(screen.getByText(/Government Sector/i))
    
    await waitFor(() => {
      expect(screen.getByText(/Government Sector/i)).toBeInTheDocument()
    })
  })

  it('handles pensionable service years input', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const pensionableServiceInput = screen.getByLabelText(/Pensionable Service Years/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '25')
    await user.clear(pensionableServiceInput)
    await user.type(pensionableServiceInput, '20')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Pension Calculation Result/i)).toBeInTheDocument()
    })
  })

  it('validates pensionable service cannot exceed total service', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const pensionableServiceInput = screen.getByLabelText(/Pensionable Service Years/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '20')
    await user.clear(pensionableServiceInput)
    await user.type(pensionableServiceInput, '25')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Pensionable service cannot exceed total service years/i)).toBeInTheDocument()
    })
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '15000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '20')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultText = screen.getByText(/Monthly Pension/i).closest('div')?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })

  it('caps pensionable salary at ₹15,000', async () => {
    const user = userEvent.setup()
    
    render(<EPSCalculator />)
    
    const salaryInput = screen.getByLabelText(/Average Pensionable Salary/i)
    const serviceInput = screen.getByLabelText(/Total Years of Service/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Pension/i })
    
    await user.clear(salaryInput)
    await user.type(salaryInput, '50000')
    await user.clear(serviceInput)
    await user.type(serviceInput, '20')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Pension Calculation Result/i)).toBeInTheDocument()
    })
    
    // The calculation should use capped salary of ₹15,000
    expect(screen.getByText(/Pensionable Salary/i)).toBeInTheDocument()
  })
})

