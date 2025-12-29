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

export default function SalaryGrowthCalculator() {
  const [currentSalary, setCurrentSalary] = useState<string>("");
  const [annualHike, setAnnualHike] = useState<string>("10");
  const [years, setYears] = useState<string>("5");
  const [inflation, setInflation] = useState<string>("6");
  const [result, setResult] = useState<{
    yearlyBreakdown: Array<{ 
      year: number; 
      nominalSalary: number; 
      realSalary: number; 
      increase: number;
      inflationImpact: number;
    }>;
    totalGrowth: number;
    finalNominalSalary: number;
    finalRealSalary: number;
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

  const calculateGrowth = () => {
    setErrors({});
    setResult(null);
    const salary = parseFloat(currentSalary) || 0;
    const hikeValue = parseFloat(annualHike || "0") || 0;
    const hike = hikeValue / 100;
    const inflationValue = parseFloat(inflation || "0") || 0;
    const inflationRate = inflationValue / 100;
    const yearsValue = parseInt(years) || 0;

    // STRICT VALIDATION - Policy Guardrails
    // Rule 1: Current salary must be positive
    if (!currentSalary || salary <= 0 || isNaN(salary)) {
      setErrors(prev => ({ ...prev, currentSalary: "Current salary must be greater than ₹0. Please enter a valid amount." }));
      return;
    }

    // Rule 2: Annual hike cannot be negative
    if (hikeValue < 0) {
      setErrors(prev => ({ ...prev, annualHike: "Annual hike percentage cannot be negative." }));
      return;
    }

    // Rule 3: Annual hike must be within realistic limits (0-100%)
    if (hikeValue > 100) {
      setErrors(prev => ({ ...prev, annualHike: "Annual hike percentage cannot exceed 100%. Please enter a realistic value." }));
      return;
    }

    // Rule 4: Inflation rate cannot be negative
    if (inflationValue < 0) {
      setErrors(prev => ({ ...prev, inflation: "Inflation rate cannot be negative." }));
      return;
    }

    // Rule 5: Inflation rate must be within realistic limits (0-20%)
    if (inflationValue > 20) {
      setErrors(prev => ({ ...prev, inflation: "Inflation rate cannot exceed 20%. Please enter a realistic value." }));
      return;
    }

    // Rule 6: Years must be positive
    if (!years || yearsValue <= 0 || isNaN(yearsValue)) {
      setErrors(prev => ({ ...prev, years: "Projection period must be greater than 0 years. Please enter a valid number." }));
      return;
    }

    // Rule 7: Years must be reasonable (max 50 years)
    if (yearsValue > 50) {
      setErrors(prev => ({ ...prev, years: "Projection period cannot exceed 50 years. Please enter a realistic timeframe." }));
      return;
    }

    // Use compound annual growth for salary
    const breakdown = [];
    let nominalSalary = salary;
    let totalGrowth = 0;
    const baseYearValue = salary; // For inflation adjustment

    for (let year = 1; year <= yearsValue; year++) {
      // Compound growth: salary grows by hike% each year
      const previousSalary = nominalSalary;
      nominalSalary = previousSalary * (1 + hike);
      const increase = nominalSalary - previousSalary;
      totalGrowth += increase;

      // Calculate real salary (inflation-adjusted) - discount future value to present value
      // Real salary = Nominal salary / (1 + inflation)^year
      const realSalary = nominalSalary / Math.pow(1 + inflationRate, year);
      const inflationImpact = nominalSalary - realSalary;

      breakdown.push({
        year,
        nominalSalary,
        realSalary,
        increase,
        inflationImpact,
      });
    }

    const finalRealSalary = nominalSalary / Math.pow(1 + inflationRate, yearsValue);

    setResult({
      yearlyBreakdown: breakdown,
      totalGrowth,
      finalNominalSalary: nominalSalary,
      finalRealSalary,
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
                    type="text"
                    placeholder="1000000"
                    value={currentSalary}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentSalary, "currentSalary", true)}
                  />
                  {errors.currentSalary && (
                    <p className="text-xs text-destructive">{errors.currentSalary}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hike">Expected Annual Hike (%)</Label>
                  <Input
                    id="hike"
                    type="text"
                    placeholder="10"
                    value={annualHike}
                    onChange={(e) => handleNumberInput(e.target.value, setAnnualHike, "annualHike", false)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Projection Period (Years)</Label>
                  <Input
                    id="years"
                    type="text"
                    placeholder="5"
                    value={years}
                    onChange={(e) => handleNumberInput(e.target.value, setYears, "years", true)}
                  />
                  {errors.years && (
                    <p className="text-xs text-destructive">{errors.years}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inflation">Expected Inflation Rate (%)</Label>
                  <Input
                    id="inflation"
                    type="text"
                    placeholder="6"
                    value={inflation}
                    onChange={(e) => handleNumberInput(e.target.value, setInflation, "inflation", false)}
                  />
                  <p className="text-xs text-muted-foreground">Used to calculate real (inflation-adjusted) salary</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateGrowth} className={currentSalary || annualHike !== "10" || years !== "5" || inflation !== "6" ? "flex-1" : "w-full"} size="lg">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Calculate Growth
                  </Button>
                  {(currentSalary || annualHike !== "10" || years !== "5" || inflation !== "6") && (
                    <Button 
                      onClick={() => {
                        setCurrentSalary("");
                        setAnnualHike("10");
                        setYears("5");
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
                  <CardDescription>Understanding salary growth projection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-semibold mb-2 text-sm">Salary Growth Calculation</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>Uses compound annual growth rate (CAGR)</li>
                        <li>Each year, salary increases by the specified percentage</li>
                        <li>Formula: New Salary = Previous Salary × (1 + Hike%)</li>
                        <li>Shows year-wise breakdown with increase amounts</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                      <h3 className="font-semibold mb-2 text-sm">Inflation Adjustment</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li><strong>Nominal Salary:</strong> Actual salary amount in future years</li>
                        <li><strong>Real Salary:</strong> Purchasing power adjusted for inflation</li>
                        <li>Real Salary = Nominal Salary / (1 + Inflation)^Years</li>
                        <li>Helps understand actual value of future income</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Inflation reduces purchasing power over time. 
                        A higher salary may not mean better lifestyle if inflation is high.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Salary Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Final Nominal Salary</span>
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                      <p className="text-3xl font-bold text-success">{formatCurrency(result.finalNominalSalary)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total Growth: {formatCurrency(result.totalGrowth)}
                      </p>
                    </div>

                    <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Final Real Salary (Inflation-Adjusted)</span>
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold text-primary">{formatCurrency(result.finalRealSalary)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Purchasing power in today&apos;s terms
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <h3 className="text-sm font-semibold">Yearly Breakdown</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {result.yearlyBreakdown.map((item) => (
                        <div key={item.year} className="p-3 rounded-lg bg-muted/50 border">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">Year {item.year}</p>
                            <div className="text-right">
                              <p className="text-sm font-semibold">{formatCurrency(item.nominalSalary)}</p>
                              <p className="text-xs text-muted-foreground">Real: {formatCurrency(item.realSalary)}</p>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Increase: {formatCurrency(item.increase)}</span>
                            <span>Inflation Impact: {formatCurrency(item.inflationImpact)}</span>
                          </div>
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

