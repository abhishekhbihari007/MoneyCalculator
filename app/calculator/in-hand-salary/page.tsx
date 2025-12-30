"use client";

import { useState, useEffect, useRef } from "react";
import { Calculator, ArrowLeft, DollarSign, Info, Lightbulb, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleLinks from "@/components/sections/ArticleLinks";
import { numberToWords } from "@/lib/numberToWords";

interface SalaryBreakdown {
  grossSalary: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  pfEmployee: number;
  pfEmployer: number;
  gratuity: number;
  esic: number;
  professionalTax: number;
  incomeTax: number;
  surcharge: number;
  cess: number;
  totalDeductions: number;
  netSalary: number;
  ctc: number;
  variablePay: number;
  fixedPay: number;
  taxableIncome: number;
  standardDeduction: number;
  section80C: number;
  section80D: number;
  hraExemption: number;
  taxWithoutExemptions: number;
  taxSavings: number;
}

export default function InHandSalaryCalculator() {
  const [ctc, setCtc] = useState<string>("");
  const [variablePay, setVariablePay] = useState<string>("");
  // Basic Percentage - adjustable via slider (30-50%)
  const [basicPercentage, setBasicPercentage] = useState<number>(50);
  const [hraOption, setHraOption] = useState<"40" | "50">("50");
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("new");
  const [age, setAge] = useState<string>("30");
  const [exemptionsEnabled, setExemptionsEnabled] = useState<boolean>(true);
  const [section80CInput, setSection80CInput] = useState<string>("");
  const [pfOption, setPfOption] = useState<"actual" | "fixed">("actual"); // PF toggle: actual 12% or fixed ₹1,800 (default actual - 12% of basic)
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const hasCalculatedRef = useRef<boolean>(false); // Track if calculation has been done at least once
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly"); // Monthly/Yearly view toggle (default monthly as per screenshot)
  const [hraExpanded, setHraExpanded] = useState<boolean>(false);
  const [epfExpanded, setEpfExpanded] = useState<boolean>(false);
  const [investmentsExpanded, setInvestmentsExpanded] = useState<boolean>(true); // Investments expanded by default like ET Money
  const [monthlyRent, setMonthlyRent] = useState<string>("");
  const [annualHRA, setAnnualHRA] = useState<string>("");

  // Helper function to handle number-only input
  const handleNumberInput = (value: string, setter: (value: string) => void, fieldName: string, isRequired: boolean = false, min?: number, max?: number) => {
    // Allow empty string for optional fields
    if (value === "") {
      if (isRequired) {
        setErrors(prev => ({ ...prev, [fieldName]: "This field is required" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
      setter("");
      return;
    }

    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      return;
    }

    if (min !== undefined && numValue < min) {
      setErrors(prev => ({ ...prev, [fieldName]: `Value must be at least ${min}` }));
    } else if (max !== undefined && numValue > max) {
      setErrors(prev => ({ ...prev, [fieldName]: `Value must be at most ${max}` }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    setter(value);
  };

  const calculateSalary = () => {
    try {
      console.log("calculateSalary called", { ctc, variablePay, taxRegime, pfOption });
      
      // Clear previous errors
      setErrors({});
      setResult(null);

      const ctcValue = parseFloat(ctc) || 0;
      const variablePayValue = parseFloat(variablePay || "0") || 0;
      const fixedPayValue = ctcValue - variablePayValue;
      
      // STRICT VALIDATION - Policy Guardrails
      // Rule 1: CTC must be positive
      if (!ctc || ctcValue <= 0 || isNaN(ctcValue)) {
        setErrors(prev => ({ ...prev, ctc: "CTC must be greater than ₹0. Please enter a valid amount." }));
        return;
      }

      // Rule 2: Variable pay cannot be negative
      if (variablePayValue < 0) {
        setErrors(prev => ({ ...prev, variablePay: "Variable pay cannot be negative." }));
        return;
      }

      // Rule 3: Variable pay cannot exceed CTC
      if (variablePayValue > ctcValue) {
        setErrors(prev => ({ ...prev, variablePay: "Variable pay cannot exceed CTC. Please revise the amount." }));
        return;
      }

      // Rule 4: Fixed pay must be positive
      if (fixedPayValue <= 0) {
        setErrors(prev => ({ ...prev, ctc: "Fixed pay (CTC - Variable Pay) must be greater than ₹0." }));
        return;
      }

    // Real-Time Salary Portal Calculation Method (MONTHLY-FIRST APPROACH):
    // All calculations start with monthly values, then multiply by 12 for yearly
    // IMPORTANT: Basic Salary is 50% of TOTAL CTC (not Fixed Pay)
    // KEY DIFFERENCE: Gross = CTC - PF - Gratuity (not Basic + HRA + Special Allowance)
    
    const ageValue = parseInt(age) || 30;
    
    // Step 1: Monthly CTC = round(CTC / 12)
    const monthlyCTC = Math.round(ctcValue / 12);
    
    // Step 2: Monthly Basic Salary = round((CTC × basicPercentage%) / 12)
    // Basic Percentage is adjustable via slider (30-50%)
    const monthlyBasic = Math.round((ctcValue * basicPercentage / 100) / 12);
    const basicSalary = monthlyBasic * 12; // Yearly Basic
    
    // Step 3: Monthly HRA = round(50% of Monthly Basic)
    const monthlyHRA = Math.round(monthlyBasic * 0.50);
    const hra = monthlyHRA * 12; // Yearly HRA
    
    // Step 4: Employee PF (Monthly) - based on user selection
    const monthlyPFUncapped = Math.round(monthlyBasic * 0.12);
    // If "Minimum (1800)" selected, use min(12% of Monthly Basic, ₹1,800)
    // If "12% of the basic salary" selected, use 12% WITHOUT CAP (as per real-time portal)
    const monthlyPFEmployee = pfOption === "fixed" 
      ? Math.min(monthlyPFUncapped, 1800) 
      : monthlyPFUncapped; // NO CAP - 12% of 8L basic = 96,000 yearly
    const pfEmployee = monthlyPFEmployee * 12; // Yearly Employee PF
    
    // Step 5: Employer PF (Monthly) - 12% without cap
    const monthlyPFEmployer = monthlyPFUncapped; // NO CAP for employer PF
    const pfEmployer = monthlyPFEmployer * 12; // Yearly Employer PF
    
    // Step 6: Monthly Gratuity = round(4.81% of Monthly Basic)
    const monthlyGratuity = Math.round(monthlyBasic * 0.0481);
    const gratuity = monthlyGratuity * 12; // Yearly Gratuity

    // Step 7: Calculate Gross Salary = CTC - (Employee PF + Gratuity + Employer PF)
    // Gross Salary is what remains after deducting mandatory contributions from CTC
    const grossSalary = Math.max(0, ctcValue - pfEmployee - gratuity - pfEmployer);
    const monthlyGross = grossSalary / 12;
    
    // Step 8: Calculate Special Allowance = Gross Salary - (Basic + HRA)
    // Special Allowance is the remaining amount after Basic and HRA from Gross Salary
    const specialAllowance = Math.max(0, grossSalary - basicSalary - hra);
    const monthlySpecialAllowance = Math.round(specialAllowance / 12);
    const specialAllowanceYearly = monthlySpecialAllowance * 12; // Recalculate yearly from rounded monthly
    
    // Validate that Gross Salary and Special Allowance are non-negative
    if (grossSalary <= 0) {
      setErrors(prev => ({ ...prev, ctc: "CTC is insufficient for mandatory contributions (PF + Gratuity). Please increase CTC." }));
      return;
    }
    
    if (specialAllowance < 0) {
      setErrors(prev => ({ ...prev, ctc: "CTC is insufficient. Gross Salary cannot cover Basic + HRA. Please increase CTC or adjust Basic percentage." }));
      return;
    }

    // No Professional Tax in ET Money calculation per spec
    const professionalTax = 0;

    let hraExemption = Math.min(hra, basicSalary * 0.5);

    let taxableIncome = 0;
    let incomeTax = 0;
    let surcharge = 0;
    let cess = 0;
    let taxWithoutExemptions = 0;
    let standardDeduction = 0;
    let section80C = 0;
    let section80D = 0;

    // Helper function to calculate surcharge based on total income
    const calculateSurcharge = (tax: number, totalIncome: number): number => {
      if (totalIncome > 50000000) {
        return tax * 0.37; // 37% surcharge for income > 5 crores
      } else if (totalIncome > 20000000) {
        return tax * 0.25; // 25% surcharge for income > 2 crores
      } else if (totalIncome > 10000000) {
        return tax * 0.15; // 15% surcharge for income > 1 crore
      } else if (totalIncome > 5000000) {
        return tax * 0.10; // 10% surcharge for income > 50 lakhs
      }
      return 0;
    };

    if (taxRegime === "new") {
      // Standard Deduction for New Regime (FY 2024-25) - ₹75,000 (Official rate)
      standardDeduction = 75000;
      // Taxable Income = Yearly Gross Salary - Standard Deduction
      // New Regime does NOT subtract Employee PF for tax calculation
      taxableIncome = Math.max(0, grossSalary - standardDeduction);
      
      // New Tax Regime Slabs (FY 2024-25) - Official Budget 2024 slabs
      // 0–3L → 0%
      // 3,00,001–6L → 5%
      // 6,00,001–9L → 10%
      // 9,00,001–12L → 15%
      // 12,00,001–15L → 20%
      // Above 15L → 30%
      
      let taxBase = 0;
      
      if (taxableIncome <= 300000) {
        taxBase = 0;
      } else if (taxableIncome <= 600000) {
        taxBase = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        taxBase = (taxableIncome - 600000) * 0.10 + 15000; // 5% of 3L = 15,000
      } else if (taxableIncome <= 1200000) {
        taxBase = (taxableIncome - 900000) * 0.15 + 45000; // 15,000 + 30,000
      } else if (taxableIncome <= 1500000) {
        taxBase = (taxableIncome - 1200000) * 0.20 + 90000; // 45,000 + 45,000
      } else {
        taxBase = (taxableIncome - 1500000) * 0.30 + 150000; // 90,000 + 60,000
      }
      
      // Apply Section 87A rebate for New Regime (FY 2024-25):
      // - If taxable income ≤ ₹7,00,000: Full rebate (tax = 0)
      // - If taxable income > ₹7,00,000 and ≤ ₹12,00,000: Rebate of ₹60,000 (or tax amount, whichever is lower)
      if (taxableIncome <= 700000) {
        taxBase = 0;
      } else if (taxableIncome <= 1200000) {
        // Apply rebate of ₹60,000 (or tax amount, whichever is lower)
        const rebateAmount = Math.min(taxBase, 60000);
        taxBase = taxBase - rebateAmount;
      }
      
      incomeTax = Math.round(taxBase);
    } else {
      // Standard Deduction for Old Regime (FY 2024-25) - ₹50,000
      standardDeduction = 50000;
      
      // ET Money default: Only apply deductions if user explicitly provides them
      // By default, ET Money calculates tax with only Standard Deduction and Employee PF
      if (exemptionsEnabled) {
        // Use user input for 80C if provided
        const section80CInputValue = parseFloat(section80CInput) || 0;
        if (section80CInputValue > 0) {
          section80C = Math.min(150000, section80CInputValue); // Cap at ₹1.5 lakhs for Old Regime
        }
        // Only apply 80D if user has entered investments (indicating they want to use exemptions)
        if (section80CInputValue > 0) {
          section80D = ageValue < 60 ? 25000 : 50000;
        }
        // Only apply HRA exemption if user has entered rent (indicating they want to use exemptions)
        // For now, default to no HRA exemption to match ET Money
        hraExemption = 0;
      }
      
      // Taxable Income = Yearly Gross Salary - Standard Deduction - Employee PF (Yearly) - HRA Exemption - Section 80C - Section 80D
      // ET Money default: Only Standard Deduction and Employee PF
      taxableIncome = Math.max(0, grossSalary - standardDeduction - pfEmployee - (exemptionsEnabled ? hraExemption : 0) - section80C - section80D);
      
      // Old Tax Regime Slabs (FY 2024-25) - ET Money exact slabs
      // 0–2.5L → 0%
      // 2.5–5L → 5%
      // 5–10L → 20%
      // Above 10L → 30%
      
      let taxBase = 0;
      
      if (taxableIncome <= 250000) {
        taxBase = 0;
      } else if (taxableIncome <= 500000) {
        taxBase = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        taxBase = (taxableIncome - 500000) * 0.20 + 12500; // 5% of 2.5L = 12,500
      } else {
        taxBase = (taxableIncome - 1000000) * 0.30 + 112500; // 12,500 + 100,000
      }
      
      // Apply Section 87A rebate for Old Regime (FY 2024-25):
      // - If taxable income ≤ ₹5,00,000: Full rebate (tax = 0)
      // - Rebate amount is ₹12,500 (or tax amount, whichever is lower) for taxable income up to ₹5,00,000
      if (taxableIncome <= 500000) {
        taxBase = 0;
      }
      
      incomeTax = Math.round(taxBase);
      
      // Calculate tax without exemptions for comparison
      const taxableWithoutExemptions = Math.max(0, grossSalary - 50000 - pfEmployee);
      let taxWithoutExemptionsBase = 0;
      if (taxableWithoutExemptions <= 250000) {
        taxWithoutExemptionsBase = 0;
      } else if (taxableWithoutExemptions <= 500000) {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 250000) * 0.05;
      } else if (taxableWithoutExemptions <= 1000000) {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 500000) * 0.20 + 12500;
      } else {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 1000000) * 0.30 + 112500;
      }
      if (taxableWithoutExemptions <= 500000) {
        taxWithoutExemptionsBase = 0;
      }
      const surchargeWithoutExemptions = calculateSurcharge(taxWithoutExemptionsBase, grossSalary);
      const cessWithoutExemptions = Math.round((taxWithoutExemptionsBase + surchargeWithoutExemptions) * 0.04);
      taxWithoutExemptions = Math.round(taxWithoutExemptionsBase + surchargeWithoutExemptions + cessWithoutExemptions);
    }

    // Calculate surcharge based on gross salary
    surcharge = calculateSurcharge(incomeTax, grossSalary);
    
    // Calculate cess: 4% of rounded tax (tax + surcharge)
    cess = Math.round((incomeTax + surcharge) * 0.04);
    
    // Final tax payable = tax + surcharge + cess (all rounded)
    const yearlyTax = Math.round(incomeTax + surcharge + cess);
    
    // Monthly Tax = round(Yearly Tax / 12) - ET Money method
    const monthlyTax = Math.round(yearlyTax / 12);
    
    const taxSavings = exemptionsEnabled && taxRegime === "old" ? taxWithoutExemptions - yearlyTax : 0;

    // Net In-hand (Monthly) = Monthly Gross - Employee PF - Monthly Tax
    // ET Money formula: No Professional Tax deduction
    const monthlyNetSalary = Math.max(0, monthlyGross - monthlyPFEmployee - monthlyTax);
    const netSalary = monthlyNetSalary * 12; // Yearly Net Salary
    
    // Store yearly tax for display
    incomeTax = yearlyTax;

    setResult({
      grossSalary: grossSalary,
      basicSalary,
      hra,
      specialAllowance: specialAllowanceYearly,
      pfEmployee,
      pfEmployer,
      gratuity,
      esic: 0, // Not in ET Money calculation
      professionalTax,
      incomeTax,
      surcharge,
      cess,
      totalDeductions: pfEmployee + professionalTax + incomeTax,
      netSalary,
      ctc: ctcValue,
      variablePay: variablePayValue,
      fixedPay: fixedPayValue,
      taxableIncome,
      standardDeduction,
      section80C,
      section80D,
      hraExemption,
      taxWithoutExemptions,
      taxSavings,
    });
    
    // Mark that calculation has been successfully completed
    hasCalculatedRef.current = true;
    } catch (error) {
      console.error("Error in calculateSalary:", error);
      setErrors(prev => ({ ...prev, general: "An error occurred during calculation. Please check your inputs." }));
      hasCalculatedRef.current = false;
    }
  };

  // Auto-recalculate when tax regime changes (if calculation already done)
  useEffect(() => {
    // Skip initial render - only recalculate on actual changes
    if (!hasCalculatedRef.current) {
      return;
    }
    
    // Only recalculate if we have a valid CTC and calculation has been done at least once
    const ctcValue = parseFloat(ctc);
    if (ctc && !isNaN(ctcValue) && ctcValue > 0) {
      calculateSalary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxRegime]);

  // Auto-recalculate when PF option changes (if calculation already done)
  useEffect(() => {
    // Skip initial render - only recalculate on actual changes
    if (!hasCalculatedRef.current) {
      return;
    }
    
    // Only recalculate if we have a valid CTC and calculation has been done at least once
    const ctcValue = parseFloat(ctc);
    if (ctc && !isNaN(ctcValue) && ctcValue > 0) {
      calculateSalary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfOption]);

  // Auto-recalculate when basic percentage changes (if calculation already done)
  useEffect(() => {
    // Skip initial render - only recalculate on actual changes
    if (!hasCalculatedRef.current) {
      return;
    }
    
    // Only recalculate if we have a valid CTC and calculation has been done at least once
    const ctcValue = parseFloat(ctc);
    if (ctc && !isNaN(ctcValue) && ctcValue > 0) {
      calculateSalary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicPercentage]);

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || !isFinite(amount) || amount < 0) {
      return "₹0";
    }
    // Format with commas like ET Money: ₹10,00,000
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, amount));
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 overflow-x-hidden" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box', WebkitOverflowScrolling: 'touch' }}>
        <div className="container py-8 md:py-12 px-4 sm:px-6" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Salary Calculator</h1>
            <p className="text-muted-foreground">The salary calculator helps estimate in-hand salary based on CTC, deductions, and chosen tax regime.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl break-words">Calculate Your In-hand Salary</CardTitle>
                <CardDescription className="text-sm break-words">Enter your salary details to calculate your take-home salary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                {/* Tax Regime Tabs - Inside Card */}
                <div className="mb-4" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                  <Tabs value={taxRegime} onValueChange={(value) => setTaxRegime(value as "old" | "new")} className="w-full" style={{ width: '100%', maxWidth: '100%' }}>
                    <TabsList className="grid w-full grid-cols-2 gap-1" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <TabsTrigger value="old" className="text-xs sm:text-sm flex-1">Old regime</TabsTrigger>
                      <TabsTrigger value="new" className="text-xs sm:text-sm flex-1">New regime</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Annual CTC */}
                <div className="space-y-2">
                  <Label htmlFor="ctc">Cost to Company (CTC)</Label>
                  <Input
                    id="ctc"
                    type="text"
                    placeholder="e.g., 2000000"
                    value={ctc}
                    onChange={(e) => handleNumberInput(e.target.value, setCtc, "ctc", true, 1)}
                    className="text-base"
                  />
                  {ctc && parseFloat(ctc) > 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      {numberToWords(parseFloat(ctc) || 0)}
                    </p>
                  )}
                  {errors.ctc && (
                    <p className="text-xs text-destructive">{errors.ctc}</p>
                  )}
                </div>

                {/* Variable Pay */}
                <div className="space-y-2">
                  <Label htmlFor="variable">Variable Component</Label>
                  <Input
                    id="variable"
                    type="text"
                    placeholder="e.g., 200000"
                    value={variablePay}
                    onChange={(e) => handleNumberInput(e.target.value, setVariablePay, "variablePay", false, 0)}
                  />
                  {variablePay && parseFloat(variablePay) > 0 && (
                    <p className="text-xs text-muted-foreground italic">
                      {numberToWords(parseFloat(variablePay) || 0)}
                    </p>
                  )}
                  {errors.variablePay && (
                    <p className="text-xs text-destructive">{errors.variablePay}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Max allowed: 15% of CTC.</p>
                </div>

                {/* Basic Salary - Adjustable slider */}
                <div className="space-y-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                  <div className="flex items-center justify-between gap-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <Label className="text-sm sm:text-base break-words" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>Basic Salary is <strong>{basicPercentage}%</strong> of CTC</Label>
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency((parseFloat(ctc) || 0) * basicPercentage / 100)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <span className="text-xs text-muted-foreground w-8 sm:w-12 flex-shrink-0" style={{ flexShrink: 0 }}>30%</span>
                    <Slider
                      value={[basicPercentage]}
                      onValueChange={(value) => setBasicPercentage(value[0])}
                      min={30}
                      max={50}
                      step={1}
                      className="flex-1 min-w-0"
                      style={{ flex: '1 1 auto', minWidth: 0, maxWidth: '100%' }}
                    />
                    <span className="text-xs text-muted-foreground w-8 sm:w-12 flex-shrink-0" style={{ flexShrink: 0 }}>50%</span>
                  </div>
                </div>

                {/* EPF Contribution Option - Always Visible */}
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <Label className="text-base font-semibold">EPF Contribution</Label>
                  <RadioGroup value={pfOption === "fixed" ? "fixed" : "actual"} onValueChange={(value) => setPfOption(value as "actual" | "fixed")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="actual" id="pf-actual-main" />
                      <Label htmlFor="pf-actual-main" className="font-normal cursor-pointer">12% of basic salary</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="pf-fixed-main" />
                      <Label htmlFor="pf-fixed-main" className="font-normal cursor-pointer">Minimum ₹1,800/month</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground break-words">
                    {pfOption === "actual" 
                      ? `EPF will be 12% of basic salary (${formatCurrency(Math.round((parseFloat(ctc) || 0) * 0.50 * 0.12 / 12))}/month)`
                      : "EPF will be capped at ₹1,800/month (minimum contribution)"}
                  </p>
                </div>

                {/* Exemptions Toggle - Only for Old Regime */}
                {taxRegime === "old" && (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Exemptions</Label>
                      <Switch checked={exemptionsEnabled} onCheckedChange={setExemptionsEnabled} />
                    </div>
                    {exemptionsEnabled && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="section80C" className="text-sm break-words">Section 80C (₹) - Max ₹1,50,000 (Old Regime Only)</Label>
                          <Input
                            id="section80C"
                            type="text"
                            placeholder="e.g., 150000"
                            value={section80CInput}
                            onChange={(e) => handleNumberInput(e.target.value, setSection80CInput, "section80C", false, 0, 150000)}
                          />
                          {section80CInput && parseFloat(section80CInput) > 0 && (
                            <p className="text-xs text-muted-foreground italic">
                              {numberToWords(parseFloat(section80CInput) || 0)}
                            </p>
                          )}
                          {errors.section80C && (
                            <p className="text-xs text-destructive">{errors.section80C}</p>
                          )}
                          <p className="text-xs text-muted-foreground break-words">PPF, ELSS, Life Insurance, etc. (Leave empty for auto-calculation). Maximum ₹1,50,000 for Old Regime.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age (for 80D calculation)</Label>
                          <Input
                            id="age"
                            type="text"
                            placeholder="e.g., 30"
                            value={age}
                            onChange={(e) => handleNumberInput(e.target.value, setAge, "age", false, 1, 120)}
                          />
                          {errors.age && (
                            <p className="text-xs text-destructive">{errors.age}</p>
                          )}
                          <p className="text-xs text-muted-foreground">80D: ₹25,000 (below 60) or ₹50,000 (60+)</p>
                        </div>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground">Standard Deduction, HRA (assumed max)</p>
                  </div>
                )}

                <div className="flex gap-2 sm:gap-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                  <Button onClick={calculateSalary} className={ctc || variablePay || section80CInput ? "flex-1 min-w-0" : "w-full"} size="lg" style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}>
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="text-xs sm:text-base truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Calculate Salary</span>
                </Button>
                  {(ctc || variablePay || section80CInput) && (
                    <Button 
                      onClick={() => {
                        setCtc("");
                        setVariablePay("");
                        setSection80CInput("");
                        setResult(null);
                        setErrors({});
                      }}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-1 sm:gap-2 flex-shrink-0"
                      style={{ flexShrink: 0 }}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground">Estimates only · No login required</p>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6 lg:col-span-1" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', WebkitOverflowScrolling: 'touch' }}>
                {/* Your In-hand Salary is - Main Display (ET Money Style) */}
                <Card className="border-primary/20 w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardContent className="pt-6" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '1.5rem', overflow: 'hidden' }}>
                    <div className="text-center space-y-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <p className="text-sm text-muted-foreground" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your In-hand Salary is</p>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary break-words" style={{ width: '100%', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {viewMode === "monthly" 
                          ? "₹" + (result.netSalary / 12 / 100000).toFixed(2) + " Lacs /month"
                          : (result.netSalary / 100000).toFixed(2) + " Lacs /year"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Total CTC Display */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardContent className="pt-6" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', padding: '1.5rem', overflow: 'hidden' }}>
                    <div className="text-center space-y-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <p className="text-sm text-muted-foreground" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>Total CTC</p>
                      <p className="text-xl sm:text-2xl font-bold break-words" style={{ width: '100%', maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{formatCurrency(result.ctc)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Tax Breakdown */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardHeader style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div className="flex items-center gap-2 flex-wrap" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <CardTitle className="text-base sm:text-lg break-words" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden', wordBreak: 'break-word' }}>Income Tax ({taxRegime === "old" ? "Old" : "New"} Regime)</CardTitle>
                      <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }} />
                    </div>
                    {taxRegime === "old" && exemptionsEnabled && (
                      <CardDescription className="text-xs sm:text-sm break-words" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', wordBreak: 'break-word' }}>Assuming maximum eligible exemptions</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                      <span className="text-xs sm:text-sm flex-shrink-0 min-w-0" style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Gross Salary (Yearly)</span>
                      <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(result.grossSalary)}</span>
                    </div>
                    {result.incomeTax > 0 ? (
                      <>
                        <div className="flex justify-between items-center gap-2 text-destructive">
                          <span className="text-xs sm:text-sm flex-shrink-0 min-w-0">Standard Deduction</span>
                          <span className="text-xs sm:text-sm whitespace-nowrap">-{formatCurrency(result.standardDeduction)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-2 text-destructive">
                          <span className="text-xs sm:text-sm flex-shrink-0 min-w-0">Employee PF (Yearly)</span>
                          <span className="text-xs sm:text-sm whitespace-nowrap">-{formatCurrency(result.pfEmployee)}</span>
                        </div>
                        {taxRegime === "old" && exemptionsEnabled && (
                          <>
                            <div className="flex justify-between items-center gap-2 text-destructive">
                              <span className="text-xs sm:text-sm flex-shrink-0 min-w-0">80C (PPF, ELSS, etc.)</span>
                              <span className="text-xs sm:text-sm whitespace-nowrap">-{formatCurrency(result.section80C)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 text-destructive">
                              <span className="text-xs sm:text-sm flex-shrink-0 min-w-0">80D (Health Insurance)</span>
                              <span className="text-xs sm:text-sm whitespace-nowrap">-{formatCurrency(result.section80D)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2 text-destructive">
                              <span className="text-xs sm:text-sm flex-shrink-0 min-w-0">HRA Exemption</span>
                              <span className="text-xs sm:text-sm whitespace-nowrap">-{formatCurrency(result.hraExemption)}</span>
                            </div>
                          </>
                        )}
                        <div className="pt-2 border-t space-y-2">
                          <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                            <span className="flex-shrink-0 min-w-0">Tax before Surcharge & Cess</span>
                            <span className="whitespace-nowrap">{formatCurrency(result.incomeTax - result.surcharge - result.cess)}</span>
                          </div>
                          {result.surcharge > 0 && (
                            <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                              <span className="flex-shrink-0 min-w-0">Surcharge</span>
                              <span className="text-orange-600 whitespace-nowrap">{formatCurrency(result.surcharge)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                            <span className="flex-shrink-0 min-w-0">Health & Education Cess (4%)</span>
                            <span className="whitespace-nowrap">{formatCurrency(result.cess)}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2 font-semibold mt-2 pt-2 border-t text-sm sm:text-base">
                            <span className="flex-shrink-0 min-w-0">Total Tax Payable</span>
                            <span className="text-destructive whitespace-nowrap">{formatCurrency(result.incomeTax)}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No tax applicable (Gross Salary ≤ ₹12,00,000)</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Salary Breakdown (ET Money Style) */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardHeader style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <CardTitle className="text-base sm:text-lg break-words" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden', wordBreak: 'break-word' }}>Detailed Salary Breakdown</CardTitle>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0" style={{ flexShrink: 0 }}>
                        <Button
                          variant={viewMode === "monthly" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("monthly")}
                          className="text-xs sm:text-sm"
                        >
                          Monthly
                        </Button>
                        <Button
                          variant={viewMode === "yearly" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setViewMode("yearly")}
                          className="text-xs sm:text-sm"
                        >
                          Yearly
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    {/* Earnings Section */}
                    <div className="space-y-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" style={{ flexShrink: 0 }}></div>
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Basic Salary</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.basicSalary / 12 : result.basicSalary)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="w-3 h-3 rounded-full bg-cyan-400 flex-shrink-0" style={{ flexShrink: 0 }}></div>
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>HRA</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.hra / 12 : result.hra)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="w-3 h-3 rounded-full bg-pink-400 flex-shrink-0" style={{ flexShrink: 0 }}></div>
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Special Allowance</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.specialAllowance / 12 : result.specialAllowance)}</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between items-center gap-2 font-semibold" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }} />
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Gross Salary</span>
                        </div>
                        <span className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.grossSalary / 12 : result.grossSalary)}</span>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }} />
                        <span className="text-xs sm:text-sm font-medium">Deductions from Salary</span>
                      </div>
                      <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="w-3 h-3 rounded-full bg-purple-400 flex-shrink-0" style={{ flexShrink: 0 }}></div>
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EPF Contribution</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.pfEmployee / 12 : result.pfEmployee)}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="w-3 h-3 rounded-full bg-purple-300 flex-shrink-0" style={{ flexShrink: 0 }}></div>
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tax Payable</span>
                        </div>
                        <span className="font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.incomeTax / 12 : result.incomeTax)}</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between items-center gap-2 font-semibold" style={{ width: '100%', boxSizing: 'border-box' }}>
                        <div className="flex items-center gap-2 min-w-0 flex-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }} />
                          <span className="text-xs sm:text-sm truncate" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Net In-hand Salary</span>
                        </div>
                        <span className="text-primary text-sm sm:text-lg whitespace-nowrap flex-shrink-0" style={{ flexShrink: 0 }}>{formatCurrency(viewMode === "monthly" ? result.netSalary / 12 : result.netSalary)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Collapsible Sections - ET Money Style */}
                {/* HRA and Rent Section */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardHeader className="cursor-pointer" onClick={() => setHraExpanded(!hraExpanded)} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <div className="flex items-center justify-between" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <CardTitle className="text-base" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>HRA and Rent</CardTitle>
                      <span className="text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }}>{hraExpanded ? "−" : "+"}</span>
                    </div>
                  </CardHeader>
                  {hraExpanded && (
                    <CardContent style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>City type</Label>
                          <RadioGroup value={hraOption} onValueChange={(value) => setHraOption(value as "40" | "50")}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="50" id="city-metro" />
                              <Label htmlFor="city-metro" className="font-normal cursor-pointer">Metro</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="40" id="city-nonmetro" />
                              <Label htmlFor="city-nonmetro" className="font-normal cursor-pointer">Non-Metro</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Monthly rent</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="text" 
                              value={monthlyRent === "0" ? "₹ 0" : formatCurrency(parseFloat(monthlyRent) || 0)} 
                              onChange={(e) => {
                                const value = e.target.value.replace(/[₹,\s]/g, '');
                                handleNumberInput(value, setMonthlyRent, "monthlyRent", false, 0);
                              }}
                              className="font-semibold flex-1"
                            />
                            <span className="text-xs text-muted-foreground">Optional</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Annual HRA (House Rent Allowance)</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="text" 
                              value={annualHRA ? formatCurrency(parseFloat(annualHRA) || 0) : (result ? formatCurrency(result.hra) : "₹ 0")} 
                              onChange={(e) => {
                                const value = e.target.value.replace(/[₹,\s]/g, '');
                                handleNumberInput(value, setAnnualHRA, "annualHRA", false, 0);
                              }}
                              className="font-semibold flex-1"
                            />
                            <span className="text-xs text-muted-foreground">Optional</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Gratuity Section */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardHeader className="cursor-pointer" onClick={() => setEpfExpanded(!epfExpanded)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Gratuity</CardTitle>
                      <span className="text-muted-foreground">{epfExpanded ? "−" : "+"}</span>
                    </div>
                  </CardHeader>
                  {epfExpanded && (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Annual gratuity</Label>
                          <Input 
                            type="text" 
                            value={result ? formatCurrency(result.gratuity).replace('₹', '').trim() : ""} 
                            readOnly 
                            className="font-semibold"
                          />
                          <p className="text-xs text-muted-foreground">Calculated as 4.81% of basic salary</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Investments Section */}
                <Card className="w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                  <CardHeader className="cursor-pointer" onClick={() => setInvestmentsExpanded(!investmentsExpanded)} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <div className="flex items-center justify-between" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                      <CardTitle className="text-base" style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}>Investments</CardTitle>
                      <span className="text-muted-foreground flex-shrink-0" style={{ flexShrink: 0 }}>{investmentsExpanded ? "−" : "+"}</span>
                    </div>
                  </CardHeader>
                  {investmentsExpanded && (
                    <CardContent style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Yearly investment</Label>
                          <span className="text-sm font-semibold">{formatCurrency(parseFloat(section80CInput) || 0)}</span>
                        </div>
                        <Slider
                          value={[parseFloat(section80CInput) || 0]}
                          onValueChange={(value) => setSection80CInput(value[0].toString())}
                          min={0}
                          max={150000}
                          step={1000}
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          placeholder="0"
                          value={section80CInput}
                          onChange={(e) => handleNumberInput(e.target.value, setSection80CInput, "section80C", false, 0, 150000)}
                        />
                        <p className="text-xs text-muted-foreground">
                          You can avail deductions under various sections like 80C, 80D, 80CCD, 80E, and more.
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Tax Savings Message */}
                {result.taxSavings > 0 && (
                  <Card className="bg-primary/5 border-primary/20 w-full max-w-full overflow-hidden" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <CardContent className="pt-6" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                      <div className="flex items-start gap-2 sm:gap-3" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                        <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" style={{ flexShrink: 0 }} />
                        <div className="flex-1 min-w-0" style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap" style={{ width: '100%', maxWidth: '100%' }}>
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" style={{ flexShrink: 0 }} />
                            <span className="font-semibold text-xs sm:text-sm break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>You saved {formatCurrency(result.taxSavings)} in tax due to exemptions!</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* How It Works Section - Now appears below results */}
            {result && (
              <Card className="mt-6 lg:col-span-2" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    How It Works
                  </CardTitle>
                  <CardDescription>Understanding your salary calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Understanding Your Salary Structure</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Your Cost to Company (CTC) is broken down into various components. Understanding this breakdown 
                      helps you see exactly how much you take home after all deductions.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">Salary Components Breakdown:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Basic Salary:</strong> Usually 40-50% of CTC. This forms the base for 
                        PF, gratuity, and other calculations. Higher basic means higher PF contribution and better retirement benefits.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">House Rent Allowance (HRA):</strong> Typically 40-50% of Basic salary. 
                        HRA is partially tax-exempt based on actual rent paid, making it a tax-efficient component.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Special Allowance:</strong> The remaining amount after Basic and HRA. 
                        This is fully taxable and forms part of your gross salary.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Variable Pay:</strong> Performance-based component that may vary. 
                        This is separate from fixed pay and is also fully taxable.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Gross Salary:</strong> Basic + HRA + Special Allowance (Fixed Pay portion)
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Mandatory Deductions</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      These deductions are mandatory as per Indian labor laws and tax regulations. They reduce your 
                      gross salary to arrive at your net take-home amount.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">Deduction Details:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Employee Provident Fund (EPF):</strong> 
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>12% of Basic Salary (mandatory contribution) or Fixed ₹1,800/month based on your selection</li>
                          <li>Maximum ₹1,800/month (capped at ₹15,000 basic salary as per EPFO rules) if fixed option selected</li>
                          <li>This is your retirement savings and earns tax-free interest</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Employee State Insurance (ESIC):</strong> 
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>0.75% of Gross Salary</li>
                          <li>Applicable only if gross salary ≤ ₹21,000/month</li>
                          <li>Provides health insurance coverage</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Professional Tax:</strong> 
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>₹200/month (standard rate, varies by state)</li>
                          <li>Annual deduction: ₹2,400</li>
                          <li>State-specific tax on employment</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Income Tax:</strong> Calculated based on your selected tax regime 
                        (Old or New) using applicable slab rates, surcharge, and cess. If Gross Salary ≤ ₹12,00,000, no tax is applicable.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Tax Calculation - {taxRegime === "old" ? "Old" : "New"} Regime</h3>
                    {taxRegime === "old" ? (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p className="leading-relaxed">
                          <strong className="text-foreground">Old Regime Benefits:</strong>
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Standard deduction: ₹50,000</li>
                          <li>Section 80C: Up to ₹1,50,000 (PPF, ELSS, Life Insurance, etc.)</li>
                          <li>Section 80D: Health insurance premiums (₹25,000/₹50,000 based on age)</li>
                          <li>HRA exemption based on actual rent paid</li>
                          <li>Home loan interest deduction (Section 24(b))</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          Tax is calculated using progressive slab rates: 0-₹2.5L (0%), ₹2.5L-₹5L (5%), 
                          ₹5L-₹10L (20%), Above ₹10L (30%), plus 4% Health & Education Cess.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p className="leading-relaxed">
                          <strong className="text-foreground">New Regime Benefits:</strong>
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Higher standard deduction: ₹75,000</li>
                          <li>Simplified tax structure with lower rates for income up to ₹15L</li>
                          <li>No need to maintain investment proofs</li>
                          <li>No deductions allowed (except standard deduction)</li>
                          <li>If Gross Salary ≤ ₹12,00,000, no tax is applicable</li>
                        </ul>
                        <p className="leading-relaxed mt-3">
                          Tax is calculated using new slab rates: 0-₹3L (0%), ₹3L-₹7L (5%), ₹7L-₹10L (10%), 
                          ₹10L-₹12L (15%), ₹12L-₹15L (20%), ₹15L-₹20L (25%), Above ₹20L (30%), plus 4% cess.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Final Calculation</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Net (In-Hand) Salary = Gross Salary - (Employee PF + Tax)</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This is your net take-home amount that gets credited to your bank account every month.
                    </p>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">💡 Pro Tip</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Switch between Old and New tax regimes using the tabs above to see which regime gives you 
                      better take-home salary. Remember, you can choose your preferred regime each financial year 
                      when filing your income tax return.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Article Links Section */}
            <ArticleLinks calculatorType="in-hand-salary" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
