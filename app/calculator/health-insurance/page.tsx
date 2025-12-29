"use client";

import { useState } from "react";
import { Heart, ArrowLeft, Calculator, Info, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function HealthInsuranceCalculator() {
  const [familyType, setFamilyType] = useState<"individual" | "family">("individual");
  const [cityTier, setCityTier] = useState<"metro" | "tier1" | "tier2">("metro");
  const [age, setAge] = useState<string>("30");
  const [spouseAge, setSpouseAge] = useState<string>("28");
  const [children, setChildren] = useState<string>("0");
  const [parentsAge, setParentsAge] = useState<string>("0");
  const [existingCoverage, setExistingCoverage] = useState<string>("0");
  const [result, setResult] = useState<{
    recommendedCoverage: number;
    individualCoverage: number;
    familyCoverage: number;
    topUpCoverage: number;
    totalCoverage: number;
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
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setter(value);
  };

  const calculateHealthInsurance = () => {
    setErrors({});
    setResult(null);

    const ageValue = parseInt(age) || 0;
    const spouseAgeValue = parseInt(spouseAge) || 0;
    const childrenCount = parseInt(children) || 0;
    const parentsAgeValue = parseInt(parentsAge) || 0;
    const existing = Math.max(0, parseFloat(existingCoverage) || 0);

    // Validation
    if (!age || ageValue <= 0 || isNaN(ageValue) || ageValue > 100) {
      setErrors(prev => ({ ...prev, age: "Please enter a valid age (1-100 years)." }));
      return;
    }

    if (familyType === "family") {
      if (spouseAgeValue > 0 && (spouseAgeValue <= 0 || spouseAgeValue > 100)) {
        setErrors(prev => ({ ...prev, spouseAge: "Please enter a valid spouse age (1-100 years)." }));
        return;
      }
      if (childrenCount < 0 || childrenCount > 5) {
        setErrors(prev => ({ ...prev, children: "Number of children must be between 0 and 5." }));
        return;
      }
      if (parentsAgeValue > 0 && (parentsAgeValue <= 0 || parentsAgeValue > 100)) {
        setErrors(prev => ({ ...prev, parentsAge: "Please enter a valid parent age (1-100 years)." }));
        return;
      }
    }

    if (existing < 0) {
      setErrors(prev => ({ ...prev, existingCoverage: "Existing coverage cannot be negative." }));
      return;
    }

    // Calculate coverage based on family type and city tier
    let baseCoverage = 0;
    let individualCoverage = 0;
    let familyCoverage = 0;
    let topUpCoverage = 0;

    // Base coverage by city tier
    const tierMultiplier = cityTier === "metro" ? 1.5 : cityTier === "tier1" ? 1.2 : 1.0;

    if (familyType === "individual") {
      // Individual coverage: ₹5-10 lakhs base
      baseCoverage = 500000;
      if (ageValue > 50) baseCoverage = 1000000; // Higher coverage for older individuals
      individualCoverage = Math.round(baseCoverage * tierMultiplier);
    } else {
      // Family floater coverage
      // Base: ₹10 lakhs for couple
      baseCoverage = 1000000;
      
      // Add for children (₹2L per child)
      if (childrenCount > 0) {
        baseCoverage += childrenCount * 200000;
      }
      
      // Add for parents (₹5L per parent if included)
      if (parentsAgeValue > 0) {
        baseCoverage += 500000; // Assuming one parent, adjust if both
      }
      
      // Adjust for age (higher coverage for older members)
      const maxAge = Math.max(ageValue, spouseAgeValue, parentsAgeValue);
      if (maxAge > 60) {
        baseCoverage = Math.max(baseCoverage, 1500000);
      }
      
      familyCoverage = Math.round(baseCoverage * tierMultiplier);
    }

    // Top-up coverage recommendation (for high medical costs)
    const totalCoverage = familyType === "individual" ? individualCoverage : familyCoverage;
    if (totalCoverage < 2000000) {
      topUpCoverage = Math.max(0, 2000000 - totalCoverage);
    }

    // Recommended total coverage
    let recommendedCoverage = totalCoverage;
    if (existing > 0) {
      recommendedCoverage = Math.max(recommendedCoverage, existing);
    }

    setResult({
      recommendedCoverage: Math.round(recommendedCoverage),
      individualCoverage: Math.round(individualCoverage),
      familyCoverage: Math.round(familyCoverage),
      topUpCoverage: Math.round(topUpCoverage),
      totalCoverage: Math.round(totalCoverage),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasInputs = age !== "30" || spouseAge !== "28" || children !== "0" || parentsAge !== "0" || existingCoverage !== "0" || familyType !== "individual" || cityTier !== "metro";

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
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Health Insurance Calculator</h1>
                  <p className="text-muted-foreground">Calculate adequate health coverage for your needs</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Details</CardTitle>
                  <CardDescription>Provide your family and location details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="familyType">Family Type *</Label>
                    <Select value={familyType} onValueChange={(value: "individual" | "family") => setFamilyType(value)}>
                      <SelectTrigger id="familyType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="family">Family Floater</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityTier">City Tier *</Label>
                    <Select value={cityTier} onValueChange={(value: "metro" | "tier1" | "tier2") => setCityTier(value)}>
                      <SelectTrigger id="cityTier">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metro">Metro (Mumbai, Delhi, Bangalore, etc.)</SelectItem>
                        <SelectItem value="tier1">Tier 1 (Pune, Hyderabad, Chennai, etc.)</SelectItem>
                        <SelectItem value="tier2">Tier 2 & Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Your Age *</Label>
                    <Input
                      id="age"
                      type="text"
                      placeholder="30"
                      value={age}
                      onChange={(e) => handleNumberInput(e.target.value, setAge, "age", true)}
                    />
                    {errors.age && (
                      <p className="text-xs text-destructive">{errors.age}</p>
                    )}
                  </div>

                  {familyType === "family" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="spouseAge">Spouse Age</Label>
                        <Input
                          id="spouseAge"
                          type="text"
                          placeholder="28"
                          value={spouseAge}
                          onChange={(e) => handleNumberInput(e.target.value, setSpouseAge, "spouseAge", false)}
                        />
                        {errors.spouseAge && (
                          <p className="text-xs text-destructive">{errors.spouseAge}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="children">Number of Children</Label>
                        <Input
                          id="children"
                          type="text"
                          placeholder="0"
                          value={children}
                          onChange={(e) => handleNumberInput(e.target.value, setChildren, "children", false)}
                        />
                        {errors.children && (
                          <p className="text-xs text-destructive">{errors.children}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parentsAge">Parent Age (if included)</Label>
                        <Input
                          id="parentsAge"
                          type="text"
                          placeholder="0"
                          value={parentsAge}
                          onChange={(e) => handleNumberInput(e.target.value, setParentsAge, "parentsAge", false)}
                        />
                        {errors.parentsAge && (
                          <p className="text-xs text-destructive">{errors.parentsAge}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Enter age if including parents in family floater</p>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="existing">Existing Coverage (₹)</Label>
                    <Input
                      id="existing"
                      type="text"
                      placeholder="0"
                      value={existingCoverage}
                      onChange={(e) => handleNumberInput(e.target.value, setExistingCoverage, "existingCoverage", false)}
                    />
                    {errors.existingCoverage && (
                      <p className="text-xs text-destructive">{errors.existingCoverage}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Current health insurance coverage amount</p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={calculateHealthInsurance} className={hasInputs ? "flex-1" : "w-full"} size="lg">
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Coverage
                    </Button>
                    {hasInputs && (
                      <Button
                        onClick={() => {
                          setFamilyType("individual");
                          setCityTier("metro");
                          setAge("30");
                          setSpouseAge("28");
                          setChildren("0");
                          setParentsAge("0");
                          setExistingCoverage("0");
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
                    <CardDescription>Understanding health insurance coverage calculation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h3 className="font-semibold mb-2 text-sm">Coverage Guidelines</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li><strong>Individual:</strong> Minimum ₹5 lakhs, Recommended ₹10 lakhs</li>
                          <li><strong>Family Floater:</strong> Minimum ₹10 lakhs, Recommended ₹15-20 lakhs</li>
                          <li><strong>Metro Cities:</strong> Higher coverage needed due to expensive medical costs</li>
                          <li><strong>Older Members:</strong> Higher coverage recommended (₹15L+)</li>
                        </ul>
                      </div>

                      <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                        <h3 className="font-semibold mb-2 text-sm">Coverage Factors</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                          <li>City tier (Metro requires 1.5x base coverage)</li>
                          <li>Number of family members</li>
                          <li>Age of oldest member</li>
                          <li>Existing coverage (if any)</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <p className="text-xs text-muted-foreground">
                          <strong>Note:</strong> Health insurance is essential for financial protection. 
                          Consider top-up plans for higher coverage at affordable premiums. Review your coverage annually.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Coverage Recommendation</CardTitle>
                    <CardDescription>Based on your profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Recommended Coverage</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(result.recommendedCoverage)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {familyType === "individual" ? "Individual coverage" : "Family floater coverage"}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {familyType === "individual" ? (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Individual Coverage</span>
                          <span className="font-medium">{formatCurrency(result.individualCoverage)}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Family Floater Coverage</span>
                          <span className="font-medium">{formatCurrency(result.familyCoverage)}</span>
                        </div>
                      )}
                      
                      {result.topUpCoverage > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Top-Up Recommended</span>
                          <span className="font-medium text-success">+{formatCurrency(result.topUpCoverage)}</span>
                        </div>
                      )}
                      
                      {parseFloat(existingCoverage) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Existing Coverage</span>
                          <span className="font-medium">{formatCurrency(parseFloat(existingCoverage))}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-success mb-1">Coverage Adequacy</p>
                          <p className="text-muted-foreground">
                            {result.recommendedCoverage >= 1000000 
                              ? "Excellent coverage! You're well protected against medical emergencies."
                              : result.recommendedCoverage >= 500000
                              ? "Good coverage. Consider increasing if you have older family members."
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

