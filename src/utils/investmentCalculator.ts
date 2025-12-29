/**
 * Indian Investment & Growth Calculator Utility (FY 2024-25)
 * Handles SIP, RD, FD, and Salary Growth calculations
 */

export interface SIPInput {
  monthlyInvestment: number;
  annualReturn: number; // Expected annual return rate
  years: number;
  investmentType?: 'advance' | 'arrear'; // Advance = start of month, Arrear = end of month
}

export interface SIPResult {
  totalInvested: number;
  totalReturns: number;
  finalCorpus: number;
  absoluteReturns: number; // Percentage returns
  yearWiseBreakdown: Array<{
    year: number;
    openingBalance: number;
    monthlyInvestment: number;
    returns: number;
    closingBalance: number;
  }>;
}

/**
 * Calculate SIP Growth
 * Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r) for advance SIP
 * Formula: FV = P * [((1 + r)^n - 1) / r] for arrear SIP
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const monthlyInvestment = input.monthlyInvestment;
  const annualReturn = input.annualReturn;
  const years = input.years;
  const investmentType = input.investmentType || 'advance';
  
  const monthlyReturn = annualReturn / 12;
  const totalMonths = years * 12;
  const totalInvested = monthlyInvestment * totalMonths;

  let finalCorpus: number;
  
  if (investmentType === 'advance') {
    // Investment at start of month
    finalCorpus = Math.round(
      monthlyInvestment * 
      (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn) * 
      (1 + monthlyReturn)
    );
  } else {
    // Investment at end of month
    finalCorpus = Math.round(
      monthlyInvestment * 
      (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn)
    );
  }

  const totalReturns = finalCorpus - totalInvested;
  const absoluteReturns = (totalReturns / totalInvested) * 100;

  // Year-wise breakdown
  const yearWiseBreakdown: SIPResult['yearWiseBreakdown'] = [];
  let balance = 0;

  for (let year = 1; year <= years; year++) {
    const openingBalance = balance;
    const yearInvestment = monthlyInvestment * 12;
    
    // Calculate returns for the year
    let yearBalance = openingBalance;
    for (let month = 1; month <= 12; month++) {
      if (investmentType === 'advance') {
        yearBalance = (yearBalance + monthlyInvestment) * (1 + monthlyReturn);
      } else {
        yearBalance = yearBalance * (1 + monthlyReturn) + monthlyInvestment;
      }
    }
    
    const returns = yearBalance - openingBalance - yearInvestment;
    balance = yearBalance;

    yearWiseBreakdown.push({
      year,
      openingBalance,
      monthlyInvestment: yearInvestment,
      returns: Math.round(returns),
      closingBalance: Math.round(balance),
    });
  }

  return {
    totalInvested,
    totalReturns,
    finalCorpus,
    absoluteReturns,
    yearWiseBreakdown,
  };
}

export interface RDInput {
  monthlyDeposit: number;
  interestRate: number; // Annual interest rate
  tenure: number; // Tenure in months
  compoundingFrequency?: 'quarterly' | 'monthly'; // Default quarterly
  isSeniorCitizen?: boolean;
}

export interface RDResult {
  totalDeposited: number;
  totalInterest: number;
  maturityAmount: number;
  tdsDeducted: number; // If interest > ₹40,000 (general) or ₹50,000 (senior)
  tdsApplicable: boolean; // Flag if TDS is applicable
  isSeniorCitizen: boolean;
  yearWiseBreakdown: Array<{
    year: number;
    openingBalance: number;
    deposits: number;
    interest: number;
    closingBalance: number;
  }>;
}

// Constants
// TDS_THRESHOLD_GENERAL imported from tax-constants
// Import constants from centralized source
import {
  TDS_THRESHOLD_GENERAL,
  TDS_THRESHOLD_SENIOR,
  TDS_RATE,
} from './tax-constants';

/**
 * Calculate RD (Recurring Deposit)
 * RD is typically compounded quarterly in India
 */
