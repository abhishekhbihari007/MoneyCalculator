"use client";

import { useState } from "react";
import { PiggyBank, ArrowLeft, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NPSCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState<string>("5000");
  const [employeeContribution, setEmployeeContribution] = useState<string>("5000");
  const [employerContribution, setEmployerContribution] = useState<string>("5000");
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [expectedReturn, setExpectedReturn] = useState<string>("10");
  const [result, setResult] = useState<{
    totalContributed: number;
    totalCorpus: number;
    estimatedReturns: number;
    monthlyPension: number;
    lumpSum: number;
    annuity: number;
  } | null>(null);

  const calculateNPS = () => {
    const monthly = parseFloat(monthlyContribution);
    const empCont = parseFloat(employeeContribution);
    const empContEmployer = parseFloat(employerContribution);
    const age = parseInt(currentAge);
    const retireAge = parseInt(retirementAge);
    const rate = parseFloat(expectedReturn) / 100 / 12; // Monthly rate
    const months = (retireAge - age) * 12;

    if (!monthly || !age || !retireAge || months <= 0) {
      alert("Please enter valid values");
      return;
    }

    const totalMonthly = empCont + empContEmployer;
    const totalContributed = totalMonthly * months;
    
    // NPS corpus calculation
    let corpus = 0;
    for (let i = 0; i < months; i++) {
      corpus = (corpus + totalMonthly) * (1 + rate);
    }
    
    const estimatedReturns = corpus - totalContributed;
    
    // At retirement: 60% lump sum, 40% annuity
    const lumpSum = corpus * 0.6;
    const annuity = corpus * 0.4;
    
    // Monthly pension from annuity (assuming 6% annuity rate)
    const monthlyPension = (annuity * 0.06) / 12;

    setResult({
      totalContributed,
      totalCorpus: corpus,
      estimatedReturns,
      monthlyPension,
      lumpSum,
      annuity,
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
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>NPS Contribution Details</CardTitle>
                <CardDescription>Enter your monthly NPS contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Monthly Contribution (₹)</Label>
                  <Input
                    type="number"
                    value={employeeContribution}
                    onChange={(e) => setEmployeeContribution(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Your contribution (up to ₹1.5L tax benefit)</p>
                </div>

                <div>
                  <Label>Employer Contribution (₹)</Label>
                  <Input
                    type="number"
                    value={employerContribution}
                    onChange={(e) => setEmployerContribution(e.target.value)}
                    placeholder="e.g., 5000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Employer&apos;s NPS contribution (if applicable)</p>
                </div>

                <div>
                  <Label>Current Age</Label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <Label>Retirement Age</Label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <Label>Expected Annual Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    placeholder="e.g., 10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">NPS typically returns 8-12% annually</p>
                </div>

                <Button onClick={calculateNPS} className="w-full" size="lg">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Calculate NPS Wealth
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>NPS Projection</CardTitle>
                <CardDescription>Your retirement corpus breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
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
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">At Retirement (60% Lump Sum + 40% Annuity)</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Lump Sum (60%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.lumpSum)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                          <span className="text-sm">Annuity Corpus (40%)</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.annuity)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded">
                          <span className="text-sm">Estimated Monthly Pension</span>
                          <span className="font-semibold text-accent">{formatCurrency(result.monthlyPension)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your NPS details and click &quot;Calculate&quot; to see your retirement wealth</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

