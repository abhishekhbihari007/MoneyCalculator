"use client";

import { useState } from "react";
import { PiggyBank, ArrowLeft, TrendingUp, DollarSign, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NPSCalculator() {
  const [employeeContribution, setEmployeeContribution] = useState<string>("5000");
  const [employerContribution, setEmployerContribution] = useState<string>("5000");
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [expectedReturn, setExpectedReturn] = useState<string>("10");
  const [result, setResult] = useState<{
    totalContributed: number;
    totalCorpus: number;
    estimatedReturns: number;
    monthlyPension50: number;
    monthlyPension60: number;
    lumpSum50: number;
    lumpSum60: number;
    annuity50: number;
    annuity60: number;
    annualTaxBenefit: number;
    totalTaxBenefit: number;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to handle number-only input
  const handleNumberInput = (value: string, setter: (value: string) => void, fieldName: string, isRequired: boolean = false) => {
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
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setter(value);
  };

  const calculateNPS = () => {
    setErrors({});
    setResult(null);
    const empCont = parseFloat(employeeContribution) || 0;
    const empContEmployer = parseFloat(employerContribution || "0") || 0;
    const age = parseInt(currentAge) || 0;
    const retireAge = parseInt(retirementAge) || 0;
    const expectedReturnValue = parseFloat(expectedReturn) || 10;
    
    // STRICT VALIDATION - PFRDA Policy Guardrails
    // Rule 1: Employee contribution must be positive
    if (!employeeContribution || empCont <= 0 || isNaN(empCont)) {
      setErrors(prev => ({ ...prev, employeeContribution: "Employee contribution must be greater than ₹0 as per PFRDA rules." }));
      return;
    }

    // Rule 2: Employer contribution cannot be negative
    if (empContEmployer < 0) {
      setErrors(prev => ({ ...prev, employerContribution: "Employer contribution cannot be negative." }));
      return;
    }

    // Rule 3: Total monthly contribution should not exceed reasonable limits (₹2L/month = ₹24L/year for tax benefit)
    const totalMonthlyContribution = empCont + empContEmployer;
    if (totalMonthlyContribution > 200000) {
      setErrors(prev => ({ ...prev, employeeContribution: "Total monthly contribution (Employee + Employer) cannot exceed ₹2,00,000 as per PFRDA and tax benefit limits." }));
      return;
    }

    // Rule 4: Current age validation
    if (!currentAge || age <= 0 || isNaN(age) || age > 100) {
      setErrors(prev => ({ ...prev, currentAge: "Please enter a valid current age (1-100 years)." }));
      return;
    }

    // Rule 5: Retirement age validation
    if (!retirementAge || retireAge <= 0 || isNaN(retireAge) || retireAge > 100) {
      setErrors(prev => ({ ...prev, retirementAge: "Please enter a valid retirement age (1-100 years)." }));
      return;
    }

    if (age >= retireAge) {
      setErrors(prev => ({ ...prev, retirementAge: "Retirement age must be greater than current age." }));
      return;
    }

    // Rule 6: Expected return must be reasonable (0-30%)
    if (expectedReturnValue < 0 || expectedReturnValue > 30) {
      setErrors(prev => ({ ...prev, expectedReturn: "Expected return must be between 0% and 30%." }));
      return;
    }
    
    const rate = expectedReturnValue / 100 / 12;
    const months = (retireAge - age) * 12;
    
    if (months <= 0) {
      setErrors(prev => ({ ...prev, retirementAge: "Retirement age must be greater than current age" }));
      return;
    }

    const totalMonthly = empCont + empContEmployer;
    const totalContributed = totalMonthly * months;
    
    let corpus = 0;
    for (let i = 0; i < months; i++) {
      corpus = (corpus + totalMonthly) * (1 + rate);
    }
    
    const estimatedReturns = corpus - totalContributed;
    
    // Calculate for 50% annuity (50% lump sum)
    const lumpSum50 = corpus * 0.5;
    const annuity50 = corpus * 0.5;
    const monthlyPension50 = (annuity50 * 0.06) / 12; // 6% annuity rate
    
    // Calculate for 60% annuity (40% lump sum)
    const lumpSum60 = corpus * 0.4;
    const annuity60 = corpus * 0.6;
    const monthlyPension60 = (annuity60 * 0.06) / 12; // 6% annuity rate

    // Calculate tax benefit under Section 80CCD
    // Employee contribution: Up to ₹1.5L under 80CCD(1) + additional ₹50K under 80CCD(1B)
    // Total limit: ₹2L per year (₹1.5L + ₹50K)
    const annualEmployeeContribution = empCont * 12;
    const maxTaxBenefit80CCD1 = Math.min(annualEmployeeContribution, 150000); // Under 80CCD(1)
    const additionalBenefit80CCD1B = Math.min(Math.max(0, annualEmployeeContribution - 150000), 50000); // Under 80CCD(1B)
    const annualTaxBenefit = maxTaxBenefit80CCD1 + additionalBenefit80CCD1B;
    const totalTaxBenefit = annualTaxBenefit * (retireAge - age);

    setResult({
      totalContributed,
      totalCorpus: corpus,
      estimatedReturns,
      monthlyPension50,
      monthlyPension60,
      lumpSum50,
      lumpSum60,
      annuity50,
      annuity60,
      annualTaxBenefit,
      totalTaxBenefit,
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                <PiggyBank className="h-6 w-6 text-success" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading">NPS Wealth Builder</h1>
                <p className="text-muted-foreground">Plan your National Pension System contributions</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>NPS Contribution Details</CardTitle>
                <CardDescription>Enter your monthly NPS contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Monthly Contribution (₹)</Label>
                  <Input
                    type="text"
                    value={employeeContribution}
                    onChange={(e) => handleNumberInput(e.target.value, setEmployeeContribution, "employeeContribution", true)}
                    placeholder="e.g., 5000"
                  />
                  {errors.employeeContribution && (
                    <p className="text-xs text-destructive mt-1">{errors.employeeContribution}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Your contribution: Up to ₹1.5L under 80CCD(1) + ₹50K under 80CCD(1B) = ₹2L max tax benefit</p>
                </div>

                <div>
                  <Label>Employer Contribution (₹) - Optional</Label>
                  <Input
                    type="text"
                    value={employerContribution}
                    onChange={(e) => handleNumberInput(e.target.value, setEmployerContribution, "employerContribution", false)}
                    placeholder="e.g., 5000"
                  />
                  {errors.employerContribution && (
                    <p className="text-xs text-destructive mt-1">{errors.employerContribution}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">Employer&apos;s NPS contribution (if applicable). Leave empty if not applicable.</p>
                </div>

                <div>
                  <Label>Current Age</Label>
                  <Input
                    type="text"
                    value={currentAge}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentAge, "currentAge", true)}
                    placeholder="e.g., 30"
                  />
                  {errors.currentAge && (
                    <p className="text-xs text-destructive mt-1">{errors.currentAge}</p>
                  )}
                </div>

                <div>
                  <Label>Retirement Age</Label>
                  <Input
                    type="text"
                    value={retirementAge}
                    onChange={(e) => handleNumberInput(e.target.value, setRetirementAge, "retirementAge", true)}
                    placeholder="e.g., 60"
                  />
                  {errors.retirementAge && (
                    <p className="text-xs text-destructive mt-1">{errors.retirementAge}</p>
                  )}
                </div>

                <div>
                  <Label>Expected Annual Return (%)</Label>
                  <Input
                    type="text"
                    value={expectedReturn}
                    onChange={(e) => handleNumberInput(e.target.value, setExpectedReturn, "expectedReturn", false)}
                    placeholder="e.g., 10"
                  />
                  {errors.expectedReturn && (
                    <p className="text-xs text-destructive mt-1">{errors.expectedReturn}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">NPS typically returns 8-12% annually</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateNPS} className={employeeContribution !== "5000" || employerContribution !== "5000" || currentAge !== "30" || retirementAge !== "60" || expectedReturn !== "10" ? "flex-1" : "w-full"} size="lg">
                    <PiggyBank className="h-4 w-4 mr-2" />
                    Calculate NPS Wealth
                  </Button>
                  {(employeeContribution !== "5000" || employerContribution !== "5000" || currentAge !== "30" || retirementAge !== "60" || expectedReturn !== "10") && (
                    <Button 
                      onClick={() => {
                        setEmployeeContribution("5000");
                        setEmployerContribution("5000");
                        setCurrentAge("30");
                        setRetirementAge("60");
                        setExpectedReturn("10");
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
              </CardContent>
            </Card>

            {!result ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    How It Works
                  </CardTitle>
                  <CardDescription>Understanding NPS calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">National Pension System (NPS) - Overview</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      NPS is a voluntary, long-term retirement savings scheme designed to enable systematic savings during your 
                      working life. It&apos;s regulated by PFRDA (Pension Fund Regulatory and Development Authority) and offers market-linked 
                      returns with significant tax benefits. NPS is ideal for building a substantial retirement corpus while 
                      enjoying tax savings.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">How NPS Works:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Dual Contribution:</strong> You contribute monthly (employee contribution), 
                        and if you&apos;re salaried, your employer may also contribute (employer contribution). Both grow together.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Asset Allocation:</strong> You can choose how your money is invested:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li><strong>Equity (E):</strong> Up to 75% (higher risk, higher returns)</li>
                          <li><strong>Corporate Debt (C):</strong> Medium risk, medium returns</li>
                          <li><strong>Government Securities (G):</strong> Lower risk, stable returns</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Compounding Growth:</strong> Your contributions grow with market-linked 
                        returns, typically 8-12% annually over long periods. The power of compounding works over 20-30 years.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Lock-in Period:</strong> NPS has a lock-in until retirement (60 years), 
                        ensuring disciplined retirement savings. Partial withdrawals allowed after 3 years for specific purposes.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Tax Benefits - Triple Advantage</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      NPS offers one of the best tax benefits among all investment options:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Section 80CCD(1):</strong> Up to ₹1,50,000 deduction (part of overall 
                        80C limit). This reduces your taxable income.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Section 80CCD(1B):</strong> Additional ₹50,000 deduction exclusively 
                        for NPS (over and above ₹1.5L). This is a unique benefit only for NPS.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Section 80CCD(2):</strong> Employer contribution up to 10% of 
                        basic salary is also tax-free (no limit, but subject to employer contribution).
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Total Tax Benefit:</strong> Up to ₹2,00,000 per year (₹1.5L + ₹50K), 
                        plus employer contribution benefit.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">At Retirement (60 Years)</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      When you reach 60, you have flexible withdrawal options:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Option 1 (50-50):</strong> 50% lump sum (tax-free) + 50% annuity 
                        (monthly pension). Lump sum provides immediate liquidity.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Option 2 (40-60):</strong> 40% lump sum (tax-free) + 60% annuity 
                        (higher monthly pension). Better for those who need regular income.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Annuity:</strong> Provides guaranteed monthly pension for life. 
                        Typical annuity rates: 5.5-6.5% of corpus. This ensures you never outlive your savings.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Tax on Withdrawal:</strong> Up to 60% can be withdrawn tax-free. 
                        Annuity income is taxable as per your tax slab.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> NPS returns are market-linked and subject to 
                      market risks. Past performance does not guarantee future results. Choose your asset allocation based on 
                      your risk appetite and time to retirement. Consider consulting a financial advisor for personalized NPS strategy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>NPS Projection</CardTitle>
                  <CardDescription>Your retirement corpus breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Corpus at Retirement</span>
                        <TrendingUp className="h-5 w-5 text-success" />
                      </div>
                      <p className="text-3xl font-bold text-success">{formatCurrency(result.totalCorpus)}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-sm">Total Contributed</span>
                        <span className="font-medium">{formatCurrency(result.totalContributed)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-sm">Estimated Returns</span>
                        <span className="font-medium text-success">{formatCurrency(result.estimatedReturns)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                        <div>
                          <span className="text-sm font-medium">Annual Tax Benefit (80CCD)</span>
                          <p className="text-xs text-muted-foreground">Up to ₹2L per year</p>
                        </div>
                        <span className="font-semibold text-primary">{formatCurrency(result.annualTaxBenefit)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                        <div>
                          <span className="text-sm font-medium">Total Tax Benefit</span>
                          <p className="text-xs text-muted-foreground">Over investment period</p>
                        </div>
                        <span className="font-semibold text-primary">{formatCurrency(result.totalTaxBenefit)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">At Retirement - Option 1: 50% Lump Sum + 50% Annuity</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Lump Sum (50%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.lumpSum50)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Annuity Corpus (50%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.annuity50)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded">
                          <span className="text-sm">Estimated Monthly Pension</span>
                          <span className="font-semibold text-accent">{formatCurrency(result.monthlyPension50)}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-3 mt-4">At Retirement - Option 2: 40% Lump Sum + 60% Annuity</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Lump Sum (40%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.lumpSum60)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Annuity Corpus (60%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.annuity60)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded">
                          <span className="text-sm">Estimated Monthly Pension</span>
                          <span className="font-semibold text-accent">{formatCurrency(result.monthlyPension60)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> Pension calculation assumes an annuity rate of 6% per year. 
                          Typical range: 5.5% – 6.5%. Actual rates may vary based on annuity provider and market conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