export function calculateRD(input: RDInput): RDResult {
  const monthlyDeposit = input.monthlyDeposit;
  const annualRate = input.interestRate;
  const tenure = input.tenure;
  const compoundingFrequency = input.compoundingFrequency || 'quarterly';
  const isSeniorCitizen = input.isSeniorCitizen || false;

  const totalDeposited = monthlyDeposit * tenure;

  // Calculate quarterly rate and periods
  const quarterlyRate = annualRate / 4;
  const totalQuarters = Math.ceil(tenure / 3);

  let balance = 0;
  const yearWiseBreakdown: RDResult['yearWiseBreakdown'] = [];
  let totalInterest = 0;

  // RD calculation: Deposits accumulate and interest is compounded quarterly
  for (let quarter = 1; quarter <= totalQuarters; quarter++) {
    const monthsInQuarter = Math.min(3, tenure - (quarter - 1) * 3);
    const depositsInQuarter = monthlyDeposit * monthsInQuarter;
    
    balance += depositsInQuarter;
    
    // Interest is compounded quarterly
    const interest = Math.round(balance * quarterlyRate);
    balance += interest;
    totalInterest += interest;

    // Track yearly breakdown
    if (quarter % 4 === 0 || quarter === totalQuarters) {
      const year = Math.ceil(quarter / 4);
      yearWiseBreakdown.push({
        year,
        openingBalance: balance - depositsInQuarter - interest,
        deposits: depositsInQuarter,
        interest,
        closingBalance: balance,
      });
    }
  }

  const maturityAmount = balance;
  const tdsThreshold = isSeniorCitizen ? TDS_THRESHOLD_SENIOR : TDS_THRESHOLD_GENERAL;
  const tdsApplicable = totalInterest > tdsThreshold;
  const tdsDeducted = tdsApplicable
    ? Math.round((totalInterest - tdsThreshold) * TDS_RATE) 
    : 0;

  return {
    totalDeposited,
    totalInterest,
    maturityAmount,
    tdsDeducted,
    tdsApplicable,
    isSeniorCitizen,
    yearWiseBreakdown,
  };
}

export interface FDInput {
  principal: number;
  interestRate: number; // Annual interest rate
  tenure: number; // Tenure in months
  compoundingFrequency?: 'quarterly' | 'monthly' | 'yearly'; // Default quarterly
  isSeniorCitizen?: boolean;
}

export interface FDResult {
  principal: number;
  totalInterest: number;
  maturityAmount: number;
  tdsDeducted: number;
  tdsApplicable: boolean; // Flag if TDS is applicable
  netMaturityAmount: number; // After TDS
  effectiveReturn: number; // After TDS
  isSeniorCitizen: boolean;
  yearWiseBreakdown: Array<{
    year: number;
    openingBalance: number;
    interest: number;
    closingBalance: number;
  }>;
}

/**
 * Calculate FD (Fixed Deposit)
 * FDs in India are typically compounded quarterly
 */
export function calculateFD(input: FDInput): FDResult {
  const principal = input.principal;
  const annualRate = input.interestRate;
  const tenure = input.tenure;
  const compoundingFrequency = input.compoundingFrequency || 'quarterly';
  const isSeniorCitizen = input.isSeniorCitizen || false;

  // Calculate compounding periods
  let periodsPerYear: number;
  let ratePerPeriod: number;
  let totalPeriods: number;

  if (compoundingFrequency === 'quarterly') {
    periodsPerYear = 4;
    ratePerPeriod = annualRate / 4;
    totalPeriods = Math.ceil(tenure / 3);
  } else if (compoundingFrequency === 'monthly') {
    periodsPerYear = 12;
    ratePerPeriod = annualRate / 12;
    totalPeriods = tenure;
  } else {
    periodsPerYear = 1;
    ratePerPeriod = annualRate;
    totalPeriods = Math.ceil(tenure / 12);
  }

  // Calculate maturity amount: A = P * (1 + r)^n
  const maturityAmount = Math.round(principal * (1 + ratePerPeriod) ** totalPeriods);
  const totalInterest = maturityAmount - principal;

  // TDS calculation
  // TDS Rule: If Interest > ₹40,000/yr (General) or ₹50,000/yr (Senior Citizen), flag as "TDS Deductible"
  const tdsThreshold = isSeniorCitizen ? TDS_THRESHOLD_SENIOR : TDS_THRESHOLD_GENERAL;
  const tdsApplicable = totalInterest > tdsThreshold;
  const tdsDeducted = tdsApplicable
    ? Math.round((totalInterest - tdsThreshold) * TDS_RATE) 
    : 0;

  const netMaturityAmount = maturityAmount - tdsDeducted;
  const effectiveReturn = ((netMaturityAmount - principal) / principal) * 100;

  // Year-wise breakdown
  const yearWiseBreakdown: FDResult['yearWiseBreakdown'] = [];
  let balance = principal;

  for (let year = 1; year <= Math.ceil(tenure / 12); year++) {
    const openingBalance = balance;
    const periodsThisYear = Math.min(periodsPerYear, totalPeriods - (year - 1) * periodsPerYear);
    
    for (let period = 0; period < periodsThisYear; period++) {
      balance = balance * (1 + ratePerPeriod);
    }
    
    const interest = balance - openingBalance;

    yearWiseBreakdown.push({
      year,
      openingBalance,
      interest: Math.round(interest),
      closingBalance: Math.round(balance),
    });
  }

  return {
    principal,
    totalInterest,
    maturityAmount,
    tdsDeducted,
    tdsApplicable,
    netMaturityAmount,
    effectiveReturn,
    isSeniorCitizen,
    yearWiseBreakdown,
  };
}

