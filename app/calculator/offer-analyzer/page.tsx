"use client";

import { useState } from "react";
import { Scale, ArrowLeft, TrendingUp, DollarSign, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Offer {
  ctc: number;
  basicPercentage: number;
  hraPercentage: number;
  variablePay: number;
  joiningBonus: number;
  esop: number;
  name: string;
}

export default function OfferAnalyzer() {
  const [offers, setOffers] = useState<Offer[]>([
    { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 1" },
    { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 2" },
    { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 3" },
  ]);
  const [result, setResult] = useState<Array<{
    offer: Offer;
    inHand: number;
    monthlyInHand: number;
    totalValue: number;
    rank: number;
    gross: number;
    totalTax: number;
    pfDeduction: number;
  }> | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to handle number-only input
  const handleNumberInput = (value: string, setter: (value: string) => void, fieldName: string) => {
    if (value === "") {
      setter("");
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setter(value);
  };

  const calculateOffer = (offer: Offer) => {
    const ctcValue = Math.max(0, offer.ctc || 0);
    const basicPercent = Math.max(0, Math.min(100, offer.basicPercentage || 40)) / 100;
    const hraPercent = Math.max(0, Math.min(100, offer.hraPercentage || 50)) / 100;
    
    const basic = ctcValue * basicPercent;
    const hra = Math.min(basic * hraPercent, basic * 0.5);
    const specialAllowance = Math.max(0, ctcValue - basic - hra);
    
    const pfEmployee = Math.min(basic * 0.12, 1800 * 12);
    const pfEmployer = Math.min(basic * 0.12, 1800 * 12);
    const monthlyGross = ctcValue / 12;
    const esic = monthlyGross <= 21000 ? ctcValue * 0.0075 : 0;
    const professionalTax = 200 * 12;
    
    const grossSalary = Math.max(0, basic + hra + specialAllowance);
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, grossSalary - standardDeduction - pfEmployee - esic - professionalTax);
    
    // Calculate surcharge
    let taxBase = 0;
    // No tax if taxable income <= ₹12,00,000 (New Tax Regime)
    if (taxableIncome <= 1200000) {
      taxBase = 0;
    } else if (taxableIncome > 2000000) {
      taxBase = (taxableIncome - 2000000) * 0.30 + 275000;
    } else if (taxableIncome > 1500000) {
      taxBase = (taxableIncome - 1500000) * 0.25 + 150000;
    } else if (taxableIncome > 1200000) {
      taxBase = (taxableIncome - 1200000) * 0.20 + 90000;
    } else if (taxableIncome > 900000) {
      taxBase = (taxableIncome - 900000) * 0.15 + 45000;
    } else if (taxableIncome > 700000) {
      taxBase = (taxableIncome - 700000) * 0.10 + 25000;
    } else if (taxableIncome > 500000) {
      taxBase = (taxableIncome - 500000) * 0.05 + 12500;
    } else if (taxableIncome > 300000) {
      taxBase = (taxableIncome - 300000) * 0.05;
    }
    
    // Calculate surcharge
    let surcharge = 0;
    if (grossSalary > 50000000) {
      surcharge = taxBase * 0.37;
    } else if (grossSalary > 20000000) {
      surcharge = taxBase * 0.25;
    } else if (grossSalary > 10000000) {
      surcharge = taxBase * 0.15;
    } else if (grossSalary > 5000000) {
      surcharge = taxBase * 0.10;
    }
    
    // Calculate cess (4% on tax + surcharge)
    const cess = (taxBase + surcharge) * 0.04;
    const totalTax = taxBase + surcharge + cess;
    
    const inHand = Math.max(0, grossSalary - pfEmployee - esic - professionalTax - totalTax);
    const monthlyInHand = Math.max(0, inHand / 12);
    const totalValue = Math.max(0, ctcValue + (offer.variablePay || 0) + (offer.joiningBonus || 0) + ((offer.esop || 0) * 0.1));
    
    return { 
      inHand, 
      monthlyInHand,
      totalValue, 
      gross: grossSalary,
      totalTax,
      pfDeduction: pfEmployee
    };
  };

  const compareOffers = () => {
    setErrors({});
    setResult(null);

    // STRICT VALIDATION - Policy Guardrails
    // Rule 1: At least one offer must have valid CTC
    const validOffers = offers.filter(o => o.ctc > 0);
    if (validOffers.length === 0) {
      setErrors({ general: "Please enter at least one valid offer with CTC greater than ₹0." });
      return;
    }

    // Rule 2: Validate each offer
    for (let i = 0; i < offers.length; i++) {
      const offer = offers[i];
      if (offer.ctc > 0) {
        // Rule 2a: CTC must be positive
        if (offer.ctc <= 0) {
          setErrors({ general: `Offer ${i + 1}: CTC must be greater than ₹0.` });
          return;
        }

        // Rule 2b: Basic percentage must be reasonable (10-90%)
        if (offer.basicPercentage < 10 || offer.basicPercentage > 90) {
          setErrors({ general: `Offer ${i + 1}: Basic salary percentage must be between 10% and 90%.` });
          return;
        }

        // Rule 2c: HRA percentage must be reasonable (0-60%)
        if (offer.hraPercentage < 0 || offer.hraPercentage > 60) {
          setErrors({ general: `Offer ${i + 1}: HRA percentage must be between 0% and 60%.` });
          return;
        }

        // Rule 2d: Variable pay, bonus, ESOP cannot be negative
        if (offer.variablePay < 0 || offer.joiningBonus < 0 || offer.esop < 0) {
          setErrors({ general: `Offer ${i + 1}: Variable pay, joining bonus, and ESOP cannot be negative.` });
          return;
        }
      }
    }

    const results = validOffers
      .map(offer => {
        const calc = calculateOffer(offer);
        return { offer, ...calc, rank: 0 };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .map((r, index) => ({ ...r, rank: index + 1 }));

    setResult(results);
  };

  const updateOffer = (index: number, field: keyof Offer, value: string | number) => {
    const updated = [...offers];
    if (typeof value === "string") {
      const numValue = parseFloat(value) || 0;
      updated[index] = { ...updated[index], [field]: numValue };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setOffers(updated);
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
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-heading">Offer Analyzer</h1>
                <p className="text-muted-foreground">Compare multiple job offers side by side</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Enter Offer Details</CardTitle>
                <CardDescription>Compare up to 3 offers side by side</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {offers.map((offer, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <Label className="text-lg font-semibold">{offer.name}</Label>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>CTC (₹)</Label>
                        <Input
                          type="text"
                          value={offer.ctc || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              updateOffer(index, "ctc", value === "" ? 0 : parseFloat(value) || 0);
                            }
                          }}
                          placeholder="e.g., 1500000"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Basic %</Label>
                          <Input
                            type="text"
                            value={offer.basicPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                updateOffer(index, "basicPercentage", value === "" ? 40 : parseFloat(value) || 40);
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label>HRA %</Label>
                          <Input
                            type="text"
                            value={offer.hraPercentage}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^\d*\.?\d*$/.test(value)) {
                                updateOffer(index, "hraPercentage", value === "" ? 50 : parseFloat(value) || 50);
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Variable Pay (₹)</Label>
                        <Input
                          type="text"
                          value={offer.variablePay || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              updateOffer(index, "variablePay", value === "" ? 0 : parseFloat(value) || 0);
                            }
                          }}
                          placeholder="Annual variable"
                        />
                      </div>
                      
                      <div>
                        <Label>Joining Bonus (₹)</Label>
                        <Input
                          type="text"
                          value={offer.joiningBonus || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              updateOffer(index, "joiningBonus", value === "" ? 0 : parseFloat(value) || 0);
                            }
                          }}
                          placeholder="One-time bonus"
                        />
                      </div>
                      
                      <div>
                        <Label>ESOP Value (₹)</Label>
                        <Input
                          type="text"
                          value={offer.esop || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              updateOffer(index, "esop", value === "" ? 0 : parseFloat(value) || 0);
                            }
                          }}
                          placeholder="Estimated ESOP value"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {errors.general && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={compareOffers} className={offers.some(o => o.ctc > 0 || o.variablePay > 0 || o.joiningBonus > 0 || o.esop > 0 || o.basicPercentage !== 40 || o.hraPercentage !== 50) ? "flex-1" : "w-full"} size="lg">
                    <Scale className="h-4 w-4 mr-2" />
                    Compare Offers
                  </Button>
                  {offers.some(o => o.ctc > 0 || o.variablePay > 0 || o.joiningBonus > 0 || o.esop > 0 || o.basicPercentage !== 40 || o.hraPercentage !== 50) && (
                    <Button 
                      onClick={() => {
                        setOffers([
                          { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 1" },
                          { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 2" },
                          { ctc: 0, basicPercentage: 40, hraPercentage: 50, variablePay: 0, joiningBonus: 0, esop: 0, name: "Offer 3" },
                        ]);
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
                  <CardDescription>Understanding offer comparison</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <h3 className="font-semibold mb-2 text-sm">Net Take-Home Calculation</h3>
                      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Calculate gross salary from CTC (Basic + HRA + Special Allowance)</li>
                        <li>Apply deductions: PF (12% of Basic, max ₹1,800/month), ESIC, Professional Tax</li>
                        <li>Calculate taxable income after standard deduction (₹75,000)</li>
                        <li>Apply income tax using new regime slabs</li>
                        <li>Add surcharge and 4% cess if applicable</li>
                        <li>Net Take-Home = Gross - All Deductions - Tax</li>
                      </ol>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                      <h3 className="font-semibold mb-2 text-sm">Total Value Calculation</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>CTC (Cost to Company)</li>
                        <li>+ Variable Pay (performance-based)</li>
                        <li>+ Joining Bonus</li>
                        <li>+ ESOP Value (estimated at 10% of face value)</li>
                        <li>= Total Value</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> Offers are ranked by total value. 
                        Compare net take-home to understand actual cash flow differences.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Results</CardTitle>
                  <CardDescription>Ranked by total value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.map((r, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          r.rank === 1 ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{r.offer.name}</h3>
                              {r.rank === 1 && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                  Best Offer
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">Rank #{r.rank}</p>
                          </div>
                          {r.rank === 1 && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Gross Salary:</span>
                            <span className="font-medium">{formatCurrency(r.gross)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Tax:</span>
                            <span className="font-medium text-destructive">{formatCurrency(r.totalTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">PF Deduction:</span>
                            <span className="font-medium">{formatCurrency(r.pfDeduction)}</span>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-muted-foreground">Monthly Take-Home:</span>
                              <span className="font-semibold text-primary">{formatCurrency(r.monthlyInHand)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Annual In-Hand:</span>
                              <span className="font-medium">{formatCurrency(r.inHand)}</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Total Value (CTC + Variable + Bonus + ESOP):</span>
                              <span className="font-semibold text-primary">{formatCurrency(r.totalValue)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

