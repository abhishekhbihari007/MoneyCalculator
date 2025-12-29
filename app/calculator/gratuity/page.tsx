"use client";

import { useState } from "react";
import { Award, ArrowLeft, DollarSign, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function GratuityCalculator() {
  const [lastDrawnSalary, setLastDrawnSalary] = useState<string>("");
  const [yearsOfService, setYearsOfService] = useState<string>("");
  const [result, setResult] = useState<{
    gratuity: number;
    months: number;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to handle number-only input
  const handleNumberInput = (value: string, setter: (value: string) => void, fieldName: string, isRequired: boolean = false, min?: number) => {
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
    // Only allow numbers and decimal point (no negative sign)
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return;
    }
    if (min !== undefined && numValue < min) {
      setErrors(prev => ({ ...prev, [fieldName]: `Value must be at least ${min}` }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    setter(value);
  };

  const calculateGratuity = () => {
    setErrors({});
    setResult(null);
    const salary = parseFloat(lastDrawnSalary) || 0;
    const years = parseFloat(yearsOfService) || 0;

    // STRICT VALIDATION - Payment of Gratuity Act Guardrails
    // Rule 1: Last drawn salary must be positive
    if (!lastDrawnSalary || salary <= 0 || isNaN(salary)) {
      setErrors(prev => ({ ...prev, lastDrawnSalary: "Last drawn basic salary must be greater than ₹0 as per Payment of Gratuity Act, 1972." }));
      return;
    }

    // Rule 2: Years of service cannot be negative
    if (!yearsOfService || years < 0 || isNaN(years)) {
      setErrors(prev => ({ ...prev, yearsOfService: "Years of service cannot be negative. Please enter a valid number." }));
      return;
    }

    // Rule 3: Minimum 5 years eligibility (Payment of Gratuity Act requirement)
    if (years < 5) {
      setErrors(prev => ({ ...prev, yearsOfService: "Gratuity is payable only after completing 5 years of continuous service as per Payment of Gratuity Act, 1972." }));
      return;
    }

    // Rule 4: Years of service must be reasonable (max 50 years)
    if (years > 50) {
      setErrors(prev => ({ ...prev, yearsOfService: "Years of service cannot exceed 50 years. Please enter a valid number." }));
      return;
    }

    const gratuity = (salary / 26) * 15 * years;
    const finalGratuity = Math.min(gratuity, 2000000);
    setResult({
      gratuity: finalGratuity,
      months: years * 12,
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
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gratuity Estimator</h1>
                <p className="text-muted-foreground">Calculate your gratuity amount at retirement</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Details</CardTitle>
                <CardDescription>Calculate gratuity based on your service period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="salary">Last Drawn Basic Salary (₹)</Label>
                  <Input
                    id="salary"
                    type="text"
                    placeholder="50000"
                    value={lastDrawnSalary}
                    onChange={(e) => handleNumberInput(e.target.value, setLastDrawnSalary, "lastDrawnSalary", true, 1)}
                  />
                  {errors.lastDrawnSalary && (
                    <p className="text-xs text-destructive">{errors.lastDrawnSalary}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Monthly basic salary + DA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Years of Service</Label>
                  <Input
                    id="years"
                    type="text"
                    placeholder="10"
                    value={yearsOfService}
                    onChange={(e) => handleNumberInput(e.target.value, setYearsOfService, "yearsOfService", true, 0)}
                  />
                  {errors.yearsOfService && (
                    <p className="text-xs text-destructive">{errors.yearsOfService}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Minimum 5 years required</p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={calculateGratuity} className={lastDrawnSalary || yearsOfService ? "flex-1" : "w-full"} size="lg">
                    <Award className="h-5 w-5 mr-2" />
                    Calculate Gratuity
                  </Button>
                  {(lastDrawnSalary || yearsOfService) && (
                    <Button 
                      onClick={() => {
                        setLastDrawnSalary("");
                        setYearsOfService("");
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
                  <CardDescription>Understanding gratuity calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-semibold mb-2 text-sm">Eligibility</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>Minimum 5 years of continuous service required</li>
                        <li>Payable on retirement, resignation, or death</li>
                        <li>Applies to employees covered under Payment of Gratuity Act, 1972</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                      <h3 className="font-semibold mb-2 text-sm">Calculation Formula</h3>
                      <p className="text-xs text-muted-foreground mb-2 font-mono bg-muted p-2 rounded">
                        Gratuity = (Last Drawn Salary × 15 × Years of Service) / 26
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li><strong>Last Drawn Salary:</strong> Basic + Dearness Allowance (DA)</li>
                        <li><strong>15:</strong> Number of days&apos; salary per year</li>
                        <li><strong>26:</strong> Number of working days in a month</li>
                        <li><strong>Years of Service:</strong> Full years of continuous service</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground">
                        <strong>Maximum Cap:</strong> Gratuity is capped at ₹20 lakhs as per current regulations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Gratuity Amount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Gratuity</span>
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-success">{formatCurrency(result.gratuity)}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-primary/5">
                      <p className="text-sm text-muted-foreground mb-2">Calculation Formula:</p>
                      <p className="text-sm font-medium">
                        (Last Drawn Salary ÷ 26) × 15 × Years of Service
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm">Years of Service</span>
                      <span className="font-semibold">{result.months / 12} years</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      <p>Note: Maximum gratuity is capped at ₹20 lakhs as per current regulations.</p>
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

