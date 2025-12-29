/**
 * Indian Salary & Tax Calculator Utility (FY 2024-25)
 * Handles In-Hand Salary, Tax calculations, and Offer comparisons
 */

import { calculateIncomeTax, type TaxInput, type TaxResult, type AgeCategory } from './taxCalculator';

export interface SalaryComponents {
  basic: number; // Basic salary
  hra: number; // House Rent Allowance
  specialAllowance: number; // Special Allowance
  otherAllowances?: number; // Other allowances
}

export interface SalaryDeductions {
  employeePF: number; // Employee PF contribution (12% of basic, capped at ₹1,800/month)
  employerPF: number; // Employer PF contribution (12% of basic)
  professionalTax: number; // Professional Tax (state-based, default ₹200/month)
  otherDeductions?: number; // Other deductions
}

export interface SalaryInput {
  ctc: number; // Cost to Company
  basicPercentage: number; // Basic salary as % of CTC (typically 40-50%)
  hraPercentage: number; // HRA as % of Basic (typically 40-50%)
  specialAllowance: number; // Special Allowance amount
  variablePay?: number; // Variable pay amount
  variablePayRealization?: number; // Expected % of variable pay (e.g., 80% - do not assume 100%)
  employeePFPercentage?: number; // Employee PF % (default 12%)
  employerPFPercentage?: number; // Employer PF % (default 12%)
  professionalTax?: number; // Professional Tax per month (default ₹200)
  voluntaryPF?: boolean; // If true, PF not capped at ₹15,000 basic
  ctcIncludesEmployerPF?: boolean; // If true, Employer PF is part of CTC (subtract from gross for comparison)
  ageCategory: AgeCategory;
  taxRegime: 'OLD' | 'NEW';
  // Old Regime deductions
  section80C?: number;
  section80D?: number;
  hraExemption?: number; // Calculated or manual HRA exemption
  otherDeductions?: number;
  // Location for HRA calculation
  cityType?: 'metro' | 'non-metro';
  rentPaid?: number;
}

export interface SalaryResult {
  // Salary Components
  monthlyBasic: number;
  monthlyHRA: number;
  monthlySpecialAllowance: number;
  monthlyGross: number;
  annualGross: number;
  
  // Deductions
  monthlyEmployeePF: number;
  monthlyEmployerPF: number;
  monthlyProfessionalTax: number;
  monthlyTotalDeductions: number;
  annualTotalDeductions: number;
  
  // Tax Calculations
  taxResultNew: TaxResult;
  taxResultOld: TaxResult;
  
  // Final Outputs
  monthlyInHandNew: number;
  monthlyInHandOld: number;
  annualInHandNew: number;
  annualInHandOld: number;
  
  // Comparison
  taxSavedBySwitching: number;
  recommendedRegime: 'OLD' | 'NEW';
  breakEvenPoint?: number; // CTC at which both regimes give same tax
}

// Import constants from centralized source
import {
  EPF_EMPLOYEE_PERCENT as DEFAULT_EMPLOYEE_PF_PERCENT,
  EPF_EMPLOYER_PERCENT as DEFAULT_EMPLOYER_PF_PERCENT,
  EPS_WAGE_CEILING as PF_WAGE_CEILING,
  MAX_EMPLOYEE_PF,
  DEFAULT_PROFESSIONAL_TAX,
  STANDARD_DEDUCTION_OLD,
  STANDARD_DEDUCTION_NEW,
  HRA_METRO_PERCENT,
  HRA_NON_METRO_PERCENT,
  HRA_BASIC_PERCENT,
} from './tax-constants';

/**
 * Calculate HRA Exemption as per Income Tax Act
 */
export function calculateHRAExemption(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  cityType: 'metro' | 'non-metro' = 'metro'
): number {
  if (basicSalary <= 0 || hraReceived <= 0 || rentPaid <= 0) {
    return 0;
  }

  // HRA exemption = Minimum of:
  // 1. Actual HRA received
  // 2. Actual rent paid - 10% of basic salary
  // 3. 50% of basic (metro) or 40% of basic (non-metro)

  const option1 = hraReceived;
  const option2 = Math.max(0, rentPaid - (basicSalary * HRA_BASIC_PERCENT));
  const option3 = cityType === 'metro' 
    ? basicSalary * HRA_METRO_PERCENT 
    : basicSalary * HRA_NON_METRO_PERCENT;

  return Math.min(option1, option2, option3);
}

/**
 * Calculate Employee PF Contribution
 */
function calculateEmployeePF(basic: number, voluntaryPF: boolean = false): number {
  if (voluntaryPF) {
    // No cap if voluntary PF
    return Math.round(basic * DEFAULT_EMPLOYEE_PF_PERCENT);
  }
  
  // PF capped at ₹15,000 basic
  const pfBase = Math.min(basic, PF_WAGE_CEILING);
  return Math.round(pfBase * DEFAULT_EMPLOYEE_PF_PERCENT);
}

