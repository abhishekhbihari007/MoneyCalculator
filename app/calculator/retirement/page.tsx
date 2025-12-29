"use client";

import { useState } from "react";
import { Target, ArrowLeft, DollarSign, TrendingUp, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [currentSavings, setCurrentSavings] = useState<string>("500000");
  const [monthlySavings, setMonthlySavings] = useState<string>("20000");
  const [expectedReturn, setExpectedReturn] = useState<string>("12");
  const [inflation, setInflation] = useState<string>("6");
  const [result, setResult] = useState<{
    retirementCorpus: number;
    monthlyExpense: number;
    corpusNeeded: number;
    shortfall: number;
    monthlyInvestmentNeeded: number;
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

  const calculateRetirement = () => {
    setErrors({});
    setResult(null);
    const age = parseInt(currentAge) || 0;
    const retire = parseInt(retirementAge) || 0;
    const savings = parseFloat(currentSavings || "0") || 0;
    const monthly = parseFloat(monthlySavings || "0") || 0;
    const expectedReturnValue = parseFloat(expectedReturn || "0") || 12;
    const inflationValue = parseFloat(inflation || "0") || 6;

    // STRICT VALIDATION - Policy Guardrails
    // Rule 1: Current age must be valid
    if (!currentAge || age <= 0 || isNaN(age) || age > 100) {
      setErrors(prev => ({ ...prev, currentAge: "Please enter a valid current age (1-100 years)." }));
      return;
    }

    // Rule 2: Retirement age must be valid
    if (!retirementAge || retire <= 0 || isNaN(retire) || retire > 100) {
      setErrors(prev => ({ ...prev, retirementAge: "Please enter a valid retirement age (1-100 years)." }));
      return;
    }

    if (age >= retire) {
      setErrors(prev => ({ ...prev, retirementAge: "Retirement age must be greater than current age." }));
      return;
    }

    // Rule 3: Current savings cannot be negative
    if (savings < 0) {
      setErrors(prev => ({ ...prev, currentSavings: "Current savings cannot be negative." }));
      return;
    }

    // Rule 4: Monthly savings cannot be negative
    if (monthly < 0) {
      setErrors(prev => ({ ...prev, monthlySavings: "Monthly savings cannot be negative." }));
      return;
    }

    // Rule 5: Expected return must be within realistic limits (0-30%)
    if (expectedReturnValue < 0 || expectedReturnValue > 30) {
      setErrors(prev => ({ ...prev, expectedReturn: "Expected return must be between 0% and 30%." }));
      return;
    }

    // Rule 6: Inflation rate must be within realistic limits (0-20%)
    if (inflationValue < 0 || inflationValue > 20) {
      setErrors(prev => ({ ...prev, inflation: "Inflation rate must be between 0% and 20%." }));
      return;
    }
    
    const returnRate = expectedReturnValue / 100 / 12;
    const inflationRate = inflationValue / 100;

    const yearsToRetirement = retire - age;
    const monthsToRetirement = yearsToRetirement * 12;

    let corpus = savings;
    for (let i = 0; i < monthsToRetirement; i++) {
      corpus = corpus * (1 + returnRate) + monthly;
    }

    const currentMonthlyExpense = monthly * 2;
    const futureMonthlyExpense = currentMonthlyExpense * Math.pow(1 + inflationRate, yearsToRetirement);

    const annualExpense = futureMonthlyExpense * 12;
    // 4% safe withdrawal rule: corpus needed = annual expense / 0.04
    const corpusNeeded = annualExpense / 0.04;

    const shortfall = Math.max(0, corpusNeeded - corpus);
    
    // Calculate monthly investment needed to bridge the shortfall
    // Using future value of annuity formula: FV = P * [((1+r)^n - 1) / r]
    // Solving for P: P = FV * r / ((1+r)^n - 1)
    let monthlyInvestmentNeeded = 0;
    if (shortfall > 0 && monthsToRetirement > 0) {
      const monthlyRate = returnRate;
      const fvFactor = (Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate;
      monthlyInvestmentNeeded = shortfall / fvFactor;
    }

    setResult({
      retirementCorpus: corpus,
      monthlyExpense: futureMonthlyExpense,
      corpusNeeded,
      shortfall,
      monthlyInvestmentNeeded,
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
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Retirement Planner</h1>
                <p className="text-muted-foreground">Plan your path to financial freedom</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>Calculate your retirement corpus requirement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Current Age</Label>
                  <Input
                    id="age"
                    type="text"
                    placeholder="30"
                    value={currentAge}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentAge, "currentAge", true)}
                  />
                  {errors.currentAge && (
                    <p className="text-xs text-destructive">{errors.currentAge}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retire">Retirement Age</Label>
                  <Input
                    id="retire"
                    type="text"
                    placeholder="60"
                    value={retirementAge}
                    onChange={(e) => handleNumberInput(e.target.value, setRetirementAge, "retirementAge", true)}
                  />
                  {errors.retirementAge && (
                    <p className="text-xs text-destructive">{errors.retirementAge}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings">Current Savings (₹)</Label>
                  <Input
                    id="savings"
                    type="text"
                    placeholder="500000"
                    value={currentSavings}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentSavings, "currentSavings", false)}
                  />
                  {errors.currentSavings && (
                    <p className="text-xs text-destructive">{errors.currentSavings}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Savings (₹)</Label>
                  <Input
                    id="monthly"
                    type="text"
                    placeholder="20000"
                    value={monthlySavings}
                    onChange={(e) => handleNumberInput(e.target.value, setMonthlySavings, "monthlySavings", false)}
                  />
                  {errors.monthlySavings && (
                    <p className="text-xs text-destructive">{errors.monthlySavings}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return">Expected Return (%)</Label>
                  <Input
                    id="return"
                    type="text"
                    placeholder="12"
                    value={expectedReturn}
                    onChange={(e) => handleNumberInput(e.target.value, setExpectedReturn, "expectedReturn", false)}
                  />
                  {errors.expectedReturn && (
                    <p className="text-xs text-destructive">{errors.expectedReturn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflation">Expected Inflation (%)</Label>
                  <Input
                    id="inflation"
                    type="text"
                    placeholder="6"
                    value={inflation}
                    onChange={(e) => handleNumberInput(e.target.value, setInflation, "inflation", false)}
                  />
                  {errors.inflation && (
                    <p className="text-xs text-destructive">{errors.inflation}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateRetirement} className={currentAge !== "30" || retirementAge !== "60" || currentSavings !== "500000" || monthlySavings !== "20000" || expectedReturn !== "12" || inflation !== "6" ? "flex-1" : "w-full"} size="lg">
                    <Target className="h-5 w-5 mr-2" />
                    Calculate Retirement Plan
                  </Button>
                  {(currentAge !== "30" || retirementAge !== "60" || currentSavings !== "500000" || monthlySavings !== "20000" || expectedReturn !== "12" || inflation !== "6") && (
                    <Button 
                      onClick={() => {
                        setCurrentAge("30");
                        setRetirementAge("60");
                        setCurrentSavings("500000");
                        setMonthlySavings("20000");
                        setExpectedReturn("12");
                        setInflation("6");
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
                  <CardDescription>Understanding retirement planning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-semibold mb-2 text-sm">Retirement Corpus Calculation</h3>
                      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Current savings grow with expected returns (compounded monthly)</li>
                        <li>Monthly savings are added and grow over time</li>
                        <li>Final corpus = Current Savings × (1+r)^n + Monthly SIP × [((1+r)^n - 1) / r]</li>
                      </ol>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                      <h3 className="font-semibold mb-2 text-sm">Required Corpus (4% Rule)</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>Future monthly expenses adjusted for inflation</li>
                        <li>Annual expenses = Monthly expenses × 12</li>
                        <li>Required corpus = Annual expenses / 0.04 (4% safe withdrawal rate)</li>
                        <li>This ensures your corpus lasts 25+ years</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> The 4% rule is a conservative estimate. 
                        Adjust based on your risk tolerance and expected returns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Retirement Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Retirement Corpus</span>
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.retirementCorpus)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Corpus Needed</span>
                      <span className="font-semibold">{formatCurrency(result.corpusNeeded)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Monthly Expense (at retirement)</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyExpense)}</span>
                    </div>
                    {result.shortfall > 0 ? (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm font-medium text-destructive mb-1">Shortfall</p>
                        <p className="text-2xl font-bold text-destructive">{formatCurrency(result.shortfall)}</p>
                        <div className="mt-3 pt-3 border-t border-destructive/20">
                          <p className="text-xs text-muted-foreground mb-1">Monthly Investment Needed:</p>
                          <p className="text-lg font-bold text-destructive">{formatCurrency(result.monthlyInvestmentNeeded)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Additional monthly savings required to bridge the gap
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-sm font-medium text-success mb-1">On Track!</p>
                        <p className="text-sm text-muted-foreground">
                          Your projected corpus exceeds the required amount
                        </p>
                      </div>
                    )}
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

