"use client";

import { useState } from "react";
import { TrendingUp, ArrowLeft, DollarSign, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [annualReturn, setAnnualReturn] = useState<string>("12");
  const [years, setYears] = useState<string>("10");
  const [result, setResult] = useState<{
    totalInvested: number;
    estimatedReturns: number;
    totalValue: number;
    monthlyBreakdown: Array<{ month: number; invested: number; value: number }>;
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

  const calculateSIP = () => {
    setErrors({});
    setResult(null);
    const monthly = parseFloat(monthlyInvestment) || 0;
    const annualReturnValue = parseFloat(annualReturn || "0") || 0;
    const yearsValue = parseInt(years) || 0;
    const months = yearsValue * 12;

    // STRICT VALIDATION - Policy Guardrails
    // Rule 1: Monthly investment must be positive
    if (!monthlyInvestment || monthly <= 0 || isNaN(monthly)) {
      setErrors(prev => ({ ...prev, monthlyInvestment: "Monthly investment must be greater than ₹0. Please enter a valid amount." }));
      return;
    }

    // Rule 2: Annual return rate cannot be negative
    if (annualReturnValue < 0) {
      setErrors(prev => ({ ...prev, annualReturn: "Expected annual return cannot be negative." }));
      return;
    }

    // Rule 3: Annual return rate must be within realistic limits (0-50%)
    if (annualReturnValue > 50) {
      setErrors(prev => ({ ...prev, annualReturn: "Expected annual return cannot exceed 50%. Please enter a realistic value." }));
      return;
    }

    // Rule 4: Investment period must be positive
    if (!years || yearsValue <= 0 || isNaN(yearsValue)) {
      setErrors(prev => ({ ...prev, years: "Investment period must be greater than 0 years. Please enter a valid number." }));
      return;
    }

    // Rule 5: Investment period must be reasonable (max 50 years)
    if (yearsValue > 50) {
      setErrors(prev => ({ ...prev, years: "Investment period cannot exceed 50 years. Please enter a realistic timeframe." }));
      return;
    }

    const rate = annualReturnValue / 100 / 12;

    const totalInvested = monthly * months;
    const futureValue = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const estimatedReturns = futureValue - totalInvested;

    const monthlyBreakdown = [];
    for (let i = 12; i <= months; i += 12) {
      const value = monthly * (((Math.pow(1 + rate, i) - 1) / rate) * (1 + rate));
      monthlyBreakdown.push({
        month: i,
        invested: monthly * i,
        value: value,
      });
    }

    setResult({
      totalInvested,
      estimatedReturns,
      totalValue: futureValue,
      monthlyBreakdown,
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
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SIP Growth Calculator</h1>
                <p className="text-muted-foreground">Calculate your Systematic Investment Plan returns</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter SIP Details</CardTitle>
                <CardDescription>Calculate your potential returns from SIP investments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Investment (₹)</Label>
                  <Input
                    id="monthly"
                    type="text"
                    placeholder="5000"
                    value={monthlyInvestment}
                    onChange={(e) => handleNumberInput(e.target.value, setMonthlyInvestment, "monthlyInvestment", true)}
                  />
                  {errors.monthlyInvestment && (
                    <p className="text-xs text-destructive">{errors.monthlyInvestment}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return">Expected Annual Return (%)</Label>
                  <Input
                    id="return"
                    type="text"
                    placeholder="12"
                    value={annualReturn}
                    onChange={(e) => handleNumberInput(e.target.value, setAnnualReturn, "annualReturn", false)}
                  />
                  <p className="text-xs text-muted-foreground">Typical equity returns: 10-15%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="text"
                    placeholder="10"
                    value={years}
                    onChange={(e) => handleNumberInput(e.target.value, setYears, "years", true)}
                  />
                  {errors.years && (
                    <p className="text-xs text-destructive">{errors.years}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateSIP} className={monthlyInvestment !== "5000" || annualReturn !== "12" || years !== "10" ? "flex-1" : "w-full"} size="lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Calculate Returns
                  </Button>
                  {(monthlyInvestment !== "5000" || annualReturn !== "12" || years !== "10") && (
                    <Button 
                      onClick={() => {
                        setMonthlyInvestment("5000");
                        setAnnualReturn("12");
                        setYears("10");
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
                  <CardDescription>Understanding SIP calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Systematic Investment Plan (SIP) - Overview</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      SIP is one of the most popular and disciplined ways to invest in mutual funds. Instead of investing a 
                      lump sum, you invest a fixed amount every month, which helps you benefit from rupee cost averaging and 
                      the power of compounding. SIPs are ideal for long-term wealth creation and goal-based investing.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">How SIP Works:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Regular Investment:</strong> You invest a fixed amount (e.g., ₹5,000) 
                        every month on a predetermined date. This creates discipline and removes the need to time the market.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Rupee Cost Averaging:</strong> When markets are high, you buy fewer units. 
                        When markets are low, you buy more units. Over time, this averages out your purchase price.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Power of Compounding:</strong> Your returns earn returns, creating an 
                        exponential growth effect over long periods. The longer you stay invested, the more you benefit.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Flexibility:</strong> You can start with as low as ₹500/month, 
                        increase/decrease your SIP amount, pause, or stop anytime.
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">SIP Calculation Formula</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      The future value of SIP is calculated using the formula for future value of annuity due (since investments 
                      are made at the beginning of each month):
                    </p>
                    <div className="bg-muted/30 p-3 rounded font-mono text-xs mb-3">
                      FV = P × [((1+r)^n - 1) / r] × (1+r)
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">P:</strong> Monthly investment amount (₹)</li>
                      <li className="leading-relaxed"><strong className="text-foreground">r:</strong> Monthly return rate = Annual Return / 12</li>
                      <li className="leading-relaxed"><strong className="text-foreground">n:</strong> Total number of months = Years × 12</li>
                      <li className="leading-relaxed"><strong className="text-foreground">(1+r):</strong> Multiplier because investments are made at the beginning of each month</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                      <strong className="text-foreground">Example:</strong> ₹5,000/month for 10 years at 12% annual return
                      <br />
                      Monthly rate = 12% / 12 = 1% = 0.01
                      <br />
                      Months = 10 × 12 = 120
                      <br />
                      FV = ₹5,000 × [((1.01)^120 - 1) / 0.01] × 1.01 ≈ ₹11,61,695
                    </p>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Key Benefits of SIP</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">Disciplined Investing:</strong> Automatic deduction ensures you invest regularly</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Affordable:</strong> Start with as low as ₹500/month</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Rupee Cost Averaging:</strong> Reduces impact of market volatility</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Long-term Wealth:</strong> Over 15-20 years, SIPs can build substantial wealth</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Tax Benefits:</strong> ELSS SIPs qualify for Section 80C deduction (up to ₹1.5L)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> Returns are subject to market risks. Past performance 
                      does not guarantee future results. SIPs don&apos;t assure returns or protect against losses. Always invest based on 
                      your risk appetite and financial goals. Consider consulting a financial advisor for personalized advice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>SIP Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Investment Value</span>
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.totalValue)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Total Invested</span>
                      <span className="font-semibold">{formatCurrency(result.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Estimated Returns</span>
                      <span className="font-semibold text-success">{formatCurrency(result.estimatedReturns)}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Return Percentage:</p>
                      <p className="text-lg font-bold text-success">
                        {((result.estimatedReturns / result.totalInvested) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {result.monthlyBreakdown.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-3">Yearly Growth</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.monthlyBreakdown.map((item) => (
                          <div key={item.month} className="flex justify-between items-center text-sm">
                            <span>Year {item.month / 12}</span>
                            <span className="font-medium">{formatCurrency(item.value)}</span>
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