/**
 * Calculate Employer PF Contribution
 */
function calculateEmployerPF(basic: number, voluntaryPF: boolean = false): number {
  if (voluntaryPF) {
    return Math.round(basic * DEFAULT_EMPLOYER_PF_PERCENT);
  }
  
  const pfBase = Math.min(basic, PF_WAGE_CEILING);
  return Math.round(pfBase * DEFAULT_EMPLOYER_PF_PERCENT);
}

/**
 * Calculate In-Hand Salary
 */
export function calculateInHandSalary(input: SalaryInput): SalaryResult {
  // Handle Variable Pay: Apply realization percentage (do not assume 100%)
  const variablePayRealization = input.variablePayRealization || 100; // Default 100% if not specified
  const actualVariablePay = input.variablePay 
    ? (input.variablePay * variablePayRealization) / 100 
    : 0;

  // Calculate monthly salary components
  const annualBasic = input.ctc * (input.basicPercentage / 100);
  const monthlyBasic = annualBasic / 12;
  
  const annualHRA = annualBasic * (input.hraPercentage / 100);
  const monthlyHRA = annualHRA / 12;
  
  // Special Allowance: If not provided, calculate from remaining CTC
  const annualSpecialAllowance = input.specialAllowance || (input.ctc - annualBasic - annualHRA - (input.variablePay || 0));
  const monthlySpecialAllowance = annualSpecialAllowance / 12;
  
  // Calculate gross (before deductions)
  // If CTC includes Employer PF, we'll subtract it later for tax calculation
  const monthlyGross = monthlyBasic + monthlyHRA + monthlySpecialAllowance + (actualVariablePay / 12);
  let annualGross = input.ctc;
  
  // PF Treatment: If CTC includes Employer PF, subtract it from Gross for tax calculation
  if (input.ctcIncludesEmployerPF) {
    const monthlyEmployerPF = calculateEmployerPF(monthlyBasic, input.voluntaryPF);
    annualGross = annualGross - (monthlyEmployerPF * 12);
  }

  // Calculate deductions
  const monthlyEmployeePF = calculateEmployeePF(monthlyBasic, input.voluntaryPF);
  const monthlyEmployerPF = calculateEmployerPF(monthlyBasic, input.voluntaryPF);
  const monthlyProfessionalTax = input.professionalTax || DEFAULT_PROFESSIONAL_TAX;
  
  const monthlyTotalDeductions = monthlyEmployeePF + monthlyProfessionalTax + (input.otherDeductions || 0) / 12;
  const annualTotalDeductions = monthlyTotalDeductions * 12;

  // Calculate taxable income (Gross - Deductions)
  // Use adjusted gross if Employer PF was included in CTC
  const adjustedAnnualGross = input.ctcIncludesEmployerPF 
    ? annualGross 
    : input.ctc;
  const taxableIncome = adjustedAnnualGross - annualTotalDeductions;

  // Calculate HRA exemption for Old Regime
  let hraExemption = 0;
  if (input.taxRegime === 'OLD' && input.cityType && input.rentPaid) {
    hraExemption = calculateHRAExemption(
      annualBasic,
      annualHRA,
      input.rentPaid * 12,
      input.cityType
    );
  } else if (input.hraExemption) {
    hraExemption = input.hraExemption;
  }

  // Calculate tax for both regimes
  const taxInputNew: TaxInput = {
    annualGrossIncome: taxableIncome,
    regime: 'NEW',
    ageCategory: input.ageCategory,
    deductions: {},
  };

  const taxInputOld: TaxInput = {
    annualGrossIncome: taxableIncome,
    regime: 'OLD',
    ageCategory: input.ageCategory,
    deductions: {
      section80C: input.section80C || 0,
      section80D: input.section80D || 0,
      hra: hraExemption,
      otherDeductions: input.otherDeductions || 0,
    },
  };

  const taxResultNew = calculateIncomeTax(taxInputNew);
  const taxResultOld = calculateIncomeTax(taxInputOld);

  // Calculate monthly in-hand salary
  const monthlyTaxNew = taxResultNew.finalTaxPayable / 12;
  const monthlyTaxOld = taxResultOld.finalTaxPayable / 12;

  const monthlyInHandNew = monthlyGross - monthlyTotalDeductions - monthlyTaxNew;
  const monthlyInHandOld = monthlyGross - monthlyTotalDeductions - monthlyTaxOld;

  const annualInHandNew = monthlyInHandNew * 12;
  const annualInHandOld = monthlyInHandOld * 12;

  // Determine recommended regime
  const recommendedRegime = taxResultNew.finalTaxPayable < taxResultOld.finalTaxPayable ? 'NEW' : 'OLD';
  const taxSavedBySwitching = Math.abs(taxResultNew.finalTaxPayable - taxResultOld.finalTaxPayable);

  return {
    monthlyBasic,
    monthlyHRA,
    monthlySpecialAllowance,
    monthlyGross,
    annualGross,
    monthlyEmployeePF,
    monthlyEmployerPF,
    monthlyProfessionalTax,
    monthlyTotalDeductions,
    annualTotalDeductions,
    taxResultNew,
    taxResultOld,
    monthlyInHandNew,
    monthlyInHandOld,
    annualInHandNew,
    annualInHandOld,
    taxSavedBySwitching,
    recommendedRegime,
  };
}

