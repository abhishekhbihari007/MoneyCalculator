"use client";

import { useState } from "react";
import { Shield, ArrowLeft, Calculator, Info, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermInsuranceCalculator() {
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [retirementAge, setRetirementAge] = useState<string>("60");
  const [outstandingDebts, setOutstandingDebts] = useState<string>("0");
  const [existingAssets, setExistingAssets] = useState<string>("0");
  const [dependents, setDependents] = useState<string>("1");
  const [result, setResult] = useState<{
    recommendedCoverage: number;
    coverageMultiplier: number;
    yearsToRetirement: number;
    incomeReplacement: number;
    debtCoverage: number;
    assetAdjustment: number;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const calculateTermInsurance = () => {
    setErrors({});
    setResult(null);

    const income = parseFloat(annualIncome) || 0;
    const current = parseInt(currentAge) || 0;
    const retirement = parseInt(retirementAge) || 0;
    const debts = Math.max(0, parseFloat(outstandingDebts) || 0);
    const assets = Math.max(0, parseFloat(existingAssets) || 0);
    const deps = Math.max(0, parseInt(dependents) || 0);

    // Validation
    if (!annualIncome || income <= 0 || isNaN(income)) {
      setErrors(prev => ({ ...prev, annualIncome: "Annual income must be greater than ₹0." }));
      return;
    }

    if (!currentAge || current <= 0 || isNaN(current) || current > 100) {
      setErrors(prev => ({ ...prev, currentAge: "Please enter a valid current age (1-100 years)." }));
      return;
    }

    if (!retirementAge || retirement <= 0 || isNaN(retirement) || retirement > 100) {
      setErrors(prev => ({ ...prev, retirementAge: "Please enter a valid retirement age (1-100 years)." }));
      return;
    }

    if (current >= retirement) {
      setErrors(prev => ({ ...prev, retirementAge: "Retirement age must be greater than current age." }));
      return;
    }

    if (debts < 0) {
      setErrors(prev => ({ ...prev, outstandingDebts: "Outstanding debts cannot be negative." }));
      return;
    }

    if (assets < 0) {
      setErrors(prev => ({ ...prev, existingAssets: "Existing assets cannot be negative." }));
      return;
    }

    if (deps < 0 || deps > 10) {
      setErrors(prev => ({ ...prev, dependents: "Number of dependents must be between 0 and 10." }));
      return;
    }

    // Calculate coverage
    const yearsToRetirement = retirement - current;
    
    // Standard formula: (Annual Income × Years to Retirement) + Outstanding Debts - Existing Assets
    const incomeReplacement = income * yearsToRetirement;
    const debtCoverage = debts;
    const assetAdjustment = assets;
    
    // Recommended coverage calculation
    let recommendedCoverage = incomeReplacement + debtCoverage - assetAdjustment;
    
    // Minimum coverage: 10x annual income
    const minCoverage = income * 10;
    // Maximum coverage: 20x annual income (for high-income earners or more dependents)
    const maxCoverage = income * 20;
    
    // Adjust based on dependents
    if (deps > 2) {
      recommendedCoverage = Math.max(recommendedCoverage, income * 15);
    }
    
    // Ensure coverage is within reasonable bounds
    recommendedCoverage = Math.max(minCoverage, Math.min(recommendedCoverage, maxCoverage));
    
    const coverageMultiplier = recommendedCoverage / income;

    setResult({
      recommendedCoverage: Math.round(recommendedCoverage),
      coverageMultiplier: Math.round(coverageMultiplier * 10) / 10,
      yearsToRetirement,
      incomeReplacement: Math.round(incomeReplacement),
      debtCoverage: Math.round(debtCoverage),
      assetAdjustment: Math.round(assetAdjustment),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasInputs = annualIncome || currentAge !== "30" || retirementAge !== "60" || outstandingDebts !== "0" || existingAssets !== "0" || dependents !== "1";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Term Insurance Calculator</h1>
                  <p className="text-muted-foreground">Calculate the right life insurance coverage for your family</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Details</CardTitle>
                  <CardDescription>Provide your financial information to calculate coverage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income (₹) *</Label>
                    <Input
                      id="income"
                      type="text"
                      placeholder="1000000"
                      value={annualIncome}
                      onChange={(e) => handleNumberInput(e.target.value, setAnnualIncome, "annualIncome", true)}
                    />
                    {errors.annualIncome && (
                      <p className="text-xs text-destructive">{errors.annualIncome}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Current Age *</Label>
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
                    <Label htmlFor="retirement">Retirement Age *</Label>
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
                    <Label htmlFor="debts">Outstanding Debts (₹)</Label>
                    <Input
                      id="debts"
                      type="text"
                      placeholder="0"
                      value={outstandingDebts}
                      onChange={(e) => handleNumberInput(e.target.value, setOutstandingDebts, "outstandingDebts", false)}
                    />
                    {errors.outstandingDebts && (
                      <p className="text-xs text-destructive">{errors.outstandingDebts}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Home loan, car loan, personal loans, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assets">Existing Assets (₹)</Label>
                    <Input
                      id="assets"
                      type="text"
                      placeholder="0"
                      value={existingAssets}
                      onChange={(e) => handleNumberInput(e.target.value, setExistingAssets, "existingAssets", false)}
                    />
                    {errors.existingAssets && (
                      <p className="text-xs text-destructive">{errors.existingAssets}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Savings, investments, property value, etc.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input
                      id="dependents"
                      type="text"
                      placeholder="1"
                      value={dependents}
                      onChange={(e) => handleNumberInput(e.target.value, setDependents, "dependents", false)}
                    />
                    {errors.dependents && (
                      <p className="text-xs text-destructive">{errors.dependents}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Spouse, children, parents who depend on your income</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={calculateTermInsurance} className={hasInputs ? "flex-1" : "w-full"} size="lg">
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Coverage
                    </Button>
                    {hasInputs && (
                      <Button
                        onClick={() => {
                          setAnnualIncome("");
                          setCurrentAge("30");
                          setRetirementAge("60");
                          setOutstandingDebts("0");
                          setExistingAssets("0");
                          setDependents("1");
                          setResult(null);
                          setErrors({});
                        }}
                        variant="outline"
                        size="lg"
                      >
                        <X className="h-5 w-5" />
                        Clear
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results or How It Works */}
              {!result ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      How It Works
                    </CardTitle>
                    <CardDescription>Understanding term insurance coverage calculation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h3 className="font-semibold mb-2 text-sm">Coverage Formula</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Recommended Coverage = (Annual Income × Years to Retirement) + Outstanding Debts - Existing Assets
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li><strong>Income Replacement:</strong> Ensures your family can maintain their lifestyle</li>
                          <li><strong>Debt Coverage:</strong> Covers all outstanding loans and liabilities</li>
                          <li><strong>Asset Adjustment:</strong> Reduces coverage based on existing savings/investments</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                        <h3 className="font-semibold mb-2 text-sm">Coverage Guidelines</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li><strong>Minimum:</strong> 10x your annual income</li>
                          <li><strong>Recommended:</strong> 15-20x your annual income</li>
                          <li><strong>For High Dependents:</strong> Consider 20x or more</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> Term insurance provides pure protection at affordable premiums. 
                          Review your coverage annually and increase it as your income and responsibilities grow.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Coverage Recommendation</CardTitle>
                    <CardDescription>Based on your financial profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Recommended Coverage</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.recommendedCoverage)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This is {result.coverageMultiplier}x your annual income
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Income Replacement</span>
                        <span className="font-medium">{formatCurrency(result.incomeReplacement)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Outstanding Debts</span>
                        <span className="font-medium">+{formatCurrency(result.debtCoverage)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Existing Assets</span>
                        <span className="font-medium">-{formatCurrency(result.assetAdjustment)}</span>
                      </div>
                      <div className="pt-2 border-t flex justify-between">
                        <span className="font-semibold">Years to Retirement</span>
                        <span className="font-semibold">{result.yearsToRetirement} years</span>
                      </div>
                    </div>

                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-success mb-1">Coverage Adequacy</p>
                          <p className="text-muted-foreground">
                            {result.coverageMultiplier >= 15 
                              ? "Excellent coverage! Your family will be well protected."
                              : result.coverageMultiplier >= 10
                              ? "Good coverage. Consider increasing if you have more dependents."
                              : "Minimum coverage. Consider increasing for better protection."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

