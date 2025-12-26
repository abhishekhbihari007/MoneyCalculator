"use client";

import { useState } from "react";
import { Award, ArrowLeft, DollarSign } from "lucide-react";
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

  const calculateGratuity = () => {
    const salary = parseFloat(lastDrawnSalary);
    const years = parseFloat(yearsOfService);

    if (!salary || !years || salary <= 0 || years < 0) {
      alert("Please enter valid values");
      return;
    }

    // Gratuity = (Last drawn salary × 15/26) × Years of service
    // For 5+ years of service
    if (years >= 5) {
      const gratuity = (salary / 26) * 15 * years;
      // Maximum gratuity is capped at ₹20 lakhs
      const finalGratuity = Math.min(gratuity, 2000000);
      setResult({
        gratuity: finalGratuity,
        months: years * 12,
      });
    } else {
      alert("Gratuity is payable only after 5 years of continuous service");
      setResult(null);
    }
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
                    type="number"
                    placeholder="50000"
                    value={lastDrawnSalary}
                    onChange={(e) => setLastDrawnSalary(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Monthly basic salary + DA</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Years of Service</Label>
                  <Input
                    id="years"
                    type="number"
                    placeholder="10"
                    value={yearsOfService}
                    onChange={(e) => setYearsOfService(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 5 years required</p>
                </div>

                <Button onClick={calculateGratuity} className="w-full" size="lg">
                  <Award className="h-5 w-5" />
                  Calculate Gratuity
                </Button>
              </CardContent>
            </Card>

            {result && (
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

