/**
 * Indian Income Tax Calculator Utility (FY 2024-25)
 * Implements both Old and New Tax Regime calculations with all edge cases
 */

import {
  STANDARD_DEDUCTION_OLD,
  STANDARD_DEDUCTION_NEW,
  CESS_RATE,
  REBATE_THRESHOLD_OLD,
  REBATE_THRESHOLD_NEW,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS_BELOW60,
  OLD_REGIME_SLABS_SENIOR,
  OLD_REGIME_SLABS_SUPER_SENIOR,
  SURCHARGE_THRESHOLDS,
  SECTION_80C_LIMIT,
  type TaxSlab,
} from './tax-constants';

export type TaxRegime = 'OLD' | 'NEW';
export type AgeCategory = 'below60' | 'senior' | 'superSenior';

export interface TaxDeductions {
  section80C?: number; // Max ₹1,50,000 (Old Regime only)
  section80D?: number; // Health Insurance (Old Regime only)
  hra?: number; // House Rent Allowance (Old Regime only)
  lta?: number; // Leave Travel Allowance (Old Regime only)
  otherDeductions?: number; // Other exempt allowances
  employerNPS?: number; // Section 80CCD(2) - Employer NPS contribution (New Regime allowed)
}

export interface TaxInput {
  annualGrossIncome: number;
  regime: TaxRegime;
  ageCategory: AgeCategory;
  deductions: TaxDeductions;
}

// TaxSlab type is imported from tax-constants.ts

export interface TaxResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxSlabBreakdown: TaxSlab[];
  taxBeforeRebate: number;
  rebateAmount: number;
  taxAfterRebate: number;
  surcharge: number;
  cessAmount: number;
  finalTaxPayable: number;
  marginalRelief?: number; // If applicable
}

// All constants are now imported from tax-constants.ts

/**
 * Calculate surcharge based on income and regime
 */
function calculateSurcharge(taxAfterRebate: number, income: number, regime: TaxRegime): number {
  const firstThreshold = SURCHARGE_THRESHOLDS[0];
  if (income <= firstThreshold.income) return 0; // No surcharge up to first threshold

  let surchargeRate = 0;
  
  if (income <= 10000000) {
    surchargeRate = 0.10; // 10%
  } else if (income <= 20000000) {
    surchargeRate = 0.15; // 15%
  } else if (income <= 50000000) {
    surchargeRate = 0.25; // 25%
  } else {
    // Above ₹5Cr
    surchargeRate = regime === 'NEW' ? 0.25 : 0.37; // New Regime capped at 25%
  }

  return Math.round(taxAfterRebate * surchargeRate);
}

/**
 * Calculate tax using slab structure
 */
function calculateTaxFromSlabs(income: number, slabs: typeof NEW_REGIME_SLABS): { totalTax: number; breakdown: TaxSlab[] } {
  const breakdown: TaxSlab[] = [];
  let totalTax = 0;

  for (const slab of slabs) {
    if (income <= slab.from) break; // Income is below this slab, no more processing needed

    // Calculate how much of this slab applies
    const slabStart = slab.from;
    const slabEnd = slab.to === Infinity ? income : Math.min(slab.to, income);
    
    // Calculate the amount in this slab
    const slabAmount = slabEnd - slabStart + 1;
    
    if (slabAmount > 0) {
      const slabTax = slabAmount * slab.rate;
      
      breakdown.push({
        from: slabStart,
        to: slabEnd,
        rate: slab.rate * 100, // Convert to percentage
        tax: Math.round(slabTax),
      });
      totalTax += slabTax;
      
      // If we've reached the income limit, stop
      if (slabEnd >= income) break;
    }
  }

  return { totalTax: Math.round(totalTax), breakdown };
}

/**
 * Calculate New Regime Tax
 */
