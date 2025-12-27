"use client";

import { useState } from "react";
import { Landmark, ArrowLeft, DollarSign, TrendingUp } from "lucide-react";
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
  const [result, setResult] = useState<{
    maturityAmount: number;
    interestEarned: number;
    effectiveRate: number;
    yearlyBreakdown: Array<{ year: number; principal: number; interest: number; maturity: number }>;
  } | null>(null);

  const calculateFD = () => {
    const principalAmount = parseFloat(principal);
    const rate = parseFloat(interestRate) / 100;
    const years = parseFloat(tenure);

    if (!principalAmount || !rate || !years || principalAmount <= 0 || years <= 0) {
      alert("Please enter valid values");
      return;
    }

    let n = 1;
    if (compounding === "quarterly") n = 4;
    else if (compounding === "monthly") n = 12;
    else n = 1;

    const maturityAmount = principalAmount * Math.pow(1 + rate / n, n * years);
    const interestEarned = maturityAmount - principalAmount;
    const effectiveRate = (Math.pow(1 + rate / n, n) - 1) * 100;

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
      yearlyBreakdown: yearlyBreakdown.slice(0, Math.ceil(years)),
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
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20 pt-16">
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
                    type="number"
                    placeholder="100000"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Interest Rate (% per annum)</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="7"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Typical FD rates: 6% - 8%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenure">Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    placeholder="5"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                  />
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

                <Button onClick={calculateFD} className="w-full" size="lg">
                  <Landmark className="h-5 w-5" />
                  Calculate FD
                </Button>
              </CardContent>
            </Card>

            {result && (
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
                      <span className="font-semibold">{formatCurrency(parseFloat(principal))}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Interest Earned</span>
                      <span className="font-semibold text-success">{formatCurrency(result.interestEarned)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Effective Rate</span>
                      <span className="font-semibold">{result.effectiveRate.toFixed(2)}%</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Return Percentage:</p>
                      <p className="text-lg font-bold text-success">
                        {((result.interestEarned / parseFloat(principal)) * 100).toFixed(2)}%
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




