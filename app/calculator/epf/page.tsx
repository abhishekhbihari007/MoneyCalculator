"use client";

import { useState } from "react";
import { Landmark, ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function EPFCalculator() {
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("25");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [result, setResult] = useState<{
    monthlyContribution: number;
    totalContribution: number;
    totalInterest: number;
    finalBalance: number;
    yearlyBreakdown: Array<{ year: number; balance: number }>;
  } | null>(null);

  const calculateEPF = () => {
    const basic = parseFloat(basicSalary);
    const current = parseInt(currentAge);
    const retirement = parseInt(retirementAge);
    const balance = parseFloat(currentBalance);

    if (!basic || basic <= 0 || current >= retirement) {
      alert("Please enter valid values");
      return;
    }

    const years = retirement - current;
    const monthlyBasic = basic / 12;
    const employeeContribution = Math.min(monthlyBasic * 0.12, 1800); // 12% capped at 1800
    const employerContribution = Math.min(monthlyBasic * 0.12, 1800);
    const monthlyContribution = employeeContribution + employerContribution;
    const annualContribution = monthlyContribution * 12;
    const totalContribution = annualContribution * years;

    // EPF interest rate (assumed 8.5% annually, compounded monthly)
    const monthlyRate = 0.085 / 12;
    let finalBalance = balance;
    const yearlyBreakdown = [];

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        finalBalance = finalBalance * (1 + monthlyRate) + monthlyContribution;
      }
      yearlyBreakdown.push({
        year: current + year,
        balance: finalBalance,
      });
    }

    const totalInterest = finalBalance - totalContribution - balance;

    setResult({
      monthlyContribution,
      totalContribution,
      totalInterest,
      finalBalance,
      yearlyBreakdown,
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
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">EPF Accumulator</h1>
                <p className="text-muted-foreground">Project your Employee Provident Fund growth</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter EPF Details</CardTitle>
                <CardDescription>Calculate your EPF corpus at retirement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="basic">Annual Basic Salary (₹)</Label>
                  <Input
                    id="basic"
                    type="number"
                    placeholder="600000"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current">Current Age</Label>
                  <Input
                    id="current"
                    type="number"
                    placeholder="25"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirement">Retirement Age</Label>
                  <Input
                    id="retirement"
                    type="number"
                    placeholder="60"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Current EPF Balance (₹)</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                  />
                </div>

                <Button onClick={calculateEPF} className="w-full" size="lg">
                  <Landmark className="h-5 w-5" />
                  Calculate EPF
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>EPF Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Final EPF Balance</span>
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.finalBalance)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Monthly Contribution</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyContribution)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Total Contribution</span>
                      <span className="font-semibold">{formatCurrency(result.totalContribution)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Total Interest Earned</span>
                      <span className="font-semibold text-success">{formatCurrency(result.totalInterest)}</span>
                    </div>
                  </div>

                  {result.yearlyBreakdown.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold mb-3">Yearly Growth</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.yearlyBreakdown.slice(-10).map((item) => (
                          <div key={item.year} className="flex justify-between items-center text-sm">
                            <span>Age {item.year}</span>
                            <span className="font-medium">{formatCurrency(item.balance)}</span>
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

