"use client";

import { useState } from "react";
import { Landmark, ArrowLeft, TrendingUp, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CalculatorDisclaimer from "@/components/CalculatorDisclaimer";

export default function EPFCalculator() {
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("25");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [currentBalance, setCurrentBalance] = useState<string>("0");
  const [result, setResult] = useState<{
    monthlyContribution: number;
    employeeContribution: number;
    employerContribution: number;
    totalContribution: number;
    totalInterest: number;
    finalBalance: number;
    yearlyBreakdown: Array<{ year: number; balance: number }>;
    monthlyEmployeeContribution: number;
    monthlyEmployerContribution: number;
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

  const calculateEPF = () => {
    setErrors({});
    setResult(null);
    const basic = parseFloat(basicSalary) || 0;
    const current = parseInt(currentAge) || 0;
    const retirement = parseInt(retirementAge) || 0;
    const balance = Math.max(0, parseFloat(currentBalance) || 0);

    // STRICT VALIDATION - EPFO Policy Guardrails
    // Rule 1: Basic salary must be positive
    if (!basicSalary || basic <= 0 || isNaN(basic)) {
      setErrors(prev => ({ ...prev, basicSalary: "Basic salary must be greater than ₹0 as per EPFO rules." }));
      return;
    }

    // Rule 2: Current age must be valid
    if (!currentAge || current <= 0 || isNaN(current) || current > 100) {
      setErrors(prev => ({ ...prev, currentAge: "Please enter a valid current age (1-100 years)." }));
      return;
    }

    // Rule 3: Retirement age must be valid and greater than current age
    if (!retirementAge || retirement <= 0 || isNaN(retirement) || retirement > 100) {
      setErrors(prev => ({ ...prev, retirementAge: "Please enter a valid retirement age (1-100 years)." }));
      return;
    }

    if (current >= retirement) {
      setErrors(prev => ({ ...prev, retirementAge: "Retirement age must be greater than current age." }));
      return;
    }

    // Rule 4: Current balance cannot be negative
    if (balance < 0) {
      setErrors(prev => ({ ...prev, currentBalance: "Current EPF balance cannot be negative." }));
      return;
    }

    const years = retirement - current;
    const monthlyBasic = basic / 12;
    const employeeContribution = Math.min(monthlyBasic * 0.12, 1800);
    const employerContribution = Math.min(monthlyBasic * 0.12, 1800);
    const monthlyContribution = employeeContribution + employerContribution;
    const annualEmployeeContribution = employeeContribution * 12;
    const annualEmployerContribution = employerContribution * 12;
    const annualContribution = monthlyContribution * 12;
    const totalContribution = annualContribution * years;

    const monthlyRate = 0.0825 / 12; // 8.25% for FY 2024-25
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
      employeeContribution: annualEmployeeContribution,
      employerContribution: annualEmployerContribution,
      totalContribution,
      totalInterest,
      finalBalance,
      yearlyBreakdown,
      monthlyEmployeeContribution: employeeContribution,
      monthlyEmployerContribution: employerContribution,
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
                    type="text"
                    placeholder="600000"
                    value={basicSalary}
                    onChange={(e) => handleNumberInput(e.target.value, setBasicSalary, "basicSalary", true)}
                  />
                  {errors.basicSalary && (
                    <p className="text-xs text-destructive">{errors.basicSalary}</p>
                  )}
                  <p className="text-xs text-muted-foreground">EPF is calculated as 12% of Basic Salary, capped at ₹15,000 basic (₹1,800/month contribution)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current">Current Age</Label>
                  <Input
                    id="current"
                    type="text"
                    placeholder="25"
                    value={currentAge}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentAge, "currentAge", true)}
                  />
                  {errors.currentAge && (
                    <p className="text-xs text-destructive">{errors.currentAge}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirement">Retirement Age</Label>
                  <Input
                    id="retirement"
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
                  <Label htmlFor="balance">Current EPF Balance (₹)</Label>
                  <Input
                    id="balance"
                    type="text"
                    placeholder="0"
                    value={currentBalance}
                    onChange={(e) => handleNumberInput(e.target.value, setCurrentBalance, "currentBalance", false)}
                  />
                  {errors.currentBalance && (
                    <p className="text-xs text-destructive">{errors.currentBalance}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateEPF} className={basicSalary || currentAge !== "25" || retirementAge !== "60" || currentBalance !== "0" ? "flex-1" : "w-full"} size="lg">
                    <Landmark className="h-4 w-4 mr-2" />
                    Calculate EPF
                  </Button>
                  {(basicSalary || currentAge !== "25" || retirementAge !== "60" || currentBalance !== "0") && (
                    <Button 
                      onClick={() => {
                        setBasicSalary("");
                        setCurrentAge("25");
                        setRetirementAge("60");
                        setCurrentBalance("0");
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
                  <CardDescription>Understanding EPF calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Employee Provident Fund (EPF) - Overview</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      EPF is India&apos;s most trusted retirement savings scheme, managed by the Employees&apos; Provident Fund Organisation (EPFO). 
                      It&apos;s a mandatory contribution for salaried employees that builds a substantial retirement corpus through 
                      disciplined savings and guaranteed returns. Both you and your employer contribute equally, making it a powerful 
                      wealth-building tool.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">EPF Contribution Structure:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Employee Contribution:</strong> 12% of your Basic Salary is deducted 
                        from your salary every month. This is your mandatory savings for retirement.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Employer Contribution:</strong> Your employer also contributes 12% 
                        of Basic Salary. This is essentially free money added to your retirement corpus.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Statutory Cap:</strong> As per EPFO rules, both contributions are 
                        capped at ₹1,800/month each (when basic salary is ₹15,000 or more). This means:
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>If Basic = ₹20,000 → Employee PF = ₹1,800 (capped), Employer PF = ₹1,800 (capped)</li>
                          <li>If Basic = ₹10,000 → Employee PF = ₹1,200 (12%), Employer PF = ₹1,200 (12%)</li>
                        </ul>
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Total Monthly Contribution:</strong> Employee PF (₹1,800 max) + 
                        Employer PF (₹1,800 max) = ₹3,600/month maximum
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                    <h3 className="font-semibold mb-3 text-base text-foreground">Interest Calculation & Compounding</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      EPF offers guaranteed, tax-free returns that compound over time. The interest rate is declared annually 
                      by EPFO and is typically higher than bank FDs.
                    </p>
                    
                    <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">How Interest Works:</h4>
                    <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Current Interest Rate:</strong> 8.25% per annum (FY 2024-25) - 
                        This is guaranteed and tax-free, making EPF one of the best risk-free investments.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Monthly Compounding:</strong> Interest is calculated monthly on 
                        your opening balance plus monthly contributions, then credited annually by EPFO.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Power of Compounding:</strong> Over 30-35 years, your EPF corpus 
                        can grow to crores through the magic of compounding. The longer you stay invested, the more you benefit.
                      </li>
                      <li className="leading-relaxed">
                        <strong className="text-foreground">Tax Benefits:</strong> 
                        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                          <li>Contributions eligible for Section 80C deduction (up to ₹1.5L)</li>
                          <li>Interest earned is completely tax-free</li>
                          <li>Withdrawal at retirement is tax-free if you&apos;ve completed 5 years of service</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">Why EPF is Important</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li className="leading-relaxed"><strong className="text-foreground">Guaranteed Returns:</strong> Unlike market-linked investments, EPF offers guaranteed, risk-free returns</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Employer Matching:</strong> Your employer&apos;s contribution doubles your savings without any extra effort</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Tax Efficiency:</strong> Triple tax benefit - deduction on contribution, tax-free interest, tax-free withdrawal</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Forced Savings:</strong> Automatic deduction ensures disciplined retirement savings</li>
                      <li className="leading-relaxed"><strong className="text-foreground">Long-term Wealth:</strong> Over a 30-year career, EPF can build a corpus of ₹1-2 crores or more</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> EPF is a long-term retirement savings scheme. 
                      Withdrawals are allowed only under specific conditions (retirement, unemployment for 2+ months, medical 
                      emergency, home purchase, etc.). Avoid premature withdrawals to maximize your retirement corpus.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
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
                      <span className="text-sm font-medium">Employee PF (Monthly)</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyEmployeeContribution)}</span>
                      <span className="text-xs text-muted-foreground">(12% of Basic, max ₹1,800)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Employer PF (Monthly)</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyEmployerContribution)}</span>
                      <span className="text-xs text-muted-foreground">(12% of Basic, max ₹1,800)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Total Monthly Contribution</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyContribution)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Employee PF (Annual)</span>
                      <span className="font-semibold">{formatCurrency(result.employeeContribution)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">Employer PF (Annual)</span>
                      <span className="font-semibold">{formatCurrency(result.employerContribution)}</span>
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

