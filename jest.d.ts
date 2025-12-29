import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveClass(...classNames: string[]): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveValue(value: string | number): R
      toBeChecked(): R
      toBeRequired(): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveFocus(): R
      toHaveFormValues(values: Record<string, any>): R
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
      toHaveAccessibleName(name: string | RegExp): R
      toHaveAccessibleDescription(description: string | RegExp): R
      toHaveErrorMessage(message: string | RegExp): R
    }
  }
}

export {}


