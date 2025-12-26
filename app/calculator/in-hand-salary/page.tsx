"use client";

import { useState } from "react";
import { Calculator, ArrowLeft, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface SalaryBreakdown {
  grossSalary: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  pfEmployee: number;
  pfEmployer: number;
  esic: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netSalary: number;
  ctc: number;
}

export default function InHandSalaryCalculator() {
  const [ctc, setCtc] = useState<string>("");
  const [basicPercentage, setBasicPercentage] = useState<string>("40");
  const [hraPercentage, setHraPercentage] = useState<string>("50");
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("new");
  const [age, setAge] = useState<string>("30");
  const [result, setResult] = useState<SalaryBreakdown | null>(null);

  const calculateSalary = () => {
    const ctcValue = parseFloat(ctc);
    if (!ctcValue || ctcValue <= 0) {
      alert("Please enter a valid CTC");
      return;
    }

    const basicPercent = parseFloat(basicPercentage) / 100;
    const hraPercent = parseFloat(hraPercentage) / 100;
    const ageValue = parseInt(age);

    // Calculate components
    const basicSalary = ctcValue * basicPercent;
    const hra = Math.min(basicSalary * hraPercent, basicSalary * 0.5); // HRA is min of 50% of basic or actual
    const specialAllowance = ctcValue - basicSalary - hra;

    // EPF calculations (12% of basic, capped at 1800 per month)
    const pfEmployee = Math.min(basicSalary * 0.12, 1800 * 12);
    const pfEmployer = Math.min(basicSalary * 0.12, 1800 * 12);

    // ESIC (0.75% of gross if gross <= 21000, else 0)
    const grossSalary = basicSalary + hra + specialAllowance;
    const esic = grossSalary <= 21000 * 12 ? grossSalary * 0.0075 : 0;

    // Professional Tax (varies by state, using average 200/month)
    const professionalTax = 200 * 12;

    // Income Tax calculation (simplified)
    const taxableIncome = grossSalary - hra - pfEmployee - professionalTax;
    let incomeTax = 0;

    if (taxRegime === "new") {
      // New tax regime slabs (FY 2024-25)
      if (taxableIncome > 1500000) {
        incomeTax = (taxableIncome - 1500000) * 0.30 + 150000;
      } else if (taxableIncome > 1200000) {
        incomeTax = (taxableIncome - 1200000) * 0.20 + 90000;
      } else if (taxableIncome > 900000) {
        incomeTax = (taxableIncome - 900000) * 0.15 + 45000;
      } else if (taxableIncome > 700000) {
        incomeTax = (taxableIncome - 700000) * 0.10 + 25000;
      } else if (taxableIncome > 500000) {
        incomeTax = (taxableIncome - 500000) * 0.05 + 12500;
      } else if (taxableIncome > 300000) {
        incomeTax = (taxableIncome - 300000) * 0.05;
      }
    } else {
      // Old tax regime with deductions
      const standardDeduction = 50000;
      const section80C = Math.min(150000, grossSalary * 0.3); // Assuming max 80C
      const section80D = ageValue < 60 ? 25000 : 50000; // Health insurance
      const taxableIncomeOld = Math.max(0, taxableIncome - standardDeduction - section80C - section80D);

      if (taxableIncomeOld > 1000000) {
        incomeTax = (taxableIncomeOld - 1000000) * 0.30 + 112500;
      } else if (taxableIncomeOld > 500000) {
        incomeTax = (taxableIncomeOld - 500000) * 0.20 + 12500;
      } else if (taxableIncomeOld > 250000) {
        incomeTax = (taxableIncomeOld - 250000) * 0.05;
      }
    }

    // Add cess (4% of income tax)
    incomeTax = incomeTax * 1.04;

    const totalDeductions = pfEmployee + esic + professionalTax + incomeTax;
    const netSalary = grossSalary - totalDeductions;

    setResult({
      grossSalary,
      basicSalary,
      hra,
      specialAllowance,
      pfEmployee,
      pfEmployer,
      esic,
      professionalTax,
      incomeTax,
      totalDeductions,
      netSalary,
      ctc: ctcValue,
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
          {/* Back Button */}
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">In-Hand Salary Calculator</h1>
                <p className="text-muted-foreground">Calculate your take-home salary after all deductions</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>Fill in your salary information to calculate your in-hand salary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ctc">Annual CTC (Cost to Company)</Label>
                  <Input
                    id="ctc"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic">Basic Salary Percentage (%)</Label>
                  <Input
                    id="basic"
                    type="number"
                    placeholder="40"
                    value={basicPercentage}
                    onChange={(e) => setBasicPercentage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Typically 40-50% of CTC</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hra">HRA Percentage of Basic (%)</Label>
                  <Input
                    id="hra"
                    type="number"
                    placeholder="50"
                    value={hraPercentage}
                    onChange={(e) => setHraPercentage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Usually 40-50% of basic salary</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Your Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regime">Tax Regime</Label>
                  <select
                    id="regime"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={taxRegime}
                    onChange={(e) => setTaxRegime(e.target.value as "old" | "new")}
                  >
                    <option value="new">New Tax Regime</option>
                    <option value="old">Old Tax Regime</option>
                  </select>
                </div>

                <Button onClick={calculateSalary} className="w-full" size="lg">
                  <Calculator className="h-5 w-5" />
                  Calculate Salary
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Salary Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Monthly In-Hand Salary</span>
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(result.netSalary / 12)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Annual: {formatCurrency(result.netSalary)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Gross Salary</span>
                      <span className="font-semibold">{formatCurrency(result.grossSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Basic Salary</span>
                      <span>{formatCurrency(result.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">HRA</span>
                      <span>{formatCurrency(result.hra)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Special Allowance</span>
                      <span>{formatCurrency(result.specialAllowance)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-3 text-destructive">Deductions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">EPF (Employee)</span>
                        <span>{formatCurrency(result.pfEmployee)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">ESIC</span>
                        <span>{formatCurrency(result.esic)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Professional Tax</span>
                        <span>{formatCurrency(result.professionalTax)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Income Tax</span>
                        <span>{formatCurrency(result.incomeTax)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t font-semibold">
                        <span>Total Deductions</span>
                        <span className="text-destructive">{formatCurrency(result.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CTC</span>
                      <span className="font-bold text-lg">{formatCurrency(result.ctc)}</span>
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

