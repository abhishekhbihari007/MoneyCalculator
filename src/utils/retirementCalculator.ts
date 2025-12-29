/**
 * Indian Retirement & Benefits Calculator Utility (FY 2024-25)
 * Handles EPF, Gratuity, NPS, and Retirement Planning calculations
 */

export interface EPFInput {
  basicSalary: number; // Monthly basic salary
  da?: number; // Dearness Allowance (monthly)
  currentAge: number;
  retirementAge: number;
  currentEPFBalance?: number; // Existing EPF balance
  interestRate?: number; // EPF interest rate (default 8.25%)
  voluntaryPF?: boolean; // If true, no wage ceiling
}

export interface EPFResult {
  monthlyEmployeeContribution: number;
  monthlyEmployerEPF: number;
  monthlyEmployerEPS: number;
  monthlyTotalContribution: number;
  annualEmployeeContribution: number;
  annualEmployerContribution: number;
  yearsToRetirement: number;
  totalContributions: number;
  totalInterest: number;
  finalCorpus: number;
  taxableCorpus: number; // If employee contribution > ₹2.5L/year
  nonTaxableCorpus: number;
  yearWiseBreakdown: Array<{
    year: number;
    openingBalance: number;
    employeeContribution: number;
    employerContribution: number;
    interest: number;
    closingBalance: number;
  }>;
}

// Import constants from centralized source
import {
  EPF_INTEREST_RATE,
  EPF_EMPLOYEE_PERCENT,
  EPF_EMPLOYER_PERCENT,
  EPS_PERCENT,
  EPF_PERCENT,
  EPS_WAGE_CEILING,
  MAX_EPS_CONTRIBUTION,
  EPF_TAXABLE_THRESHOLD as TAXABLE_THRESHOLD,
  GRATUITY_FORMULA_MULTIPLIER,
  GRATUITY_DIVISOR,
  GRATUITY_EXEMPTION_GOVT,
  GRATUITY_EXEMPTION_PRIVATE,
  GRATUITY_ROUNDING_MONTHS,
  LEAVE_ENCASHMENT_EXEMPTION,
  NPS_DEFAULT_RETURN,
  NPS_LUMP_SUM_PERCENT,
  NPS_ANNUITY_PERCENT,
  NPS_EARLY_EXIT_LUMP_SUM_PERCENT,
  NPS_EARLY_EXIT_ANNUITY_PERCENT,
  NPS_SMALL_CORPUS_THRESHOLD,
  NPS_80CCD1B_LIMIT,
  NPS_80CCD2_CENTRAL_GOVT,
  NPS_80CCD2_PRIVATE_OLD,
  NPS_80CCD2_PRIVATE_NEW,
  NPS_PARTIAL_WITHDRAWAL_PERCENT,
  NPS_PARTIAL_WITHDRAWAL_MIN_YEARS,
  NPS_NORMAL_EXIT_AGE,
  DEFAULT_LIFE_EXPECTANCY,
  DEFAULT_INFLATION_RATE,
  DEFAULT_SAFE_WITHDRAWAL_RATE,
} from './tax-constants';

/**
 * Calculate EPF Accumulation
 */
