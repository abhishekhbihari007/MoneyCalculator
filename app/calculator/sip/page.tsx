"use client";

import { useState } from "react";
import { TrendingUp, ArrowLeft, DollarSign } from "lucide-react";
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

  const calculateSIP = () => {
    const monthly = parseFloat(monthlyInvestment);
    const rate = parseFloat(annualReturn) / 100 / 12; // Monthly rate
    const months = parseInt(years) * 12;

    if (!monthly || !rate || !months || monthly <= 0 || months <= 0) {
      alert("Please enter valid values");
      return;
    }

    // SIP formula: M * [((1 + r)^n - 1) / r] * (1 + r)
    const totalInvested = monthly * months;
    const futureValue = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const estimatedReturns = futureValue - totalInvested;

    // Generate monthly breakdown (sample every 12 months)
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
                    type="number"
                    placeholder="5000"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return">Expected Annual Return (%)</Label>
                  <Input
                    id="return"
                    type="number"
                    placeholder="12"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Typical equity returns: 10-15%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Investment Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="10"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>

                <Button onClick={calculateSIP} className="w-full" size="lg">
                  <TrendingUp className="h-5 w-5" />
                  Calculate Returns
                </Button>
              </CardContent>
            </Card>

            {result && (
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

