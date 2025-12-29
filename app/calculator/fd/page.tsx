"use client";

import { useState } from "react";
import { Landmark, ArrowLeft, DollarSign, TrendingUp, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<string>("100000");
  const [interestRate, setInterestRate] = useState<string>("7");
  const [tenure, setTenure] = useState<string>("5");
  const [compounding, setCompounding] = useState<"quarterly" | "monthly" | "yearly">("quarterly");
  const [payoutFrequency, setPayoutFrequency] = useState<"monthly" | "quarterly" | "half-yearly" | "yearly">("yearly");
  const [result, setResult] = useState<{
    maturityAmount: number;
    interestEarned: number;
    effectiveRate: number;
    periodicPayout: number;
    yearlyBreakdown: Array<{ year: number; principal: number; interest: number; maturity: number }>;
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

  const calculateFD = () => {
    setErrors({});
    setResult(null);
    const principalAmount = parseFloat(principal) || 0;
    const interestRateValue = parseFloat(interestRate || "0") || 7;
    const years = parseFloat(tenure) || 0;

    // STRICT VALIDATION - RBI Banking Norms Guardrails
    // Rule 1: Principal amount must be positive
    if (!principal || principalAmount <= 0 || isNaN(principalAmount)) {
      setErrors(prev => ({ ...prev, principal: "Principal amount must be greater than ₹0. Please enter a valid amount." }));
      return;
    }

    // Rule 2: Interest rate cannot be negative
    if (interestRateValue < 0) {
      setErrors(prev => ({ ...prev, interestRate: "Interest rate cannot be negative." }));
      return;
    }

    // Rule 3: Interest rate must be within realistic limits (0-15%)
    if (interestRateValue > 15) {
      setErrors(prev => ({ ...prev, interestRate: "Interest rate cannot exceed 15%. Please enter a realistic value." }));
      return;
    }

    // Rule 4: Tenure must be positive
    if (!tenure || years <= 0 || isNaN(years)) {
      setErrors(prev => ({ ...prev, tenure: "Tenure must be greater than 0 years. Please enter a valid number." }));
      return;
    }

    // Rule 5: Tenure must be reasonable (max 20 years for FD)
    if (years > 20) {
      setErrors(prev => ({ ...prev, tenure: "FD tenure cannot exceed 20 years. Please enter a valid period." }));
      return;
    }

    const rate = interestRateValue / 100;

    let n = 1;
    if (compounding === "quarterly") n = 4;
    else if (compounding === "monthly") n = 12;
    else n = 1;

    const maturityAmount = principalAmount * Math.pow(1 + rate / n, n * years);
    const interestEarned = Math.max(0, maturityAmount - principalAmount);
    const effectiveRate = (Math.pow(1 + rate / n, n) - 1) * 100;
    
    // Calculate periodic interest payout based on payout frequency
    let periodicPayout = 0;
    const annualInterest = principalAmount * rate;
    if (payoutFrequency === "monthly") {
      periodicPayout = annualInterest / 12;
    } else if (payoutFrequency === "quarterly") {
      periodicPayout = annualInterest / 4;
    } else if (payoutFrequency === "half-yearly") {
      periodicPayout = annualInterest / 2;
    } else {
      periodicPayout = annualInterest;
    }

    const yearlyBreakdown = [];
    let currentPrincipal = principalAmount;

    for (let year = 1; year <= Math.ceil(years); year++) {
      const yearMaturity = currentPrincipal * Math.pow(1 + rate / n, n);
      const yearInterest = yearMaturity - currentPrincipal;
      
      yearlyBreakdown.push({
        year,
        principal: currentPrincipal,
        interest: yearInterest,
        maturity: yearMaturity,
      });
      
      currentPrincipal = yearMaturity;
    }

    setResult({
      maturityAmount,
      interestEarned,
      effectiveRate,
      periodicPayout,
      yearlyBreakdown: yearlyBreakdown.slice(0, Math.ceil(years)),
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
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">FD Calculator</h1>
                <p className="text-muted-foreground">Calculate your Fixed Deposit maturity amount</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter FD Details</CardTitle>
                <CardDescription>Calculate your FD maturity amount and returns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Amount (₹)</Label>
                  <Input
                    id="principal"
                    type="text"
                    placeholder="100000"
                    value={principal}
                    onChange={(e) => handleNumberInput(e.target.value, setPrincipal, "principal", true)}
                  />
                  {errors.principal && (
                    <p className="text-xs text-destructive">{errors.principal}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="text"
                    placeholder="7"
                    value={interestRate}
                    onChange={(e) => handleNumberInput(e.target.value, setInterestRate, "interestRate", false)}
                  />
                  {errors.interestRate && (
                    <p className="text-xs text-destructive">{errors.interestRate}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Typical FD rates: 6% - 8%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenure">Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="text"
                    placeholder="5"
                    value={tenure}
                    onChange={(e) => handleNumberInput(e.target.value, setTenure, "tenure", true)}
                  />
                  {errors.tenure && (
                    <p className="text-xs text-destructive">{errors.tenure}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compounding">Compounding Frequency</Label>
                  <select
                    id="compounding"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value as "quarterly" | "monthly" | "yearly")}
                  >
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout">Interest Payout Frequency</Label>
                  <select
                    id="payout"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={payoutFrequency}
                    onChange={(e) => setPayoutFrequency(e.target.value as "monthly" | "quarterly" | "half-yearly" | "yearly")}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half-yearly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Choose how often you want to receive interest payouts</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateFD} className={principal !== "100000" || interestRate !== "7" || tenure !== "5" || compounding !== "quarterly" || payoutFrequency !== "yearly" ? "flex-1" : "w-full"} size="lg">
                    <Landmark className="h-5 w-5 mr-2" />
                    Calculate FD
                  </Button>
                  {(principal !== "100000" || interestRate !== "7" || tenure !== "5" || compounding !== "quarterly" || payoutFrequency !== "yearly") && (
                    <Button 
                      onClick={() => {
                        setPrincipal("100000");
                        setInterestRate("7");
                        setTenure("5");
                        setCompounding("quarterly");
                        setPayoutFrequency("yearly");
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
                  <CardDescription>Understanding FD calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Fixed Deposit (FD) - Overview</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Fixed Deposit is one of India&apos;s most trusted and popular investment options. It&apos;s a risk-free savings 
                      instrument where you deposit a lump sum for a fixed tenure at a predetermined interest rate. FDs offer 
                      guaranteed returns, capital protection, and flexibility in terms of compounding and payout options. 
                      Ideal for conservative investors and short to medium-term goals.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">How FD Works:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Lump Sum Deposit:</strong> You deposit a fixed amount (principal) 
                        for a predetermined tenure. The amount is locked in for the entire period.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Fixed Interest Rate:</strong> The interest rate is fixed at the time 
                        of opening the FD and remains constant throughout the tenure. Rates vary by bank and tenure (typically 5.5% - 7.5%).
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Compounding Options:</strong> You can choose how often interest is compounded:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li><strong>Quarterly:</strong> Interest compounded every 3 months (most common)</li>
                          <li><strong>Monthly:</strong> Interest compounded every month (higher returns)</li>
                          <li><strong>Yearly:</strong> Interest compounded annually (lower returns)</li>
                        </ul>
                        Higher compounding frequency = Higher effective returns.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Payout Options:</strong> You can choose to receive interest:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li><strong>Cumulative:</strong> Interest reinvested, received at maturity (higher returns)</li>
                          <li><strong>Non-Cumulative:</strong> Interest paid out monthly/quarterly/half-yearly/yearly (regular income)</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">FD Calculation Formula</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      The maturity amount is calculated using compound interest formula:
                    </p>
                    <div className="bg-muted/30 p-3 rounded font-mono text-xs mb-3">
                      Maturity Amount = Principal × (1 + r/n)^(n×t)
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">Principal:</strong> Initial deposit amount (₹)</li>
                      <li className="leading-relaxed"><strong className="text-foreground">r:</strong> Annual interest rate (as decimal, e.g., 7% = 0.07)</li>
                      <li className="leading-relaxed"><strong className="text-foreground">n:</strong> Compounding frequency per year (quarterly=4, monthly=12, yearly=1)</li>
                      <li className="leading-relaxed"><strong className="text-foreground">t:</strong> Tenure in years</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      <strong className="text-foreground">Example:</strong> ₹1,00,000 for 5 years at 7% compounded quarterly
                      <br />
                      Maturity = ₹1,00,000 × (1 + 0.07/4)^(4×5) = ₹1,00,000 × (1.0175)^20 ≈ ₹1,41,478
                    </p>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Key Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">Guaranteed Returns:</strong> Fixed interest rate ensures predictable returns</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Capital Protection:</strong> Principal amount is safe and guaranteed</li>
                      <li className="leading-relaxed"><strong className="text-foreground">DICGC Insurance:</strong> Bank deposits insured up to ₹5 lakhs</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Flexible Options:</strong> Choose compounding and payout frequency</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Senior Citizen Benefits:</strong> Higher interest rates (0.25-0.50% extra)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> FD interest is taxable as per your income tax slab. 
                      TDS (Tax Deducted at Source) is deducted if interest exceeds ₹40,000 per year (₹50,000 for senior citizens). 
                      Interest is added to your total income and taxed accordingly. For higher tax brackets, consider tax-saving 
                      FDs (5-year lock-in, Section 80C benefit) or other tax-efficient instruments. Returns shown are pre-tax.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>FD Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Maturity Amount</span>
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.maturityAmount)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Principal Amount</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(principal) || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Total Interest Earned</span>
                      <span className="font-semibold text-success">{formatCurrency(result.interestEarned)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Periodic Interest Payout ({payoutFrequency})</span>
                      <span className="font-semibold text-primary">{formatCurrency(result.periodicPayout)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Effective Rate</span>
                      <span className="font-semibold">{result.effectiveRate.toFixed(2)}%</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Return Percentage:</p>
                      <p className="text-lg font-bold text-success">
                        {((result.interestEarned / (parseFloat(principal) || 1)) * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Disclaimer:</strong> FD interest is taxable as per the investor&apos;s income tax slab. 
                          Returns shown are pre-tax. Please consult a tax advisor for accurate tax calculations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {result.yearlyBreakdown.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-3">Yearly Breakdown</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.yearlyBreakdown.map((item) => (
                          <div key={item.year} className="flex justify-between items-center text-sm">
                            <span>Year {item.year}</span>
                            <span className="font-medium">{formatCurrency(item.maturity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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