export function calculateEPF(input: EPFInput): EPFResult {
  const basic = input.basicSalary;
  const da = input.da || 0;
  const salary = basic + da;
  const interestRate = input.interestRate || EPF_INTEREST_RATE;
  const yearsToRetirement = input.retirementAge - input.currentAge;

  // Calculate monthly contributions
  let monthlyEmployeeContribution: number;
  let monthlyEmployerEPF: number;
  let monthlyEmployerEPS: number;

  if (input.voluntaryPF) {
    // No wage ceiling
    monthlyEmployeeContribution = Math.round(salary * EPF_EMPLOYEE_PERCENT);
    const employerTotal = Math.round(salary * EPF_EMPLOYER_PERCENT);
    monthlyEmployerEPS = Math.round(employerTotal * EPS_PERCENT);
    monthlyEmployerEPF = employerTotal - monthlyEmployerEPS;
  } else {
    // Apply wage ceiling
    const pfBase = Math.min(salary, EPS_WAGE_CEILING);
    monthlyEmployeeContribution = Math.round(pfBase * EPF_EMPLOYEE_PERCENT);
    const employerTotal = Math.round(pfBase * EPF_EMPLOYER_PERCENT);
    monthlyEmployerEPS = Math.min(Math.round(employerTotal * EPS_PERCENT), MAX_EPS_CONTRIBUTION);
    monthlyEmployerEPF = employerTotal - monthlyEmployerEPS;
  }

  const monthlyTotalContribution = monthlyEmployeeContribution + monthlyEmployerEPF;
  const annualEmployeeContribution = monthlyEmployeeContribution * 12;
  const annualEmployerContribution = monthlyEmployerEPF * 12;

  // Year-wise calculation
  let balance = input.currentEPFBalance || 0;
  const yearWiseBreakdown: EPFResult['yearWiseBreakdown'] = [];
  let totalContributions = 0;
  let totalInterest = 0;
  let taxableContributions = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const openingBalance = balance;
    const employeeYearly = annualEmployeeContribution;
    const employerYearly = annualEmployerContribution;
    
    // Track taxable contributions (employee contribution > ₹2.5L/year)
    if (employeeYearly > TAXABLE_THRESHOLD) {
      taxableContributions += (employeeYearly - TAXABLE_THRESHOLD);
    }

    // Interest is calculated on opening balance + contributions
    const interest = Math.round((openingBalance + employeeYearly + employerYearly) * interestRate);
    balance = openingBalance + employeeYearly + employerYearly + interest;

    totalContributions += (employeeYearly + employerYearly);
    totalInterest += interest;

    yearWiseBreakdown.push({
      year: input.currentAge + year,
      openingBalance,
      employeeContribution: employeeYearly,
      employerContribution: employerYearly,
      interest,
      closingBalance: balance,
    });
  }

  // Calculate taxable vs non-taxable corpus
  // If employee contribution exceeds ₹2.5L/year, interest on excess is taxable
  const taxableCorpus = taxableContributions > 0 
    ? Math.round(taxableContributions * (1 + interestRate) ** yearsToRetirement)
    : 0;
  const nonTaxableCorpus = balance - taxableCorpus;

  return {
    monthlyEmployeeContribution,
    monthlyEmployerEPF,
    monthlyEmployerEPS,
    monthlyTotalContribution,
    annualEmployeeContribution,
    annualEmployerContribution,
    yearsToRetirement,
    totalContributions,
    totalInterest,
    finalCorpus: balance,
    taxableCorpus,
    nonTaxableCorpus,
    yearWiseBreakdown,
  };
}

export interface GratuityInput {
  lastDrawnSalary: number; // Basic + DA
  yearsOfService: number;
  monthsOfService?: number; // Additional months in last year
  isGovernmentEmployee?: boolean;
}

export interface GratuityResult {
  eligibleYears: number;
  gratuityAmount: number;
  taxExemptAmount: number;
  taxableAmount: number;
  finalGratuity: number;
  isEligible: boolean; // Must have > 5 years
}

export interface LeaveEncashmentResult {
  leaveEncashmentAmount: number;
  taxExemptAmount: number; // ₹25 Lakhs (Budget 2023)
  taxableAmount: number;
}

// Constants
// All Gratuity constants imported from tax-constants

/**
 * Calculate Gratuity
 * Eligibility: > 5 Years continuous service
 * Formula: (15 * Last Drawn Basic & DA * Tenure Years) / 26
 * Rounding: If months > 6, round up year
 */
export function calculateGratuity(input: GratuityInput): GratuityResult {
  // Check eligibility: Must have > 5 years
  const isEligible = input.yearsOfService > 5;
  
  if (!isEligible) {
    return {
      eligibleYears: input.yearsOfService,
      gratuityAmount: 0,
      taxExemptAmount: 0,
      taxableAmount: 0,
      finalGratuity: 0,
      isEligible: false,
    };
  }

  // Round up if more than 6 months in last year
  let eligibleYears = Math.floor(input.yearsOfService);
  if (input.monthsOfService && input.monthsOfService > GRATUITY_ROUNDING_MONTHS) {
    eligibleYears += 1;
  }

  // Formula: (GRATUITY_FORMULA_MULTIPLIER * Last Drawn Salary * Years) / GRATUITY_DIVISOR
  const gratuityAmount = Math.round(
    (GRATUITY_FORMULA_MULTIPLIER * input.lastDrawnSalary * eligibleYears) / GRATUITY_DIVISOR
  );

  // Tax exemption limit
  // Government Employees: ₹25 Lakhs
  // Private Sector: ₹20 Lakhs
  const exemptionLimit = input.isGovernmentEmployee 
    ? GRATUITY_EXEMPTION_GOVT 
    : GRATUITY_EXEMPTION_PRIVATE;

  const taxExemptAmount = Math.min(gratuityAmount, exemptionLimit);
  const taxableAmount = Math.max(0, gratuityAmount - exemptionLimit);
  const finalGratuity = gratuityAmount; // Total gratuity (tax will be calculated separately)

  return {
    eligibleYears,
    gratuityAmount,
    taxExemptAmount,
    taxableAmount,
    finalGratuity,
    isEligible: true,
  };
}

