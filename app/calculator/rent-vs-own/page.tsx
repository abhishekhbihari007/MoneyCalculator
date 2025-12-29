"use client";

import { useState } from "react";
import { Home, ArrowLeft, TrendingUp, DollarSign, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RentVsOwnCalculator() {
  const [homePrice, setHomePrice] = useState<string>("5000000");
  const [downPayment, setDownPayment] = useState<string>("1000000");
  const [loanTenure, setLoanTenure] = useState<string>("20");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [monthlyRent, setMonthlyRent] = useState<string>("25000");
  const [rentIncrease, setRentIncrease] = useState<string>("5");
  const [propertyAppreciation, setPropertyAppreciation] = useState<string>("6");
  const [result, setResult] = useState<{
    monthlyEMI: number;
    totalLoanAmount: number;
    totalInterest: number;
    totalCostOfBuying: number;
    totalCostOfRenting: number;
    propertyValueAfter: number;
    netSavings: number;
    recommendation: string;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(homePrice);
    const down = parseFloat(downPayment);
    const tenure = parseInt(loanTenure);
    const rate = parseFloat(interestRate) / 100 / 12;
    const rent = parseFloat(monthlyRent);
    const rentInc = parseFloat(rentIncrease) / 100;
    const propApp = parseFloat(propertyAppreciation) / 100;

    if (!price || !down || !tenure || !rent) {
      alert("Please enter valid values");
      return;
    }

    const loanAmount = price - down;
    const months = tenure * 12;

    const emi = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    
    const totalEMI = emi * months;
    const totalCostOfBuying = down + totalEMI;
    const totalInterest = totalEMI - loanAmount;

    let totalRent = 0;
    let currentRent = rent;
    for (let year = 0; year < tenure; year++) {
      totalRent += currentRent * 12;
      currentRent *= (1 + rentInc);
    }

    const propertyValueAfter = price * Math.pow(1 + propApp, tenure);
    const netSavings = propertyValueAfter - totalCostOfBuying - totalRent;

    let recommendation = "";
    if (netSavings > 0) {
      recommendation = "Buying is financially better";
    } else {
      recommendation = "Renting might be better for now";
    }

    setResult({
      monthlyEMI: emi,
      totalLoanAmount: loanAmount,
      totalInterest,
      totalCostOfBuying,
      totalCostOfRenting: totalRent,
      propertyValueAfter,
      netSavings,
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading">Rent vs Own Analyzer</h1>
                <p className="text-muted-foreground">Should you buy or continue renting?</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property & Financial Details</CardTitle>
                <CardDescription>Enter details to compare renting vs buying</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Home Price (₹)</Label>
                  <Input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    placeholder="e.g., 5000000"
                  />
                </div>

                <div>
                  <Label>Down Payment (₹)</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="e.g., 1000000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Loan Tenure (Years)</Label>
                    <Input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="e.g., 8.5"
                    />
                  </div>
                </div>

                <div>
                  <Label>Current Monthly Rent (₹)</Label>
                  <Input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="e.g., 25000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Annual Rent Increase (%)</Label>
                    <Input
                      type="number"
                      value={rentIncrease}
                      onChange={(e) => setRentIncrease(e.target.value)}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label>Property Appreciation (%)</Label>
                    <Input
                      type="number"
                      value={propertyAppreciation}
                      onChange={(e) => setPropertyAppreciation(e.target.value)}
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>

                <Button onClick={calculate} className="w-full" size="lg">
                  <Calculator className="h-4 w-4 mr-2" />
                  Compare Rent vs Own
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>Financial analysis over the loan tenure</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg border ${
                      result.netSavings > 0 
                        ? "bg-success/10 border-success/20" 
                        : "bg-muted/50 border-muted"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Recommendation</span>
                        {result.netSavings > 0 ? (
                          <Home className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <p className={`text-lg font-bold ${
                        result.netSavings > 0 ? "text-success" : "text-muted-foreground"
                      }`}>
                        {result.recommendation}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Buying Costs</h4>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-sm">Monthly EMI</span>
                        <span className="font-medium">{formatCurrency(result.monthlyEMI)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-sm">Total Interest Paid</span>
                        <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
                        <span className="text-sm font-semibold">Total Cost of Buying</span>
                        <span className="font-semibold text-primary">{formatCurrency(result.totalCostOfBuying)}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Renting Costs</h4>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-sm">Total Rent Paid</span>
                        <span className="font-medium">{formatCurrency(result.totalCostOfRenting)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded mb-2">
                        <span className="text-sm">Property Value After {loanTenure} Years</span>
                        <span className="font-semibold text-accent">{formatCurrency(result.propertyValueAfter)}</span>
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded ${
                        result.netSavings > 0 ? "bg-success/10" : "bg-muted/50"
                      }`}>
                        <span className="text-sm font-semibold">Net Savings (Buying vs Renting)</span>
                        <span className={`font-bold text-lg ${
                          result.netSavings > 0 ? "text-success" : "text-muted-foreground"
                        }`}>
                          {formatCurrency(result.netSavings)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter property details and click &quot;Compare&quot; to see the analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