function calculateNewRegimeTax(input: TaxInput): TaxResult {
  const { annualGrossIncome, deductions } = input;
  
  // Standard Deduction
  const standardDeduction = STANDARD_DEDUCTION_NEW;
  
  // Allowed deductions: Only Standard Deduction + Employer NPS (80CCD(2))
  const employerNPS = deductions.employerNPS || 0;
  const totalDeductions = standardDeduction + employerNPS;
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, annualGrossIncome - totalDeductions);

  // Calculate tax using slabs
  const { totalTax, breakdown } = calculateTaxFromSlabs(taxableIncome, NEW_REGIME_SLABS);
  const taxBeforeRebate = totalTax;

  // Apply Section 87A rebate FIRST
  // If taxable income <= ₹7,00,000, Tax is 0
  let rebateAmount = 0;
  if (taxableIncome <= REBATE_THRESHOLD_NEW) {
    rebateAmount = taxBeforeRebate;
  }

  let taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);

  // Apply Marginal Relief if applicable (after rebate, for income slightly above ₹7L)
  // If income is slightly above ₹7L, tax cannot exceed the income earned above ₹7L
  let marginalRelief = 0;
  if (taxableIncome > 700000 && taxAfterRebate > 0) {
    const incomeAboveThreshold = taxableIncome - REBATE_THRESHOLD_NEW;
    // Tax at ₹7L is ₹0 (due to rebate), so max tax = income above threshold
    const maxTaxAllowed = incomeAboveThreshold;
    
    if (taxAfterRebate > maxTaxAllowed) {
      marginalRelief = taxAfterRebate - maxTaxAllowed;
      taxAfterRebate = maxTaxAllowed;
    }
  }

  // Apply surcharge (capped at 25% for New Regime)
  const surcharge = calculateSurcharge(taxAfterRebate, annualGrossIncome, 'NEW');

  // Calculate Cess: 4% of (Tax + Surcharge)
  const cessAmount = Math.round((taxAfterRebate + surcharge) * CESS_RATE);

  // Final tax payable
  const finalTaxPayable = taxAfterRebate + surcharge + cessAmount;

  return {
    grossIncome: annualGrossIncome,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxSlabBreakdown: breakdown,
    taxBeforeRebate: totalTax, // Original tax before marginal relief
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cessAmount,
    finalTaxPayable,
    marginalRelief: marginalRelief > 0 ? marginalRelief : undefined,
  };
}

/**
 * Calculate Old Regime Tax
 */
function calculateOldRegimeTax(input: TaxInput): TaxResult {
  const { annualGrossIncome, ageCategory, deductions } = input;
  
  // Standard Deduction
  const standardDeduction = STANDARD_DEDUCTION_OLD;
  
  // Calculate total deductions
  const section80C = Math.min(deductions.section80C || 0, SECTION_80C_LIMIT);
  const section80D = deductions.section80D || 0;
  const hra = deductions.hra || 0;
  const lta = deductions.lta || 0;
  const otherDeductions = deductions.otherDeductions || 0;
  
  const totalDeductions = standardDeduction + section80C + section80D + hra + lta + otherDeductions;
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, annualGrossIncome - totalDeductions);

  // Select appropriate slabs based on age
  let slabs: typeof OLD_REGIME_SLABS_BELOW60;
  if (ageCategory === 'superSenior') {
    slabs = OLD_REGIME_SLABS_SUPER_SENIOR;
  } else if (ageCategory === 'senior') {
    slabs = OLD_REGIME_SLABS_SENIOR;
  } else {
    slabs = OLD_REGIME_SLABS_BELOW60;
  }

  // Calculate tax using slabs
  const { totalTax, breakdown } = calculateTaxFromSlabs(taxableIncome, slabs);
  const taxBeforeRebate = totalTax;

  // Apply Section 87A rebate
  // If taxable income <= ₹5,00,000, Tax is 0
  let rebateAmount = 0;
  if (taxableIncome <= REBATE_THRESHOLD_OLD) {
    rebateAmount = taxBeforeRebate;
  }

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebateAmount);

  // Apply surcharge
  const surcharge = calculateSurcharge(taxAfterRebate, annualGrossIncome, 'OLD');

  // Calculate Cess: 4% of (Tax + Surcharge)
  const cessAmount = Math.round((taxAfterRebate + surcharge) * CESS_RATE);

  // Final tax payable
  const finalTaxPayable = taxAfterRebate + surcharge + cessAmount;

  return {
    grossIncome: annualGrossIncome,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    taxSlabBreakdown: breakdown,
    taxBeforeRebate,
    rebateAmount,
    taxAfterRebate,
    surcharge,
    cessAmount,
    finalTaxPayable,
  };
}

/**
 * Main Tax Calculator Function
 */
export function calculateIncomeTax(input: TaxInput): TaxResult {
  // Validation
  if (input.annualGrossIncome < 0) {
    throw new Error('Annual gross income cannot be negative');
  }

  if (input.regime === 'NEW') {
    return calculateNewRegimeTax(input);
  } else {
    return calculateOldRegimeTax(input);
  }
}

/**
 * Helper function to convert age to age category
 */
export function getAgeCategory(age: number): AgeCategory {
  if (age >= 80) return 'superSenior';
  if (age >= 60) return 'senior';
  return 'below60';
}