// Constants for Leave Encashment
// LEAVE_ENCASHMENT_EXEMPTION imported from tax-constants

/**
 * Calculate Leave Encashment Tax Exemption
 * Exemption Limit: ₹25 Lakhs (Hiked in Budget 2023 for non-govt)
 */
export function calculateLeaveEncashment(leaveEncashmentAmount: number): LeaveEncashmentResult {
  const taxExemptAmount = Math.min(leaveEncashmentAmount, LEAVE_ENCASHMENT_EXEMPTION);
  const taxableAmount = Math.max(0, leaveEncashmentAmount - LEAVE_ENCASHMENT_EXEMPTION);

  return {
    leaveEncashmentAmount,
    taxExemptAmount,
    taxableAmount,
  };
}

export interface NPSInput {
  employeeContribution: number; // Monthly Tier-I contribution
  employerContribution?: number; // Monthly employer contribution
  currentAge: number;
  retirementAge: number;
  expectedReturn?: number; // Annual return rate (default 10%)
  currentBalance?: number; // Existing NPS balance
  isCentralGovt?: boolean; // For 80CCD(2) limit in Old Regime
  taxRegime?: 'OLD' | 'NEW'; // Tax regime selection (affects employer contribution limit - Budget 2024)
  exitAge?: number; // If exiting before retirement age (for early exit calculation)
  basicSalary?: number; // Basic salary for calculating 80CCD(2) limit
  da?: number; // Dearness Allowance
}

export interface NPSResult {
  monthlyEmployeeContribution: number;
  monthlyEmployerContribution: number;
  annualEmployeeContribution: number;
  annualEmployerContribution: number;
  yearsToRetirement: number;
  totalContributions: number;
  totalReturns: number;
  finalCorpus: number;
  // Withdrawal options
  maxLumpSum: number; // 60% of corpus (tax-free)
  minAnnuity: number; // 40% of corpus (pension, taxable)
  earlyExitLumpSum?: number; // 20% of corpus (early exit)
  earlyExitAnnuity?: number; // 80% of corpus (early exit)
  maxPartialWithdrawal: number; // 25% of own contribution (after 3 years)
  isEarlyExit: boolean;
  // Tax benefits
  taxBenefit80CCD1B: number; // Up to ₹50,000 (Old Regime only)
  taxBenefit80CCD2: number; // Employer contribution (up to 14% or 10% of salary)
  yearWiseBreakdown: Array<{
    year: number;
    openingBalance: number;
    employeeContribution: number;
    employerContribution: number;
    returns: number;
    closingBalance: number;
    ownContributionTotal: number; // Cumulative employee contribution for partial withdrawal calculation
  }>;
}

// Constants
// All NPS constants imported from tax-constants

/**
 * Calculate NPS Wealth Builder
 */