export interface SalaryGrowthInput {
  currentSalary: number; // Annual salary
  annualHike: number; // Annual hike percentage
  years: number;
  inflationRate?: number; // For real salary calculation (purchasing power)
  showRealValue?: boolean; // Toggle to show real value (purchasing power)
}

export interface SalaryGrowthResult {
  nominalSalary: number; // Final salary without inflation adjustment
  realSalary: number; // Final salary adjusted for inflation (purchasing power)
  totalGrowth: number; // Total salary growth over years (nominal)
  realGrowth: number; // Real growth after inflation (purchasing power)
  purchasingPowerMaintained: boolean; // Whether real salary >= current salary
  yearWiseBreakdown: Array<{
    year: number;
    age?: number; // Optional: if current age provided
    nominalSalary: number;
    realSalary: number; // Purchasing power adjusted
    hikeAmount: number;
    realHikeAmount: number; // Real hike after inflation
    purchasingPowerChange: number; // % change in purchasing power
  }>;
}

/**
 * Calculate Salary Growth
 * Logic: Current Salary * (1 + Hike%) ^ Years
 * Inflation Adjustment: Real Value = Future Salary / (1 + Inflation)^Years
 * Why: A ₹30L salary in 10 years is not the same as ₹30L today. Showing this makes your tool smarter.
 */
export function calculateSalaryGrowth(input: SalaryGrowthInput): SalaryGrowthResult {
  const currentSalary = input.currentSalary;
  const annualHike = input.annualHike;
  const years = input.years;
  const inflationRate = input.inflationRate || 0;
  const showRealValue = input.showRealValue !== false; // Default true

  // Calculate final salary using CAGR: Current Salary * (1 + Hike%) ^ Years
  const nominalSalary = currentSalary * (1 + annualHike / 100) ** years;

  // Real Value (Purchasing Power): Future Salary / (1 + Inflation)^Years
  const realSalary = showRealValue && inflationRate > 0
    ? nominalSalary / ((1 + inflationRate) ** years)
    : nominalSalary;

  const totalGrowth = nominalSalary - currentSalary;
  const realGrowth = realSalary - currentSalary;
  const purchasingPowerMaintained = realSalary >= currentSalary;

  // Year-wise breakdown
  const yearWiseBreakdown: SalaryGrowthResult['yearWiseBreakdown'] = [];
  let yearNominalSalary = currentSalary;

  for (let year = 1; year <= years; year++) {
    const previousNominal = yearNominalSalary;

    // Apply hike using CAGR: Salary * (1 + Hike%)
    const hikeAmount = previousNominal * (annualHike / 100);
    yearNominalSalary = previousNominal + hikeAmount;

    // Calculate real salary (purchasing power)
    const yearRealSalary = showRealValue && inflationRate > 0
      ? yearNominalSalary / ((1 + inflationRate) ** year)
      : yearNominalSalary;

    const previousReal = year > 1 
      ? yearWiseBreakdown[year - 2].realSalary 
      : currentSalary;
    const realHikeAmount = yearRealSalary - previousReal;

    // Calculate purchasing power change
    const purchasingPowerChange = year > 1
      ? ((yearRealSalary - previousReal) / previousReal) * 100
      : ((yearRealSalary - currentSalary) / currentSalary) * 100;

    yearWiseBreakdown.push({
      year,
      nominalSalary: Math.round(yearNominalSalary),
      realSalary: Math.round(yearRealSalary),
      hikeAmount: Math.round(hikeAmount),
      realHikeAmount: Math.round(realHikeAmount),
      purchasingPowerChange: Math.round(purchasingPowerChange * 100) / 100, // Round to 2 decimals
    });
  }

  return {
    nominalSalary: Math.round(nominalSalary),
    realSalary: Math.round(realSalary),
    totalGrowth: Math.round(totalGrowth),
    realGrowth: Math.round(realGrowth),
    purchasingPowerMaintained,
    yearWiseBreakdown,
  };
}

/**
 * Calculate Real Return Rate
 * Formula: (1 + Nominal Rate) / (1 + Inflation Rate) - 1
 */
export function calculateRealReturn(nominalRate: number, inflationRate: number): number {
  return ((1 + nominalRate) / (1 + inflationRate)) - 1;
}

/**
 * Check if year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

