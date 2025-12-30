import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HealthInsuranceCalculator from '../page'

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

describe('Health Insurance Calculator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the calculator form', () => {
    render(<HealthInsuranceCalculator />)
    
    expect(screen.getByText(/Health Insurance Calculator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Family Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Age/i)).toBeInTheDocument()
    expect(screen.getByText(/Calculate Coverage/i)).toBeInTheDocument()
  })

  it('shows error when age is invalid', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid age/i)).toBeInTheDocument()
    })
  })

  it('calculates health insurance coverage for individual', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.type(ageInput, '30')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Individual coverage/i)).toBeInTheDocument()
  })

  it('calculates health insurance coverage for family', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const familyTypeSelect = screen.getByLabelText(/Family Type/i)
    const ageInput = screen.getByLabelText(/Your Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.click(familyTypeSelect)
    await user.click(screen.getByText(/Family Floater/i))
    await user.clear(ageInput)
    await user.type(ageInput, '35')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Family floater coverage/i)).toBeInTheDocument()
  })

  it('includes children in family coverage calculation', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const familyTypeSelect = screen.getByLabelText(/Family Type/i)
    await user.click(familyTypeSelect)
    await user.click(screen.getByText(/Family Floater/i))
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const childrenInput = screen.getByLabelText(/Number of Children/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.type(ageInput, '35')
    await user.clear(childrenInput)
    await user.type(childrenInput, '2')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
  })

  it('validates children count', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const familyTypeSelect = screen.getByLabelText(/Family Type/i)
    await user.click(familyTypeSelect)
    await user.click(screen.getByText(/Family Floater/i))
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const childrenInput = screen.getByLabelText(/Number of Children/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.type(ageInput, '35')
    await user.clear(childrenInput)
    await user.type(childrenInput, '10')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Number of children must be between 0 and 5/i)).toBeInTheDocument()
    })
  })

  it('displays formatted currency values in results', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.type(ageInput, '30')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      const resultText = screen.getByText(/Recommended Coverage/i).closest('div')?.textContent || ''
      expect(resultText).toMatch(/₹|\d/)
    })
  })

  it('handles existing coverage input', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const ageInput = screen.getByLabelText(/Your Age/i)
    const existingInput = screen.getByLabelText(/Existing Coverage/i)
    const calculateButton = screen.getByRole('button', { name: /Calculate Coverage/i })
    
    await user.clear(ageInput)
    await user.type(ageInput, '30')
    await user.clear(existingInput)
    await user.type(existingInput, '500000')
    
    await user.click(calculateButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Recommended Coverage/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Existing Coverage/i)).toBeInTheDocument()
  })

  it('allows switching between individual and family types', async () => {
    const user = userEvent.setup()
    
    render(<HealthInsuranceCalculator />)
    
    const familyTypeSelect = screen.getByLabelText(/Family Type/i)
    
    expect(screen.queryByLabelText(/Spouse Age/i)).not.toBeInTheDocument()
    
    await user.click(familyTypeSelect)
    await user.click(screen.getByText(/Family Floater/i))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Spouse Age/i)).toBeInTheDocument()
    })
  })
})