export function calculateNPS(input: NPSInput): NPSResult {
  const monthlyEmployeeContribution = input.employeeContribution;
  const monthlyEmployerContribution = input.employerContribution || 0;
  const annualEmployeeContribution = monthlyEmployeeContribution * 12;
  const annualEmployerContribution = monthlyEmployerContribution * 12;
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const expectedReturn = input.expectedReturn || NPS_DEFAULT_RETURN;

  // Year-wise calculation
  let balance = input.currentBalance || 0;
  const yearWiseBreakdown: NPSResult['yearWiseBreakdown'] = [];
  let totalContributions = 0;
  let totalReturns = 0;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const openingBalance = balance;
    const employeeYearly = annualEmployeeContribution;
    const employerYearly = annualEmployerContribution;
    
    // Returns calculated on opening balance + contributions
    const returns = Math.round((openingBalance + employeeYearly + employerYearly) * expectedReturn);
    balance = openingBalance + employeeYearly + employerYearly + returns;

    totalContributions += (employeeYearly + employerYearly);
    totalReturns += returns;

    // Track own contribution total for partial withdrawal
    const ownContributionTotal = (yearWiseBreakdown[year - 2]?.ownContributionTotal || 0) + employeeYearly;

    yearWiseBreakdown.push({
      year: input.currentAge + year,
      openingBalance,
      employeeContribution: employeeYearly,
      employerContribution: employerYearly,
      returns,
      closingBalance: balance,
      ownContributionTotal,
    });
  }

  // Check if early exit
  const isEarlyExit = input.exitAge && input.exitAge < input.retirementAge;
  const actualExitAge = input.exitAge || input.retirementAge;
  const isNormalExit = actualExitAge >= NPS_NORMAL_EXIT_AGE;

  // Withdrawal options
  let maxLumpSum: number;
  let minAnnuity: number;
  let earlyExitLumpSum: number | undefined;
  let earlyExitAnnuity: number | undefined;
  let maxPartialWithdrawal: number | undefined;

  if (balance < NPS_SMALL_CORPUS_THRESHOLD) {
    // If corpus < ₹5L, 100% withdrawal allowed
    maxLumpSum = balance;
    minAnnuity = 0;
  } else if (isEarlyExit && !isNormalExit) {
    // Early Exit (Before 60): Only 20% Lump Sum allowed (Tax-Free), 80% must go to Annuity
    earlyExitLumpSum = Math.round(balance * NPS_EARLY_EXIT_LUMP_SUM_PERCENT);
    earlyExitAnnuity = Math.round(balance * NPS_EARLY_EXIT_ANNUITY_PERCENT);
    // For normal exit, still calculate
    maxLumpSum = Math.round(balance * NPS_LUMP_SUM_PERCENT);
    minAnnuity = Math.round(balance * NPS_ANNUITY_PERCENT);
  } else {
    // Normal Exit at 60: 60% Lump Sum (Tax-Free), 40% Annuity (Taxable)
    maxLumpSum = Math.round(balance * NPS_LUMP_SUM_PERCENT);
    minAnnuity = Math.round(balance * NPS_ANNUITY_PERCENT);
  }

  // Partial Withdrawal: Max 25% of "Own Contribution" (Not Total Corpus) allowed after 3 years
  // Get total own contribution from the last year's breakdown
  const totalOwnContribution = yearWiseBreakdown.length > 0 
    ? yearWiseBreakdown[yearWiseBreakdown.length - 1].ownContributionTotal || 0
    : 0;
  
  if (yearsToRetirement >= NPS_PARTIAL_WITHDRAWAL_MIN_YEARS) {
    maxPartialWithdrawal = Math.round(totalOwnContribution * NPS_PARTIAL_WITHDRAWAL_PERCENT);
  }

  // Tax benefits
  const taxBenefit80CCD1B = Math.min(annualEmployeeContribution, NPS_80CCD1B_LIMIT);
  
  // For 80CCD(2), calculate based on salary (Basic + DA)
  // Budget 2024 Update: New Regime - 14% for Private Sector (matching Central Govt)
  // Old Regime: 14% for Central Govt, 10% for Private
  const taxRegime = input.taxRegime || 'OLD'; // Default to OLD if not specified
  const basicSalary = input.basicSalary || 0;
  const da = input.da || 0;
  const annualSalary = (basicSalary + da) * 12;
  
  let ccd2Limit: number;
  if (input.isCentralGovt) {
    // Central Govt: 14% in both regimes
    ccd2Limit = annualSalary * NPS_80CCD2_CENTRAL_GOVT;
  } else {
    // Private Sector: 14% in New Regime, 10% in Old Regime (Budget 2024 Update)
    if (taxRegime === 'NEW') {
      ccd2Limit = annualSalary * NPS_80CCD2_PRIVATE_NEW; // 14% (Budget 2024)
    } else {
      ccd2Limit = annualSalary * NPS_80CCD2_PRIVATE_OLD; // 10% (Old Regime)
    }
  }
  
  const taxBenefit80CCD2 = Math.min(annualEmployerContribution, ccd2Limit);

  return {
    monthlyEmployeeContribution,
    monthlyEmployerContribution,
    annualEmployeeContribution,
    annualEmployerContribution,
    yearsToRetirement,
    totalContributions,
    totalReturns,
    finalCorpus: balance,
    maxLumpSum,
    minAnnuity,
    earlyExitLumpSum,
    earlyExitAnnuity,
    maxPartialWithdrawal,
    isEarlyExit: isEarlyExit || false,
    taxBenefit80CCD1B,
    taxBenefit80CCD2,
    yearWiseBreakdown,
  };
}

