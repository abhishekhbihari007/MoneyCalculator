"use client";

import { useState } from "react";
import { Receipt, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TaxRegimePicker() {
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [deductions, setDeductions] = useState<string>("150000"); // 80C, 80D, etc.
  const [result, setResult] = useState<{
    oldRegime: { taxable: number; tax: number; afterTax: number };
    newRegime: { taxable: number; tax: number; afterTax: number };
    recommendation: string;
  } | null>(null);

  const calculateTax = () => {
    const income = parseFloat(annualIncome);
    const deductionsValue = parseFloat(deductions);

    if (!income || income <= 0) {
      alert("Please enter a valid annual income");
      return;
    }

    // Old Regime Calculation
    const standardDeductionOld = 50000;
    const taxableOld = Math.max(0, income - standardDeductionOld - deductionsValue);
    let taxOld = 0;

    if (taxableOld > 1000000) {
      taxOld = (taxableOld - 1000000) * 0.30 + 112500;
    } else if (taxableOld > 500000) {
      taxOld = (taxableOld - 500000) * 0.20 + 12500;
    } else if (taxableOld > 250000) {
      taxOld = (taxableOld - 250000) * 0.05;
    }
    taxOld = taxOld * 1.04; // Add cess

    // New Regime Calculation
    const standardDeductionNew = 75000;
    const taxableNew = Math.max(0, income - standardDeductionNew);
    let taxNew = 0;

    if (taxableNew > 1500000) {
      taxNew = (taxableNew - 1500000) * 0.30 + 150000;
    } else if (taxableNew > 1200000) {
      taxNew = (taxableNew - 1200000) * 0.20 + 90000;
    } else if (taxableNew > 900000) {
      taxNew = (taxableNew - 900000) * 0.15 + 45000;
    } else if (taxableNew > 700000) {
      taxNew = (taxableNew - 700000) * 0.10 + 25000;
    } else if (taxableNew > 500000) {
      taxNew = (taxableNew - 500000) * 0.05 + 12500;
    } else if (taxableNew > 300000) {
      taxNew = (taxableNew - 300000) * 0.05;
    }
    taxNew = taxNew * 1.04; // Add cess

    const recommendation = taxNew < taxOld ? "New Regime" : "Old Regime";

    setResult({
      oldRegime: {
        taxable: taxableOld,
        tax: taxOld,
        afterTax: income - taxOld,
      },
      newRegime: {
        taxable: taxableNew,
        tax: taxNew,
        afterTax: income - taxNew,
      },
      recommendation,
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
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Tax Regime Picker</h1>
                <p className="text-muted-foreground">Compare old vs new tax regime and find your best option</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>Compare tax liability under both regimes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="1000000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deductions">Total Deductions (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    placeholder="150000"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">80C, 80D, HRA, etc. (for old regime only)</p>
                </div>

                <Button onClick={calculateTax} className="w-full" size="lg">
                  <Receipt className="h-5 w-5" />
                  Compare Tax Regimes
                </Button>
              </CardContent>
            </Card>

            {result && (
              <div className="space-y-6">
                <Card className={result.recommendation === "New Regime" ? "border-success" : "border-primary"}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>New Tax Regime</span>
                      {result.recommendation === "New Regime" && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Recommended</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Taxable Income</span>
                      <span className="font-semibold">{formatCurrency(result.newRegime.taxable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax Payable</span>
                      <span className="font-semibold text-destructive">{formatCurrency(result.newRegime.tax)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">After Tax Income</span>
                        <span className="text-lg font-bold text-success">{formatCurrency(result.newRegime.afterTax)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={result.recommendation === "Old Regime" ? "border-success" : "border-primary"}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Old Tax Regime</span>
                      {result.recommendation === "Old Regime" && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">Recommended</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Taxable Income</span>
                      <span className="font-semibold">{formatCurrency(result.oldRegime.taxable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax Payable</span>
                      <span className="font-semibold text-destructive">{formatCurrency(result.oldRegime.tax)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">After Tax Income</span>
                        <span className="text-lg font-bold text-success">{formatCurrency(result.oldRegime.afterTax)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      {result.recommendation === "New Regime" ? (
                        <TrendingDown className="h-6 w-6 text-success" />
                      ) : (
                        <TrendingUp className="h-6 w-6 text-success" />
                      )}
                      <div>
                        <p className="font-semibold">You Save</p>
                        <p className="text-2xl font-bold text-success">
                          {formatCurrency(Math.abs(result.newRegime.tax - result.oldRegime.tax))}
                        </p>
                        <p className="text-sm text-muted-foreground">by choosing {result.recommendation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

