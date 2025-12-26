"use client";

import { useState } from "react";
import { Scale, ArrowLeft, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
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
  ]);
  const [result, setResult] = useState<Array<{
    offer: Offer;
    inHand: number;
    totalValue: number;
    rank: number;
  }> | null>(null);

  const calculateOffer = (offer: Offer) => {
    const basic = offer.ctc * (offer.basicPercentage / 100);
    const hra = Math.min(basic * (offer.hraPercentage / 100), basic * 0.5);
    const specialAllowance = offer.ctc - basic - hra;
    
    // Deductions
    const pfEmployee = Math.min(basic * 0.12, 1800);
    const pfEmployer = Math.min(basic * 0.12, 1800);
    const esic = offer.ctc <= 21000 ? offer.ctc * 0.0075 : 0;
    const professionalTax = 200;
    
    // Tax calculation (simplified)
    const taxableIncome = basic + hra + specialAllowance - pfEmployee - esic - professionalTax;
    const tax = Math.max(0, (taxableIncome - 500000) * 0.2);
    
    const inHand = taxableIncome - tax;
    const totalValue = offer.ctc + offer.variablePay + offer.joiningBonus + (offer.esop * 0.1); // ESOP estimated at 10% value
    
    return { inHand, totalValue };
  };

  const compareOffers = () => {
    const results = offers
      .filter(o => o.ctc > 0)
      .map(offer => {
        const calc = calculateOffer(offer);
        return { offer, ...calc, rank: 0 };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .map((r, index) => ({ ...r, rank: index + 1 }));

    if (results.length === 0) {
      alert("Please enter at least one valid offer");
      return;
    }

    setResult(results);
  };

  const updateOffer = (index: number, field: keyof Offer, value: string | number) => {
    const updated = [...offers];
    updated[index] = { ...updated[index], [field]: value };
    setOffers(updated);
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
                <CardDescription>Add up to 3 offers to compare</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {offers.map((offer, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <Label className="text-lg font-semibold">{offer.name}</Label>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>CTC (₹)</Label>
                        <Input
                          type="number"
                          value={offer.ctc || ""}
                          onChange={(e) => updateOffer(index, "ctc", parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 1500000"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Basic %</Label>
                          <Input
                            type="number"
                            value={offer.basicPercentage}
                            onChange={(e) => updateOffer(index, "basicPercentage", parseFloat(e.target.value) || 40)}
                          />
                        </div>
                        <div>
                          <Label>HRA %</Label>
                          <Input
                            type="number"
                            value={offer.hraPercentage}
                            onChange={(e) => updateOffer(index, "hraPercentage", parseFloat(e.target.value) || 50)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Variable Pay (₹)</Label>
                        <Input
                          type="number"
                          value={offer.variablePay || ""}
                          onChange={(e) => updateOffer(index, "variablePay", parseFloat(e.target.value) || 0)}
                          placeholder="Annual variable"
                        />
                      </div>
                      
                      <div>
                        <Label>Joining Bonus (₹)</Label>
                        <Input
                          type="number"
                          value={offer.joiningBonus || ""}
                          onChange={(e) => updateOffer(index, "joiningBonus", parseFloat(e.target.value) || 0)}
                          placeholder="One-time bonus"
                        />
                      </div>
                      
                      <div>
                        <Label>ESOP Value (₹)</Label>
                        <Input
                          type="number"
                          value={offer.esop || ""}
                          onChange={(e) => updateOffer(index, "esop", parseFloat(e.target.value) || 0)}
                          placeholder="Estimated ESOP value"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={compareOffers} className="w-full" size="lg">
                  <Scale className="h-4 w-4 mr-2" />
                  Compare Offers
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>Ranked by total value</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
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
                            <span className="text-sm text-muted-foreground">CTC:</span>
                            <span className="font-medium">{formatCurrency(r.offer.ctc)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Estimated In-Hand:</span>
                            <span className="font-medium">{formatCurrency(r.inHand)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Value:</span>
                            <span className="font-semibold text-primary">{formatCurrency(r.totalValue)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter offer details and click &quot;Compare Offers&quot; to see results</p>
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