/**
 * Get NPS Employer Contribution Limit based on Tax Regime
 * Budget 2024 Update: New Regime - 14% for Private Sector (matching Central Govt)
 * Old Regime: 14% for Central Govt, 10% for Private
 * 
 * This is a helper function for UI to display the correct limit based on regime selection
 * Pro-Tip: When user selects "New Regime" in Tax Regime Picker, automatically switch NPS limit to 14%
 */
export function getNPSEmployerContributionLimit(
  taxRegime: 'OLD' | 'NEW',
  isCentralGovt: boolean,
  annualSalary: number
): number {
  if (isCentralGovt) {
    // Central Govt: 14% in both regimes
    return Math.round(annualSalary * NPS_80CCD2_CENTRAL_GOVT);
  } else {
    // Private Sector
    if (taxRegime === 'NEW') {
      // Budget 2024: 14% for Private Sector in New Regime
      return Math.round(annualSalary * NPS_80CCD2_PRIVATE_NEW);
    } else {
      // Old Regime: 10% for Private Sector
      return Math.round(annualSalary * NPS_80CCD2_PRIVATE_OLD);
    }
  }
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy?: number; // Default 85
  currentSavings?: number; // Existing savings/corpus
  monthlySavings?: number; // Current monthly savings/investments
  currentMonthlyExpense: number; // Current monthly expenses
  inflationRate?: number; // Annual inflation rate (default 6%)
  preRetirementReturn: number; // Pre-retirement investment return rate
  postRetirementReturn: number; // Post-retirement safe asset return rate
  safeWithdrawalRate?: number; // Default 4% (alternative to real rate method)
}

export interface RetirementResult {
  yearsToRetirement: number;
  lifeExpectancy: number;
  // Step 1: Future Expense Calculation
  futureMonthlyExpense: number; // Monthly expense at retirement age
  futureAnnualExpense: number; // Annual expense at retirement age
  // Step 2: Real Rate of Return (Post-Retirement)
  realReturnRate: number; // ((1 + Post_Ret_Return) / (1 + Inflation)) - 1
  // Step 3: Corpus Required (Present Value of annuity at retirement)
  requiredCorpus: number; // Corpus needed at retirement age
  // Step 4: Monthly Investment Need (SIP to reach corpus)
  monthlyInvestmentNeeded: number; // SIP amount needed today
  // Existing savings projection
  futureValueOfCurrentSavings: number;
  futureValueOfMonthlySavings: number;
  totalCorpusAtRetirement: number;
  // Gap analysis
  corpusGap: number;
  // Year-wise projection
  yearWiseProjection: Array<{
    year: number;
    age: number;
    openingBalance: number;
    monthlySavings: number;
    returns: number;
    closingBalance: number;
    requiredCorpus: number;
    gap: number;
    futureExpense: number; // Expense at this point in future
  }>;
}

// Constants
// DEFAULT_SAFE_WITHDRAWAL_RATE imported from tax-constants

/**
 * Calculate Retirement Planning (FIRE Calculator)
 * Standard Financial Planning Model:
 * Step 1: Future Expense at Retirement Age (FV = PV * (1 + inflation)^years)
 * Step 2: Real Rate of Return (Post-Retirement) (r = ((1 + Post_Ret_Return) / (1 + Inflation)) - 1)
 * Step 3: Corpus Required (PV of annuity at retirement age)
 * Step 4: Monthly Investment Need (SIP to reach corpus)
 */
