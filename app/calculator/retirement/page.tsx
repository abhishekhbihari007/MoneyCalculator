"use client";

import { useState } from "react";
import { Target, ArrowLeft, DollarSign, TrendingUp } from "lucide-react";
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
  } | null>(null);

  const calculateRetirement = () => {
    const age = parseInt(currentAge);
    const retire = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthly = parseFloat(monthlySavings);
    const returnRate = parseFloat(expectedReturn) / 100 / 12;
    const inflationRate = parseFloat(inflation) / 100;

    if (!age || !retire || age >= retire) {
      alert("Please enter valid ages");
      return;
    }

    const yearsToRetirement = retire - age;
    const monthsToRetirement = yearsToRetirement * 12;

    // Calculate corpus at retirement
    let corpus = savings;
    for (let i = 0; i < monthsToRetirement; i++) {
      corpus = corpus * (1 + returnRate) + monthly;
    }

    // Estimate monthly expense at retirement (assuming current expense = monthly savings * 2)
    const currentMonthlyExpense = monthly * 2;
    const futureMonthlyExpense = currentMonthlyExpense * Math.pow(1 + inflationRate, yearsToRetirement);

    // Calculate corpus needed (assuming 30 years post-retirement, 4% withdrawal rate)
    const annualExpense = futureMonthlyExpense * 12;
    const corpusNeeded = annualExpense / 0.04; // 4% safe withdrawal rate

    const shortfall = Math.max(0, corpusNeeded - corpus);

    setResult({
      retirementCorpus: corpus,
      monthlyExpense: futureMonthlyExpense,
      corpusNeeded,
      shortfall,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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
                    type="number"
                    placeholder="30"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retire">Retirement Age</Label>
                  <Input
                    id="retire"
                    type="number"
                    placeholder="60"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings">Current Savings (₹)</Label>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="500000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Savings (₹)</Label>
                  <Input
                    id="monthly"
                    type="number"
                    placeholder="20000"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return">Expected Return (%)</Label>
                  <Input
                    id="return"
                    type="number"
                    placeholder="12"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflation">Expected Inflation (%)</Label>
                  <Input
                    id="inflation"
                    type="number"
                    placeholder="6"
                    value={inflation}
                    onChange={(e) => setInflation(e.target.value)}
                  />
                </div>

                <Button onClick={calculateRetirement} className="w-full" size="lg">
                  <Target className="h-5 w-5" />
                  Calculate Retirement Plan
                </Button>
              </CardContent>
            </Card>

            {result && (
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Consider increasing monthly savings to bridge this gap
                        </p>
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

