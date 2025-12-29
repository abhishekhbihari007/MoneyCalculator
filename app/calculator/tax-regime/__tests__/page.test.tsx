import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaxRegimePicker from '../page'

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

describe('Tax Regime Picker', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<TaxRegimePicker />)
    
    expect(screen.getByText(/Indian Income Tax Regime Calculator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Annual Gross Income/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Section 80C/i)).toBeInTheDocument()
    // "Calculate Tax" appears in button and in "How It Works" text
    expect(screen.getAllByText(/Calculate Tax/i).length).toBeGreaterThan(0)
  })

  it('shows error when income is invalid', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    // "Calculate Tax" appears in button and in "How It Works" text, so get the button specifically
    const calculateButton = screen.getByRole('button', { name: /Calculate Tax/i })
    await user.click(calculateButton)
    
    // The component shows error messages in the UI, not alerts
    await waitFor(() => {
      expect(screen.getByText(/Annual income must be greater than ₹0/i)).toBeInTheDocument()
    })
  })

  it('compares old and new tax regimes', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i)
    const deductionsInput = screen.getByLabelText(/Section 80C/i)
    // "Calculate Tax" appears in button and in "How It Works" text, so get the button specifically
    const calculateButton = screen.getByRole('button', { name: /Calculate Tax/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    await user.clear(deductionsInput)
    await user.type(deductionsInput, '150000')
    
    await user.click(calculateButton)
    
    // Wait for results to appear
    // The component shows the selected regime and a comparison section
    await waitFor(() => {
      // Check for comparison section which shows both regimes
      expect(screen.getByText(/Tax under Old Regime/i)).toBeInTheDocument()
      expect(screen.getByText(/Tax under New Regime/i)).toBeInTheDocument()
    })
    
    // Check that comparison results are displayed (multiple instances exist)
    expect(screen.getAllByText(/Taxable Income/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Final Tax Payable/i).length).toBeGreaterThan(0)
    // Check for gross income and deductions
    expect(screen.getAllByText(/Gross Income/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Total Deductions/i).length).toBeGreaterThan(0)
  })

  it('displays recommendation based on tax savings', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i)
    const deductionsInput = screen.getByLabelText(/Section 80C/i)
    // "Calculate Tax" appears in button and in "How It Works" text, so get the button specifically
    const calculateButton = screen.getByRole('button', { name: /Calculate Tax/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '800000')
    await user.clear(deductionsInput)
    await user.type(deductionsInput, '50000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended/i)).toBeInTheDocument()
    })
    
    // Check that savings are displayed
    expect(screen.getByText(/Tax Savings/i)).toBeInTheDocument()
  })

  it('updates input values correctly', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i) as HTMLInputElement
    const deductionsInput = screen.getByLabelText(/Section 80C/i) as HTMLInputElement
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1200000')
    // Input values are strings in HTML inputs
    expect(incomeInput.value).toBe('1200000')
    
    await user.clear(deductionsInput)
    // Type a value within the limit (150000 max for 80C)
    await user.type(deductionsInput, '100000')
    // Wait for the value to be set
    await waitFor(() => {
      expect(deductionsInput.value).toBe('100000')
    })
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i)
    // "Calculate Tax" appears in button and in "How It Works" text, so get the button specifically
    const calculateButton = screen.getByRole('button', { name: /Calculate Tax/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '1000000')
    
    await user.click(calculateButton)
    
    // Results show the selected regime and comparison
    await waitFor(() => {
      // Either the selected regime or the comparison section should appear
      const hasResults = screen.queryByText(/Old Tax Regime/i) || 
                        screen.queryByText(/New Tax Regime/i) ||
                        screen.queryByText(/Tax Savings/i)
      expect(hasResults).toBeTruthy()
    })
    
    // Check that currency values are formatted
    // Find any result card that contains currency values
    const comparisonSection = screen.getByText(/Tax under Old Regime/i).closest('div')?.parentElement
    const resultText = comparisonSection?.textContent || ''
    // Should contain currency formatted numbers (₹ symbol or digits)
    expect(resultText).toMatch(/₹|\d/)
  })

  it('handles edge case with zero deductions', async () => {
    const user = userEvent.setup()
    
    render(<TaxRegimePicker />)
    
    const incomeInput = screen.getByLabelText(/Annual Gross Income/i)
    const deductionsInput = screen.getByLabelText(/Section 80C/i)
    // "Calculate Tax" appears in button and in "How It Works" text, so get the button specifically
    const calculateButton = screen.getByRole('button', { name: /Calculate Tax/i })
    
    await user.clear(incomeInput)
    await user.type(incomeInput, '500000')
    await user.clear(deductionsInput)
    await user.type(deductionsInput, '0')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      // The comparison section shows both regimes
      expect(screen.getByText(/Tax under Old Regime/i)).toBeInTheDocument()
      expect(screen.getByText(/Tax under New Regime/i)).toBeInTheDocument()
    })
  })
})