export function calculateRetirement(input: RetirementInput): RetirementResult {
  const yearsToRetirement = input.retirementAge - input.currentAge;
  const lifeExpectancy = input.lifeExpectancy || 85;
  const yearsInRetirement = lifeExpectancy - input.retirementAge;
  const preRetirementReturn = input.preRetirementReturn;
  const postRetirementReturn = input.postRetirementReturn;
  const inflationRate = input.inflationRate || DEFAULT_INFLATION_RATE;
  const currentSavings = input.currentSavings || 0;
  const monthlySavings = input.monthlySavings || 0;

  // Step 1: Future Expense Calculation
  // FV = PV * (1 + inflation)^years
  const futureMonthlyExpense = Math.round(
    input.currentMonthlyExpense * (1 + inflationRate) ** yearsToRetirement
  );
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Step 2: Real Rate of Return (Post-Retirement)
  // r = ((1 + Post_Ret_Return) / (1 + Inflation)) - 1
  const realReturnRate = (1 + postRetirementReturn) / (1 + inflationRate) - 1;

  // Step 3: Corpus Required
  // Calculate Present Value (at retirement age) of annuity needed for retirement years
  // Using Real Rate of Return
  // PV = PMT * [1 - (1 + r)^(-n)] / r
  // Where PMT = annual expense, r = real return rate, n = years in retirement
  let requiredCorpus: number;
  if (realReturnRate > 0) {
    requiredCorpus = Math.round(
      futureAnnualExpense * (1 - (1 + realReturnRate) ** (-yearsInRetirement)) / realReturnRate
    );
  } else {
    // If real return is 0 or negative, use simple multiplication
    requiredCorpus = Math.round(futureAnnualExpense * yearsInRetirement);
  }

  // Step 4: Monthly Investment Need (SIP to reach corpus)
  // Reverse SIP calculation: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
  // Solve for P: P = FV / ([((1 + r)^n - 1) / r] * (1 + r))
  const monthlyReturn = preRetirementReturn / 12;
  const totalMonths = yearsToRetirement * 12;
  
  let monthlyInvestmentNeeded = 0;
  if (monthlyReturn > 0) {
    const sipFactor = (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn) * (1 + monthlyReturn);
    monthlyInvestmentNeeded = Math.round(requiredCorpus / sipFactor);
  } else {
    monthlyInvestmentNeeded = Math.round(requiredCorpus / totalMonths);
  }

  // Project existing savings
  const futureValueOfCurrentSavings = Math.round(
    currentSavings * (1 + preRetirementReturn) ** yearsToRetirement
  );

  // Future value of current monthly savings (if any)
  let futureValueOfMonthlySavings = 0;
  if (monthlySavings > 0 && monthlyReturn > 0) {
    futureValueOfMonthlySavings = Math.round(
      monthlySavings * 
      (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn) * 
      (1 + monthlyReturn)
    );
  } else if (monthlySavings > 0) {
    futureValueOfMonthlySavings = monthlySavings * totalMonths;
  }

  const totalCorpusAtRetirement = futureValueOfCurrentSavings + futureValueOfMonthlySavings;

  // Gap analysis
  const corpusGap = requiredCorpus - totalCorpusAtRetirement;

  // Year-wise projection
  const yearWiseProjection: RetirementResult['yearWiseProjection'] = [];
  let balance = currentSavings;
  const annualSavings = monthlySavings * 12;

  for (let year = 1; year <= yearsToRetirement; year++) {
    const openingBalance = balance;
    const returns = Math.round(balance * preRetirementReturn);
    balance = openingBalance + annualSavings + returns;

    // Calculate future expense and required corpus for this year
    const yearsRemaining = yearsToRetirement - year;
    const futureExpense = Math.round(
      input.currentMonthlyExpense * (1 + inflationRate) ** yearsRemaining
    );
    
    // Calculate required corpus using real return rate
    const yearsInRetirementRemaining = yearsInRetirement + yearsRemaining;
    let requiredCorpusForYear: number;
    if (realReturnRate > 0) {
      requiredCorpusForYear = Math.round(
        (futureExpense * 12) * (1 - (1 + realReturnRate) ** (-yearsInRetirementRemaining)) / realReturnRate
      );
    } else {
      requiredCorpusForYear = Math.round((futureExpense * 12) * yearsInRetirementRemaining);
    }
    
    const gap = requiredCorpusForYear - balance;

    yearWiseProjection.push({
      year,
      age: input.currentAge + year,
      openingBalance,
      monthlySavings: annualSavings,
      returns,
      closingBalance: balance,
      requiredCorpus: requiredCorpusForYear,
      gap,
      futureExpense,
    });
  }

  return {
    yearsToRetirement,
    lifeExpectancy,
    futureMonthlyExpense,
    futureAnnualExpense,
    realReturnRate,
    requiredCorpus,
    monthlyInvestmentNeeded,
    futureValueOfCurrentSavings,
    futureValueOfMonthlySavings,
    totalCorpusAtRetirement,
    corpusGap,
    yearWiseProjection,
  };
}