/**
 * Compare two job offers
 * Must calculate "Take Home" by removing: PF (Employee), Professional Tax (default ₹200), and Income Tax (New Regime default)
 * Input: Two CTC offers with variable pay handling and PF treatment
 * Output: Side-by-side comparison of "Monthly In-Hand" and "Annual Savings"
 * 
 * Hidden Logic:
 * - Variable Pay: Apply realization percentage (e.g., 80%) - do not assume 100%
 * - PF Treatment: If CTC includes Employer PF, subtract it from Gross before comparing
 */
export interface OfferComparison {
  offer1: SalaryResult;
  offer2: SalaryResult;
  betterOffer: 1 | 2;
  monthlyDifference: number;
  annualDifference: number;
  monthlyInHand1: number;
  monthlyInHand2: number;
  annualSavings1: number;
  annualSavings2: number;
  recommendation: string;
  sideBySideComparison: {
    offer1: {
      ctc: number;
      variablePayRealized?: number;
      monthlyGross: number;
      monthlyDeductions: number;
      monthlyTax: number;
      monthlyInHand: number;
      annualInHand: number;
    };
    offer2: {
      ctc: number;
      variablePayRealized?: number;
      monthlyGross: number;
      monthlyDeductions: number;
      monthlyTax: number;
      monthlyInHand: number;
      annualInHand: number;
    };
  };
}

export function compareOffers(
  offer1Input: SalaryInput,
  offer2Input: SalaryInput
): OfferComparison {
  // Use New Regime as default for comparison (as per requirement)
  const offer1Calc = calculateInHandSalary({ ...offer1Input, taxRegime: 'NEW' });
  const offer2Calc = calculateInHandSalary({ ...offer2Input, taxRegime: 'NEW' });

  const monthlyInHand1 = offer1Calc.monthlyInHandNew;
  const monthlyInHand2 = offer2Calc.monthlyInHandNew;
  const annualInHand1 = offer1Calc.annualInHandNew;
  const annualInHand2 = offer2Calc.annualInHandNew;

  const betterOffer = monthlyInHand1 > monthlyInHand2 ? 1 : 2;
  const annualDifference = Math.abs(annualInHand1 - annualInHand2);
  const monthlyDifference = Math.abs(monthlyInHand1 - monthlyInHand2);

  // Calculate annual savings (In-hand salary)
  const annualSavings1 = annualInHand1;
  const annualSavings2 = annualInHand2;

  let recommendation = '';
  if (betterOffer === 1) {
    recommendation = `Offer A pays ₹${Math.round(monthlyDifference).toLocaleString('en-IN')} more monthly in-hand (₹${Math.round(annualDifference).toLocaleString('en-IN')} annually)`;
  } else {
    recommendation = `Offer B pays ₹${Math.round(monthlyDifference).toLocaleString('en-IN')} more monthly in-hand (₹${Math.round(annualDifference).toLocaleString('en-IN')} annually)`;
  }

  // Calculate realized variable pay
  const variablePay1Realized = offer1Input.variablePay && offer1Input.variablePayRealization
    ? (offer1Input.variablePay * offer1Input.variablePayRealization) / 100
    : undefined;
  const variablePay2Realized = offer2Input.variablePay && offer2Input.variablePayRealization
    ? (offer2Input.variablePay * offer2Input.variablePayRealization) / 100
    : undefined;

  // Side-by-side comparison
  const sideBySideComparison = {
    offer1: {
      ctc: offer1Input.ctc,
      variablePayRealized: variablePay1Realized,
      monthlyGross: offer1Calc.monthlyGross,
      monthlyDeductions: offer1Calc.monthlyTotalDeductions,
      monthlyTax: offer1Calc.taxResultNew.finalTaxPayable / 12,
      monthlyInHand: monthlyInHand1,
      annualInHand: annualInHand1,
    },
    offer2: {
      ctc: offer2Input.ctc,
      variablePayRealized: variablePay2Realized,
      monthlyGross: offer2Calc.monthlyGross,
      monthlyDeductions: offer2Calc.monthlyTotalDeductions,
      monthlyTax: offer2Calc.taxResultNew.finalTaxPayable / 12,
      monthlyInHand: monthlyInHand2,
      annualInHand: annualInHand2,
    },
  };

  return {
    offer1: offer1Calc,
    offer2: offer2Calc,
    betterOffer,
    monthlyDifference,
    annualDifference,
    monthlyInHand1,
    monthlyInHand2,
    annualSavings1,
    annualSavings2,
    recommendation,
    sideBySideComparison,
  };
}

