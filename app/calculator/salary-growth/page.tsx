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

export default function SalaryGrowthCalculator() {
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [annualHike, setAnnualHike] = useState<string>("10");
  const [years, setYears] = useState<string>("5");
  const [result, setResult] = useState<{
    yearlyBreakdown: Array<{ year: number; salary: number; increase: number }>;
    totalGrowth: number;
    finalSalary: number;
  } | null>(null);

  const calculateGrowth = () => {
    const salary = parseFloat(currentSalary);
    const hike = parseFloat(annualHike) / 100;
    const yearsValue = parseInt(years);

    if (!salary || !hike || !yearsValue || salary <= 0 || yearsValue <= 0) {
      alert("Please enter valid values");
      return;
    }

    const breakdown = [];
    let current = salary;
    let totalGrowth = 0;

    for (let year = 1; year <= yearsValue; year++) {
      const increase = current * hike;
      current = current + increase;
      totalGrowth += increase;
      breakdown.push({
        year,
        salary: current,
        increase,
      });
    }

    setResult({
      yearlyBreakdown: breakdown,
      totalGrowth,
      finalSalary: current,
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
                <h1 className="text-3xl font-bold text-foreground">Salary Growth Tracker</h1>
                <p className="text-muted-foreground">Project your salary growth over the years</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Details</CardTitle>
                <CardDescription>Track your salary progression</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="salary">Current Annual Salary (₹)</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="1000000"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hike">Expected Annual Hike (%)</Label>
                  <Input
                    id="hike"
                    type="number"
                    placeholder="10"
                    value={annualHike}
                    onChange={(e) => setAnnualHike(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Projection Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="5"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>

                <Button onClick={calculateGrowth} className="w-full" size="lg">
                  <TrendingUp className="h-5 w-5" />
                  Calculate Growth
                </Button>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Salary Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Final Salary</span>
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.finalSalary)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total Growth: {formatCurrency(result.totalGrowth)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Yearly Breakdown</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.yearlyBreakdown.map((item) => (
                        <div key={item.year} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-sm font-medium">Year {item.year}</p>
                            <p className="text-xs text-muted-foreground">
                              Increase: {formatCurrency(item.increase)}
                            </p>
                          </div>
                          <span className="font-semibold">{formatCurrency(item.salary)}</span>
                        </div>
                      ))}
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

