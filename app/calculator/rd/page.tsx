"use client";

import { useState } from "react";
import { PiggyBank, ArrowLeft, DollarSign, TrendingUp, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("5000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [tenure, setTenure] = useState<string>("5");
  const [result, setResult] = useState<{
    totalDeposited: number;
    maturityAmount: number;
    interestEarned: number;
    yearlyBreakdown: Array<{ year: number; deposited: number; maturity: number }>;
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

  const calculateRD = () => {
    setErrors({});
    setResult(null);
    const deposit = parseFloat(monthlyDeposit) || 0;
    const rateValue = parseFloat(interestRate || "0") || 0;
    const years = parseInt(tenure) || 0;
    const months = years * 12;

    // STRICT VALIDATION - RBI Banking Norms Guardrails
    // Rule 1: Monthly deposit must be positive
    if (!monthlyDeposit || deposit <= 0 || isNaN(deposit)) {
      setErrors(prev => ({ ...prev, monthlyDeposit: "Monthly deposit must be greater than ₹0. Please enter a valid amount." }));
      return;
    }

    // Rule 2: Interest rate cannot be negative
    if (rateValue < 0) {
      setErrors(prev => ({ ...prev, interestRate: "Interest rate cannot be negative." }));
      return;
    }

    // Rule 3: Interest rate must be within realistic limits (0-15%)
    if (rateValue > 15) {
      setErrors(prev => ({ ...prev, interestRate: "Interest rate cannot exceed 15%. Please enter a realistic value." }));
      return;
    }

    // Rule 4: Tenure must be positive
    if (!tenure || years <= 0 || isNaN(years)) {
      setErrors(prev => ({ ...prev, tenure: "Tenure must be greater than 0 years. Please enter a valid number." }));
      return;
    }

    // Rule 5: Tenure must be reasonable (max 20 years for RD)
    if (years > 20) {
      setErrors(prev => ({ ...prev, tenure: "RD tenure cannot exceed 20 years. Please enter a valid period." }));
      return;
    }

    const rate = rateValue / 100;

    const totalDeposited = deposit * months;
    
    const quarterlyRate = rate / 4;
    const quarters = years * 4;
    
    const maturityAmount = deposit * ((Math.pow(1 + quarterlyRate, quarters) - 1) / (1 - Math.pow(1 + quarterlyRate, -1/3)));
    const interestEarned = maturityAmount - totalDeposited;

    const yearlyBreakdown = [];
    let cumulativeDeposit = 0;
    let cumulativeMaturity = 0;

    for (let year = 1; year <= years; year++) {
      const yearQuarters = 4;
      const yearDeposit = deposit * 12;
      cumulativeDeposit += yearDeposit;
      
      const yearMaturity = deposit * ((Math.pow(1 + quarterlyRate, year * 4) - 1) / (1 - Math.pow(1 + quarterlyRate, -1/3)));
      cumulativeMaturity = yearMaturity;
      
      yearlyBreakdown.push({
        year,
        deposited: cumulativeDeposit,
        maturity: cumulativeMaturity,
      });
    }

    setResult({
      totalDeposited,
      maturityAmount,
      interestEarned,
      yearlyBreakdown,
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
                <h1 className="text-3xl font-bold text-foreground">RD Calculator</h1>
                <p className="text-muted-foreground">Calculate your Recurring Deposit maturity amount</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter RD Details</CardTitle>
                <CardDescription>Calculate your RD maturity amount and interest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="deposit">Monthly Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="text"
                    placeholder="5000"
                    value={monthlyDeposit}
                    onChange={(e) => handleNumberInput(e.target.value, setMonthlyDeposit, "monthlyDeposit", true)}
                  />
                  {errors.monthlyDeposit && (
                    <p className="text-xs text-destructive">{errors.monthlyDeposit}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="text"
                    placeholder="6.5"
                    value={interestRate}
                    onChange={(e) => handleNumberInput(e.target.value, setInterestRate, "interestRate", false)}
                  />
                  <p className="text-xs text-muted-foreground">Typical RD rates: 5.5% - 7.5%</p>
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

                <div className="flex gap-3">
                  <Button onClick={calculateRD} className={monthlyDeposit !== "5000" || interestRate !== "6.5" || tenure !== "5" ? "flex-1" : "w-full"} size="lg">
                    <PiggyBank className="h-5 w-5 mr-2" />
                    Calculate RD
                  </Button>
                  {(monthlyDeposit !== "5000" || interestRate !== "6.5" || tenure !== "5") && (
                    <Button 
                      onClick={() => {
                        setMonthlyDeposit("5000");
                        setInterestRate("6.5");
                        setTenure("5");
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
                  <CardDescription>Understanding RD calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Recurring Deposit (RD) - Overview</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Recurring Deposit is a popular savings instrument offered by banks where you deposit a fixed amount every 
                      month for a predetermined period. It&apos;s ideal for disciplined savings and offers guaranteed returns with 
                      low risk. RDs are perfect for short to medium-term financial goals like vacation, home renovation, or 
                      emergency fund building.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">How RD Works:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Fixed Monthly Deposit:</strong> You commit to depositing a fixed 
                        amount (e.g., ₹5,000) every month for the entire tenure. This creates a disciplined savings habit.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Tenure Options:</strong> Typically ranges from 6 months to 10 years. 
                        Longer tenures usually offer higher interest rates. Choose based on your financial goal timeline.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Interest Rates:</strong> Vary by bank and tenure, typically 5.5% - 7.5% 
                        per annum. Senior citizens often get 0.25-0.50% extra. Rates are fixed at the time of opening the RD.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Quarterly Compounding:</strong> Interest is compounded quarterly 
                        (every 3 months), which means your interest earns interest, maximizing your returns.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Calculation Method</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      RD maturity is calculated using quarterly compounding. Each monthly deposit earns interest for the remaining 
                      quarters until maturity:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Quarterly Compounding:</strong> Interest is calculated and added every 
                        3 months. The formula accounts for each deposit earning interest for different periods.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Total Deposited:</strong> Monthly deposit × Number of months. 
                        This is your principal amount.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Maturity Amount:</strong> Sum of all deposits + Compound interest 
                        earned over the tenure. This is what you receive at maturity.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Interest Earned:</strong> Maturity amount - Total deposited. 
                        This is your return on investment.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Key Benefits</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">Guaranteed Returns:</strong> Fixed interest rate ensures predictable returns</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Low Risk:</strong> Bank deposits are insured up to ₹5 lakhs by DICGC</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Disciplined Savings:</strong> Forces regular monthly savings</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Flexible Tenure:</strong> Choose tenure from 6 months to 10 years</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Easy to Open:</strong> Can be opened online or at bank branch with minimal documentation</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> RD interest is taxable as per your income tax slab. 
                      TDS (Tax Deducted at Source) may be deducted if interest exceeds ₹40,000 per year. For senior citizens, 
                      the TDS threshold is ₹50,000. Interest is added to your total income and taxed accordingly. Consider tax-saving 
                      FDs or other tax-efficient instruments if you&apos;re in a higher tax bracket.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>RD Results</CardTitle>
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
                      <span className="text-sm font-medium">Total Deposited</span>
                      <span className="font-semibold">{formatCurrency(result.totalDeposited)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Interest Earned</span>
                      <span className="font-semibold text-success">{formatCurrency(result.interestEarned)}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Effective Return:</p>
                      <p className="text-lg font-bold text-success">
                        {((result.interestEarned / result.totalDeposited) * 100).toFixed(2)}%
                      </p>
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

