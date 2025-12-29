"use client";

import { useState } from "react";
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
  const [ctc, setCtc] = useState<string>("1200000");
  const [variablePay, setVariablePay] = useState<string>("");
  const [basicPercentage, setBasicPercentage] = useState<number[]>([40]);
  const [hraOption, setHraOption] = useState<"40" | "50">("50");
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("old");
  const [age, setAge] = useState<string>("30");
  const [exemptionsEnabled, setExemptionsEnabled] = useState<boolean>(true);
  const [section80CInput, setSection80CInput] = useState<string>("");
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    const basicPercent = basicPercentage[0] / 100;
    const hraPercent = hraOption === "50" ? 0.5 : 0.4;
    const ageValue = parseInt(age);

    const basicSalary = fixedPayValue * basicPercent;
    const hra = Math.min(basicSalary * hraPercent, basicSalary * 0.5);
    const specialAllowance = fixedPayValue - basicSalary - hra;

    // Rule 5: Validate salary components don't exceed fixed pay
    if (basicSalary + hra + specialAllowance > fixedPayValue + 1) { // +1 for floating point tolerance
      setErrors(prev => ({ ...prev, ctc: "Salary components (Basic + HRA + Special Allowance) exceed fixed pay. Please adjust the percentages." }));
      return;
    }

    // Rule 6: Special allowance cannot be negative
    if (specialAllowance < 0) {
      setErrors(prev => ({ ...prev, ctc: "Special allowance is negative. Please reduce Basic or HRA percentage." }));
      return;
    }

    // PF calculation - 12% of basic, capped at ₹15,000 basic salary
    // Employee & Employer PF: 12% each, max ₹1,800/month (₹21,600/year) per person
    const pfEmployee = Math.min(basicSalary * 0.12, 1800 * 12);
    const pfEmployer = Math.min(basicSalary * 0.12, 1800 * 12);
    const gratuity = basicSalary * 0.0481; // 4.81% of Basic

    const grossSalary = basicSalary + hra + specialAllowance;

    // Rule 7: Validate gross salary is reasonable (should equal fixed pay approximately)
    if (Math.abs(grossSalary - fixedPayValue) > 100) {
      setErrors(prev => ({ ...prev, ctc: "Salary components do not match fixed pay. Please check the calculation." }));
      return;
    }
    const esic = grossSalary <= 21000 * 12 ? grossSalary * 0.0075 : 0;
    const professionalTax = 200 * 12;

    const hraExemption = Math.min(hra, basicSalary * 0.5);

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
      standardDeduction = 75000;
      // PF is deducted from taxable income
      taxableIncome = Math.max(0, grossSalary - standardDeduction - pfEmployee - professionalTax);
      
      // Calculate tax without exemptions for comparison
      const taxableWithoutExemptions = Math.max(0, grossSalary - 75000 - pfEmployee - professionalTax);
      
      // New Tax Regime Slabs (FY 2024-25)
      // As per latest rules: Income up to ₹12,75,000 (including ₹75,000 standard deduction) should be tax-free
      // This means if grossSalary <= ₹12,75,000, taxable income after standard deduction will be <= ₹12,00,000
      // And taxable income <= ₹12,00,000 should have no tax
      
      let taxWithoutExemptionsBase = 0;
      // No tax if taxable income <= ₹12,00,000
      if (taxableWithoutExemptions > 1200000) {
        if (taxableWithoutExemptions > 2000000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 2000000) * 0.30 + 275000;
        } else if (taxableWithoutExemptions > 1500000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 1500000) * 0.25 + 150000;
        } else if (taxableWithoutExemptions > 1200000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 1200000) * 0.20 + 90000;
        } else if (taxableWithoutExemptions > 900000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 900000) * 0.15 + 45000;
        } else if (taxableWithoutExemptions > 700000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 700000) * 0.10 + 25000;
        } else if (taxableWithoutExemptions > 500000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 500000) * 0.05 + 12500;
        } else if (taxableWithoutExemptions > 300000) {
          taxWithoutExemptionsBase = (taxableWithoutExemptions - 300000) * 0.05;
        }
      }
      const surchargeWithoutExemptions = calculateSurcharge(taxWithoutExemptionsBase, grossSalary);
      taxWithoutExemptions = (taxWithoutExemptionsBase + surchargeWithoutExemptions) * 1.04;
      
      // Calculate tax for taxable income
      // No tax if taxable income <= ₹12,00,000 (which corresponds to grossSalary <= ₹12,75,000 with standard deduction)
      if (taxableIncome <= 1200000) {
        incomeTax = 0;
      } else if (taxableIncome > 2000000) {
        incomeTax = (taxableIncome - 2000000) * 0.30 + 275000; // 150000 (from previous slabs) + 125000 (15-20L @ 25%)
      } else if (taxableIncome > 1500000) {
        incomeTax = (taxableIncome - 1500000) * 0.25 + 150000;
      } else if (taxableIncome > 1200000) {
        incomeTax = (taxableIncome - 1200000) * 0.20 + 90000;
      } else if (taxableIncome > 900000) {
        incomeTax = (taxableIncome - 900000) * 0.15 + 45000;
      } else if (taxableIncome > 700000) {
        incomeTax = (taxableIncome - 700000) * 0.10 + 25000;
      } else if (taxableIncome > 500000) {
        incomeTax = (taxableIncome - 500000) * 0.05 + 12500;
      } else if (taxableIncome > 300000) {
        incomeTax = (taxableIncome - 300000) * 0.05;
      }
    } else {
      standardDeduction = 50000;
      
      if (exemptionsEnabled) {
        // Use user input for 80C if provided, otherwise auto-calculate
        const section80CInputValue = parseFloat(section80CInput) || 0;
        if (section80CInputValue > 0) {
          section80C = Math.min(150000, section80CInputValue); // Cap at ₹1.5 lakhs for Old Regime
        } else {
          section80C = Math.min(150000, grossSalary * 0.3);
        }
        section80D = ageValue < 60 ? 25000 : 50000;
      }
      
      // PF is deducted from taxable income
      taxableIncome = Math.max(0, grossSalary - standardDeduction - (exemptionsEnabled ? hraExemption : 0) - pfEmployee - professionalTax - section80C - section80D);
      
      // Calculate tax without exemptions for comparison
      const taxableWithoutExemptions = Math.max(0, grossSalary - 50000 - pfEmployee - professionalTax);
      
      let taxWithoutExemptionsBase = 0;
      if (taxableWithoutExemptions > 1000000) {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 1000000) * 0.30 + 112500;
      } else if (taxableWithoutExemptions > 500000) {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 500000) * 0.20 + 12500;
      } else if (taxableWithoutExemptions > 250000) {
        taxWithoutExemptionsBase = (taxableWithoutExemptions - 250000) * 0.05;
      }
      const surchargeWithoutExemptions = calculateSurcharge(taxWithoutExemptionsBase, grossSalary);
      taxWithoutExemptions = (taxWithoutExemptionsBase + surchargeWithoutExemptions) * 1.04;
      
      // Old Tax Regime Slabs
      if (taxableIncome > 1000000) {
        incomeTax = (taxableIncome - 1000000) * 0.30 + 112500;
      } else if (taxableIncome > 500000) {
        incomeTax = (taxableIncome - 500000) * 0.20 + 12500;
      } else if (taxableIncome > 250000) {
        incomeTax = (taxableIncome - 250000) * 0.05;
      }
    }

    // Calculate surcharge based on gross salary
    surcharge = calculateSurcharge(incomeTax, grossSalary);
    
    // Calculate cess (4% on tax + surcharge)
    cess = (incomeTax + surcharge) * 0.04;
    incomeTax = incomeTax + surcharge + cess;
    const taxSavings = exemptionsEnabled && taxRegime === "old" ? taxWithoutExemptions - incomeTax : 0;

    const totalDeductions = pfEmployee + esic + professionalTax + incomeTax;
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    setResult({
      grossSalary,
      basicSalary,
      hra,
      specialAllowance,
      pfEmployee,
      pfEmployer,
      gratuity,
      esic,
      professionalTax,
      incomeTax,
      surcharge,
      cess,
      totalDeductions,
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
  };

  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || !isFinite(amount) || amount < 0) {
      return "₹0";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, amount));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">In-Hand Salary Calculator</h1>
                <p className="text-muted-foreground">Calculate your take-home salary after all deductions</p>
              </div>
            </div>
          </div>

          {/* Tax Regime Tabs */}
          <div className="mb-6">
            <Tabs value={taxRegime} onValueChange={(value) => setTaxRegime(value as "old" | "new")}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="old" className="flex items-center gap-2">
                  {taxRegime === "old" && <CheckCircle2 className="h-4 w-4" />}
                  Old Regime
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  {taxRegime === "new" && <CheckCircle2 className="h-4 w-4" />}
                  New Regime
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground mt-2">You can switch regimes anytime to compare results</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>Fill in your salary information to calculate your in-hand salary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Annual CTC */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="ctc">Annual CTC (₹)</Label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="ctc"
                    type="text"
                    placeholder="e.g., 1200000"
                    value={ctc}
                    onChange={(e) => handleNumberInput(e.target.value, setCtc, "ctc", true, 1)}
                    className="text-lg"
                  />
                  {errors.ctc && (
                    <p className="text-xs text-destructive">{errors.ctc}</p>
                  )}
                  {ctc && (
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{formatCurrency(parseFloat(ctc) || 0)}</p>
                      <p className="text-xs text-muted-foreground">Taxable Average: monthly</p>
                    </div>
                  )}
                </div>

                {/* Variable Pay */}
                <div className="space-y-2">
                  <Label htmlFor="variable">Variable / Bonus Component (₹)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="variable"
                      type="text"
                      placeholder="Amount"
                      value={variablePay}
                      onChange={(e) => handleNumberInput(e.target.value, setVariablePay, "variablePay", false, 0)}
                    />
                  {errors.variablePay && (
                    <p className="text-xs text-destructive">{errors.variablePay}</p>
                  )}
                    <select className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Optional</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">Paid annually, not monthly</p>
                </div>

                {/* Basic Salary Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Basic Salary (% of CTC)</Label>
                    <span className="text-sm font-semibold">{basicPercentage[0]}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground w-12">30%</span>
                    <Slider
                      value={basicPercentage}
                      onValueChange={setBasicPercentage}
                      min={30}
                      max={50}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-12">50%</span>
                  </div>
                </div>

                {/* HRA Radio Buttons */}
                <div className="space-y-2">
                  <Label>HRA Component</Label>
                  <RadioGroup value={hraOption} onValueChange={(value) => setHraOption(value as "40" | "50")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="40" id="hra-40" />
                      <Label htmlFor="hra-40" className="font-normal cursor-pointer">40% of Basic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="50" id="hra-50" />
                      <Label htmlFor="hra-50" className="font-normal cursor-pointer">50% of Basic (Metro)</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">HRA exemption depends on rent & city (assumed max later)</p>
                </div>

                {/* Provident Fund */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Label>Provident Fund (PF)</Label>
                  <span className="text-sm">12% of Basic (Employee)</span>
                </div>

                {/* Gratuity */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label>Gratuity</Label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm">4.81% of Basic</span>
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
                          <Label htmlFor="section80C">Section 80C (₹) - Max ₹1,50,000 (Old Regime Only)</Label>
                          <Input
                            id="section80C"
                            type="text"
                            placeholder="e.g., 150000"
                            value={section80CInput}
                            onChange={(e) => handleNumberInput(e.target.value, setSection80CInput, "section80C", false, 0, 150000)}
                          />
                          {errors.section80C && (
                            <p className="text-xs text-destructive">{errors.section80C}</p>
                          )}
                          <p className="text-xs text-muted-foreground">PPF, ELSS, Life Insurance, etc. (Leave empty for auto-calculation). Maximum ₹1,50,000 for Old Regime.</p>
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

                <div className="flex gap-3">
                  <Button onClick={calculateSalary} className={ctc !== "1200000" || variablePay || basicPercentage[0] !== 40 || hraOption !== "50" || age !== "30" || section80CInput ? "flex-1" : "w-full"} size="lg">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate In-Hand Salary
                  </Button>
                  {(ctc !== "1200000" || variablePay || basicPercentage[0] !== 40 || hraOption !== "50" || age !== "30" || section80CInput) && (
                    <Button 
                      onClick={() => {
                        setCtc("1200000");
                        setVariablePay("");
                        setBasicPercentage([40]);
                        setHraOption("50");
                        setTaxRegime("old");
                        setAge("30");
                        setExemptionsEnabled(true);
                        setSection80CInput("");
                        setResult(null);
                        setErrors({});
                      }}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <X className="h-5 w-5" />
                      Clear
                    </Button>
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground">Estimates only · No login required</p>
              </CardContent>
            </Card>

            {!result ? (
              <Card>
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
                          <li>12% of Basic Salary (mandatory contribution)</li>
                          <li>Maximum ₹1,800/month (capped at ₹15,000 basic salary as per EPFO rules)</li>
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
                        (Old or New) using applicable slab rates, surcharge, and cess.
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
                      <strong className="text-foreground">In-Hand Salary = Gross Salary - (EPF + ESIC + Professional Tax + Income Tax)</strong>
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
            ) : (
              <div className="space-y-6">
                {/* Monthly In-Hand Salary - Main Display */}
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">Your Monthly In-Hand Salary</p>
                      <p className="text-5xl font-bold text-primary">{formatCurrency(result.netSalary / 12)}</p>
                      <p className="text-xs text-muted-foreground">
                        After PF and taxes as per {taxRegime === "old" ? "Old" : "New"} Tax Regime
                        {exemptionsEnabled && taxRegime === "old" && " with assumed maximum exemptions"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTC Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your CTC Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total CTC</span>
                      <span className="text-lg font-bold">{formatCurrency(result.ctc)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-muted rounded-lg relative overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-blue-500/80 flex items-center justify-end pr-2"
                          style={{ width: `${(result.variablePay / result.ctc) * 100}%` }}
                        >
                          {result.variablePay > 0 && (
                            <span className="text-xs text-white font-medium">
                              {formatCurrency(result.variablePay)}
                            </span>
                          )}
                        </div>
                        <div 
                          className="absolute right-0 top-0 h-full bg-green-500/80 flex items-center justify-start pl-2"
                          style={{ width: `${(result.fixedPay / result.ctc) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(result.fixedPay)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-blue-500/80"></div>
                          <span>Variable Pay</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded bg-green-500/80"></div>
                          <span>Fixed Pay</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mandatory Contributions */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>Mandatory Contributions</CardTitle>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Employee PF</span>
                      <span className="font-semibold">{formatCurrency(result.pfEmployee)}</span>
                      <span className="text-xs text-muted-foreground">(12% of Basic, max ₹21,600)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employer PF</span>
                      <span className="font-semibold">{formatCurrency(result.pfEmployer)}</span>
                      <span className="text-xs text-muted-foreground">(12% of Basic, max ₹21,600)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gratuity</span>
                      <span className="font-semibold">{formatCurrency(result.gratuity)}</span>
                      <span className="text-xs text-muted-foreground">(4.81% of Basic)</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-semibold">
                      <span>Total Mandatory Contributions</span>
                      <span>{formatCurrency(result.pfEmployee + result.pfEmployer + result.gratuity)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Salary Components */}
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Basic</span>
                      <span className="font-semibold">{formatCurrency(result.basicSalary)}</span>
                      <span className="text-xs text-muted-foreground">({basicPercentage[0]}% of CTC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">HRA</span>
                      <span className="font-semibold">{formatCurrency(result.hra)}</span>
                      <span className="text-xs text-muted-foreground">({hraOption}% of Basic)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Other Allowances</span>
                      <span className="font-semibold">{formatCurrency(result.specialAllowance)}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-semibold">
                      <span>Total Fixed Pay</span>
                      <span>{formatCurrency(result.fixedPay)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Tax Breakdown */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>Income Tax ({taxRegime === "old" ? "Old" : "New"} Regime)</CardTitle>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {taxRegime === "old" && exemptionsEnabled && (
                      <CardDescription>Assuming maximum eligible exemptions</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Gross Taxable Income</span>
                      <span className="font-semibold">{formatCurrency(result.grossSalary)}</span>
                    </div>
                    <div className="flex justify-between text-destructive">
                      <span className="text-sm">Standard Deduction</span>
                      <span>-{formatCurrency(result.standardDeduction)}</span>
                    </div>
                    {taxRegime === "old" && exemptionsEnabled && (
                      <>
                        <div className="flex justify-between text-destructive">
                          <span className="text-sm">80C (PPF, ELSS, etc.)</span>
                          <span>-{formatCurrency(result.section80C)}</span>
                        </div>
                        <div className="flex justify-between text-destructive">
                          <span className="text-sm">80D (Health Insurance)</span>
                          <span>-{formatCurrency(result.section80D)}</span>
                        </div>
                        <div className="flex justify-between text-destructive">
                          <span className="text-sm">HRA Exemption</span>
                          <span>-{formatCurrency(result.hraExemption)}</span>
                        </div>
                      </>
                    )}
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tax before Surcharge & Cess</span>
                        <span>{formatCurrency(result.incomeTax - result.surcharge - result.cess)}</span>
                      </div>
                      {result.surcharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Surcharge</span>
                          <span className="text-orange-600">{formatCurrency(result.surcharge)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Health & Education Cess (4%)</span>
                        <span>{formatCurrency(result.cess)}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                        <span>Total Tax Payable</span>
                        <span className="text-destructive">{formatCurrency(result.incomeTax)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Savings Message */}
                {result.taxSavings > 0 && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="font-semibold">You saved {formatCurrency(result.taxSavings)} in tax due to exemptions!</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
