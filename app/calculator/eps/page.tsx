"use client";

import { useState } from "react";
import { Landmark, ArrowLeft, Calculator, Info, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function EPSCalculator() {
  const [pensionableSalary, setPensionableSalary] = useState<string>("");
  const [yearsOfService, setYearsOfService] = useState<string>("");
  const [pensionableService, setPensionableService] = useState<string>("");
  const [employeeType, setEmployeeType] = useState<"private" | "government">("private");
  const [result, setResult] = useState<{
    monthlyPension: number;
    eligible: boolean;
    serviceYears: number;
    pensionableSalaryAmount: number;
    pensionFormula: string;
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

  const calculateEPS = () => {
    setErrors({});
    setResult(null);

    const salary = parseFloat(pensionableSalary) || 0;
    const serviceYears = parseFloat(yearsOfService) || 0;
    const pensionableYears = parseFloat(pensionableService) || serviceYears;

    // Validation
    if (!pensionableSalary || salary <= 0 || isNaN(salary)) {
      setErrors(prev => ({ ...prev, pensionableSalary: "Pensionable salary must be greater than ₹0." }));
      return;
    }

    if (!yearsOfService || serviceYears < 0 || isNaN(serviceYears)) {
      setErrors(prev => ({ ...prev, yearsOfService: "Years of service cannot be negative." }));
      return;
    }

    if (pensionableYears < 0 || pensionableYears > serviceYears) {
      setErrors(prev => ({ ...prev, pensionableService: "Pensionable service cannot exceed total service years." }));
      return;
    }

    // EPS Eligibility: Minimum 10 years of service
    const eligible = serviceYears >= 10;
    
    if (!eligible) {
      setResult({
        monthlyPension: 0,
        eligible: false,
        serviceYears: Math.round(serviceYears * 10) / 10,
        pensionableSalaryAmount: Math.round(salary),
        pensionFormula: "Not eligible - Minimum 10 years service required",
      });
      return;
    }

    // EPS Pension Calculation
    // Formula: (Pensionable Salary × Pensionable Service) / 70
    // Pensionable Salary is capped at ₹15,000 per month (EPS wage ceiling)
    const epsWageCeiling = 15000;
    const cappedSalary = Math.min(salary, epsWageCeiling);
    
    // Round pensionable service to nearest year
    const roundedService = Math.round(pensionableYears);
    
    // Calculate monthly pension
    const monthlyPension = (cappedSalary * roundedService) / 70;
    
    // Minimum pension: ₹1,000 per month (as per EPS rules)
    const finalPension = Math.max(monthlyPension, 1000);
    
    // Maximum pension: 50% of average salary (if service >= 20 years)
    const maxPension = roundedService >= 20 ? cappedSalary * 0.5 : Infinity;
    const finalMonthlyPension = Math.min(finalPension, maxPension);

    setResult({
      monthlyPension: Math.round(finalMonthlyPension),
      eligible: true,
      serviceYears: roundedService,
      pensionableSalaryAmount: Math.round(cappedSalary),
      pensionFormula: `(${formatCurrency(cappedSalary)} × ${roundedService} years) / 70`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const hasInputs = pensionableSalary || yearsOfService || pensionableService || employeeType !== "private";

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
                  <Landmark className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">EPS Pension Calculator</h1>
                  <p className="text-muted-foreground">Calculate your Employee Pension Scheme monthly pension</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Details</CardTitle>
                  <CardDescription>Provide your service and salary information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employeeType">Employee Type</Label>
                    <Select value={employeeType} onValueChange={(value: "private" | "government") => setEmployeeType(value)}>
                      <SelectTrigger id="employeeType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private Sector</SelectItem>
                        <SelectItem value="government">Government Sector</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">EPS rules apply to both sectors</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Average Pensionable Salary (₹) *</Label>
                    <Input
                      id="salary"
                      type="text"
                      placeholder="15000"
                      value={pensionableSalary}
                      onChange={(e) => handleNumberInput(e.target.value, setPensionableSalary, "pensionableSalary", true)}
                    />
                    {errors.pensionableSalary && (
                      <p className="text-xs text-destructive">{errors.pensionableSalary}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Average of last 60 months salary (capped at ₹15,000/month)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Total Years of Service *</Label>
                    <Input
                      id="service"
                      type="text"
                      placeholder="20"
                      value={yearsOfService}
                      onChange={(e) => handleNumberInput(e.target.value, setYearsOfService, "yearsOfService", true)}
                    />
                    {errors.yearsOfService && (
                      <p className="text-xs text-destructive">{errors.yearsOfService}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Total years of EPF membership</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pensionableService">Pensionable Service Years (Optional)</Label>
                    <Input
                      id="pensionableService"
                      type="text"
                      placeholder="Same as total service"
                      value={pensionableService}
                      onChange={(e) => handleNumberInput(e.target.value, setPensionableService, "pensionableService", false)}
                    />
                    {errors.pensionableService && (
                      <p className="text-xs text-destructive">{errors.pensionableService}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Years eligible for pension (defaults to total service if not specified)
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={calculateEPS} className={hasInputs ? "flex-1" : "w-full"} size="lg">
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Pension
                    </Button>
                    {hasInputs && (
                      <Button
                        onClick={() => {
                          setPensionableSalary("");
                          setYearsOfService("");
                          setPensionableService("");
                          setEmployeeType("private");
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
                    <CardDescription>Understanding EPS pension calculation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h3 className="font-semibold mb-2 text-sm">EPS Pension Formula</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Monthly Pension = (Pensionable Salary × Pensionable Service) / 70
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li><strong>Pensionable Salary:</strong> Average of last 60 months (capped at ₹15,000/month)</li>
                          <li><strong>Pensionable Service:</strong> Years of EPF membership (rounded to nearest year)</li>
                          <li><strong>Minimum Pension:</strong> ₹1,000 per month</li>
                          <li><strong>Maximum Pension:</strong> 50% of average salary (if service ≥ 20 years)</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                        <h3 className="font-semibold mb-2 text-sm">Eligibility Criteria</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li>Minimum 10 years of EPF membership required</li>
                          <li>Must have reached superannuation age (58 years) or early retirement</li>
                          <li>EPS contribution is part of employer&apos;s 12% EPF contribution (8.33% goes to EPS)</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> EPS pension is a defined benefit pension scheme. 
                          The pensionable salary is capped at ₹15,000/month regardless of your actual salary. 
                          This pension is separate from your EPF corpus.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Pension Calculation Result</CardTitle>
                    <CardDescription>Based on your service details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.eligible ? (
                      <>
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Monthly Pension</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(result.monthlyPension)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Annual Pension: {formatCurrency(result.monthlyPension * 12)}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pensionable Salary</span>
                            <span className="font-medium">{formatCurrency(result.pensionableSalaryAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pensionable Service</span>
                            <span className="font-medium">{result.serviceYears} years</span>
                          </div>
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Calculation Formula:</p>
                            <p className="text-sm font-mono bg-muted p-2 rounded">{result.pensionFormula}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                            <div className="text-sm">
                              <p className="font-semibold text-success mb-1">Eligible for EPS Pension</p>
                              <p className="text-muted-foreground">
                                You meet the minimum 10 years service requirement. Your monthly pension will be paid after retirement.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                          <div className="flex items-start gap-2">
                            <X className="h-5 w-5 text-destructive mt-0.5" />
                            <div>
                              <p className="font-semibold text-destructive mb-1">Not Eligible for EPS Pension</p>
                              <p className="text-sm text-muted-foreground">
                                Minimum 10 years of EPF membership is required for EPS pension eligibility. 
                                You currently have {result.serviceYears} {result.serviceYears === 1 ? 'year' : 'years'} of service.
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                You can withdraw your EPS contribution as a lump sum if you have less than 10 years of service.
                              </p>
                            </div>
                          </div>
                        </div>
                    )}
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

