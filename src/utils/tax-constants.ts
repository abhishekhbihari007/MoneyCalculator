/**
 * Indian Financial Constants - Source of Truth (FY 2024-25)
 * 
 * This file contains ALL magic numbers used across the calculator utilities.
 * Update this file annually when Budget changes are announced.
 * 
 * Last Updated: July 2024 Budget
 */

// ============================================
// TAX REGIME CONSTANTS
// ============================================

/**
 * Standard Deduction (FY 2024-25)
 */
export const STANDARD_DEDUCTION_OLD = 50000; // ₹50,000 (Old Regime)
export const STANDARD_DEDUCTION_NEW = 75000; // ₹75,000 (New Regime - Increased in July 2024 Budget)

/**
 * Health & Education Cess
 */
export const CESS_RATE = 0.04; // 4%

/**
 * Section 87A Rebate Thresholds
 */
export const REBATE_THRESHOLD_OLD = 500000; // ₹5,00,000 (Old Regime)
export const REBATE_THRESHOLD_NEW = 700000; // ₹7,00,000 (New Regime)

// ============================================
// TAX SLABS (FY 2024-25)
// ============================================

export interface TaxSlab {
  from: number;
  to: number;
  rate: number;
  tax?: number; // Tax amount for this slab (calculated, optional for slab definitions)
}

/**
 * New Tax Regime Slabs (FY 2024-25 - Revised Budget)
 * IMPORTANT: There is NO 25% tax slab in New Tax Regime
 */
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300001, to: 700000, rate: 0.05 }, // 3L-7L @ 5%
  { from: 700001, to: 1000000, rate: 0.10 }, // 7L-10L @ 10%
  { from: 1000001, to: 1200000, rate: 0.15 }, // 10L-12L @ 15%
  { from: 1200001, to: 1500000, rate: 0.20 }, // 12L-15L @ 20%
  { from: 1500001, to: Infinity, rate: 0.30 }, // Above 15L @ 30%
];

/**
 * Old Tax Regime Slabs (Age-based)
 */
export const OLD_REGIME_SLABS_BELOW60: TaxSlab[] = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250001, to: 500000, rate: 0.05 },
  { from: 500001, to: 1000000, rate: 0.20 },
  { from: 1000001, to: Infinity, rate: 0.30 },
];

export const OLD_REGIME_SLABS_SENIOR: TaxSlab[] = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300001, to: 500000, rate: 0.05 },
  { from: 500001, to: 1000000, rate: 0.20 },
  { from: 1000001, to: Infinity, rate: 0.30 },
];

export const OLD_REGIME_SLABS_SUPER_SENIOR: TaxSlab[] = [
  { from: 0, to: 500000, rate: 0 },
  { from: 500001, to: 1000000, rate: 0.20 },
  { from: 1000001, to: Infinity, rate: 0.30 },
];

/**
 * Surcharge Thresholds
 */
export interface SurchargeThreshold {
  income: number;
  rate: number;
}

export const SURCHARGE_THRESHOLDS: SurchargeThreshold[] = [
  { income: 5000000, rate: 0.10 }, // 10% for 50L-1Cr
  { income: 10000000, rate: 0.15 }, // 15% for 1Cr-2Cr
  { income: 20000000, rate: 0.25 }, // 25% for 2Cr-5Cr
  { income: 50000000, rate: 0.37 }, // 37% for >5Cr (Old Regime only)
];

// ============================================
// DEDUCTION LIMITS
// ============================================

/**
 * Section 80C Limit
 */
export const SECTION_80C_LIMIT = 150000; // ₹1,50,000

/**
 * Section 80D Limits (Health Insurance)
 */
export const SECTION_80D_LIMIT_BELOW60 = 25000; // ₹25,000 (Self + Family)
export const SECTION_80D_LIMIT_SENIOR = 50000; // ₹50,000 (Senior Citizens)

/**
 * Section 80CCD(1B) Limit (NPS)
 */
export const SECTION_80CCD1B_LIMIT = 50000; // ₹50,000 (Old Regime only)
export const NPS_80CCD1B_LIMIT = SECTION_80CCD1B_LIMIT; // Alias for NPS calculator

/**
 * Section 24(b) - Home Loan Interest
 */
export const SECTION_24B_LIMIT = 200000; // ₹2,00,000

// ============================================
// EPF CONSTANTS
// ============================================

/**
 * EPF Interest Rate (FY 2024-25)
 */
export const EPF_INTEREST_RATE = 0.0825; // 8.25%

/**
 * EPF Contribution Percentages
 */
export const EPF_EMPLOYEE_PERCENT = 0.12; // 12%
export const EPF_EMPLOYER_PERCENT = 0.12; // 12%
export const EPS_PERCENT = 0.0833; // 8.33% of employer contribution goes to EPS
export const EPF_PERCENT = 0.0367; // 3.67% of employer contribution goes to EPF

/**
 * EPF Wage Ceiling
 */
export const EPS_WAGE_CEILING = 15000; // ₹15,000/month
export const MAX_EPS_CONTRIBUTION = 1250; // ₹1,250/month (8.33% of ₹15,000)
export const MAX_EMPLOYEE_PF = 1800; // ₹1,800/month (12% of ₹15,000)

/**
 * EPF Tax Threshold
 */
export const EPF_TAXABLE_THRESHOLD = 250000; // ₹2.5L annual employee contribution threshold

// ============================================
// GRATUITY CONSTANTS
// ============================================

/**
 * Gratuity Formula Multiplier
 */
export const GRATUITY_FORMULA_MULTIPLIER = 15;
export const GRATUITY_DIVISOR = 26;

/**
 * Gratuity Tax Exemption Limits
 */
export const GRATUITY_EXEMPTION_GOVT = 2500000; // ₹25 Lakhs (Government Employees - Jan 2024)
export const GRATUITY_EXEMPTION_PRIVATE = 2000000; // ₹20 Lakhs (Private Sector Employees)

/**
 * Gratuity Rounding Rule
 */
export const GRATUITY_ROUNDING_MONTHS = 6; // If service > 6 months, round up to next year

// ============================================
// LEAVE ENCASHMENT
// ============================================

export const LEAVE_ENCASHMENT_EXEMPTION = 2500000; // ₹25 Lakhs (Budget 2023 for non-govt)

// ============================================
// NPS CONSTANTS
// ============================================

/**
 * NPS Default Return Rate
 */
export const NPS_DEFAULT_RETURN = 0.10; // 10% annual return

/**
 * NPS Withdrawal Percentages
 */
export const NPS_LUMP_SUM_PERCENT = 0.60; // 60% can be withdrawn as lump sum (tax-free)
export const NPS_ANNUITY_PERCENT = 0.40; // 40% must go to annuity (taxable)
export const NPS_EARLY_EXIT_LUMP_SUM_PERCENT = 0.20; // 20% lump sum for early exit
export const NPS_EARLY_EXIT_ANNUITY_PERCENT = 0.80; // 80% annuity for early exit

/**
 * NPS Small Corpus Threshold
 */
export const NPS_SMALL_CORPUS_THRESHOLD = 500000; // ₹5 Lakhs - if corpus < this, 100% withdrawal allowed

/**
 * NPS Employer Contribution Limits (Budget 2024 Update)
 * New Regime: 14% for Private Sector (matching Central Govt)
 * Old Regime: 14% for Central Govt, 10% for Private
 */
export const NPS_80CCD2_CENTRAL_GOVT = 0.14; // 14% of salary (both regimes)
export const NPS_80CCD2_PRIVATE_OLD = 0.10; // 10% of salary (Old Regime only)
export const NPS_80CCD2_PRIVATE_NEW = 0.14; // 14% of salary (New Regime - Budget 2024)

/**
 * NPS Partial Withdrawal
 */
export const NPS_PARTIAL_WITHDRAWAL_PERCENT = 0.25; // 25% of own contribution (after 3 years)
export const NPS_PARTIAL_WITHDRAWAL_MIN_YEARS = 3; // Minimum years for partial withdrawal

/**
 * NPS Normal Exit Age
 */
export const NPS_NORMAL_EXIT_AGE = 60; // Normal exit at age 60

// ============================================
// PROFESSIONAL TAX
// ============================================

export const DEFAULT_PROFESSIONAL_TAX = 200; // ₹200/month (default, varies by state)

// ============================================
// RETIREMENT PLANNING DEFAULTS
// ============================================

export const DEFAULT_LIFE_EXPECTANCY = 85; // Default life expectancy
export const DEFAULT_INFLATION_RATE = 0.06; // 6% default inflation
export const DEFAULT_SAFE_WITHDRAWAL_RATE = 0.04; // 4% rule

// ============================================
// INVESTMENT & TDS CONSTANTS
// ============================================

/**
 * TDS Thresholds (FD/RD Interest)
 */
export const TDS_THRESHOLD_GENERAL = 40000; // ₹40,000/year (General)
export const TDS_THRESHOLD_SENIOR = 50000; // ₹50,000/year (Senior Citizens)
export const TDS_RATE = 0.10; // 10% TDS rate

// ============================================
// SALARY GROWTH DEFAULTS
// ============================================

export const DEFAULT_SALARY_HIKE = 0.10; // 10% default annual hike

// ============================================
// HRA CALCULATION CONSTANTS
// ============================================

export const HRA_METRO_PERCENT = 0.50; // 50% of basic (Metro cities)
export const HRA_NON_METRO_PERCENT = 0.40; // 40% of basic (Non-metro cities)
export const HRA_BASIC_PERCENT = 0.10; // 10% of basic (for rent calculation)

