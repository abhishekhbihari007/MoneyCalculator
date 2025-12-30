"use client";

import { useState } from "react";
import { Receipt, ArrowLeft, TrendingUp, TrendingDown, Calculator, Info, CheckCircle2, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleLinks from "@/components/sections/ArticleLinks";
import { calculateIncomeTax, type TaxInput, type TaxResult, type AgeCategory } from "@/utils/taxCalculator";

interface TaxSlab {
  from: number;
  to: number;
  rate: number;
  tax: number;
}

// Using TaxResult from taxCalculator utility
interface CalculationResult {
  oldRegime: TaxResult;
  newRegime: TaxResult;
  recommendation: "OLD" | "NEW";
  taxSavings: number;
}

export default function TaxRegimePicker() {
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [section80C, setSection80C] = useState<string>("150000");
  const [section80D, setSection80D] = useState<string>("0");
  const [otherDeductions, setOtherDeductions] = useState<string>("0");
  const [ageCategory, setAgeCategory] = useState<AgeCategory>("below60");
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("old");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNumberInput = (
    value: string,
    setter: (value: string) => void,
    fieldName: string,
    isRequired: boolean = false,
    max?: number
  ) => {
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
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      return;
    }
    if (max !== undefined && numValue > max) {
      setErrors(prev => ({ ...prev, [fieldName]: `Maximum allowed is ₹${max.toLocaleString("en-IN")}` }));
      return;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    setter(value);
  };

  // Old calculation functions removed - now using taxCalculator utility

  const calculateTax = () => {
    setErrors({});
    const income = parseFloat(annualIncome) || 0;
    const sec80C = Math.min(parseFloat(section80C || "0") || 0, 150000);
    const sec80DInput = parseFloat(section80D || "0") || 0;
    
    // HRA exemption - set to 0 since calculation inputs are removed
    const hraValue = 0;
    
    const otherDed = parseFloat(otherDeductions || "0") || 0;

    // STRICT VALIDATION - Policy Guardrails
    // Rule 1: Annual Income must be positive
    if (!annualIncome || income <= 0 || isNaN(income)) {
      setErrors(prev => ({ ...prev, annualIncome: "Annual income must be greater than ₹0 as per Income Tax rules." }));
      setResult(null);
      return;
    }

    // Rule 2: No negative deductions allowed
    if (sec80C < 0 || sec80DInput < 0 || hraValue < 0 || otherDed < 0) {
      setErrors(prev => ({ ...prev, deductions: "Deductions cannot be negative. Please enter valid non-negative values." }));
      setResult(null);
      return;
    }

    // Rule 3: Section 80C cannot exceed statutory limit
    if (parseFloat(section80C || "0") > 150000) {
      setErrors(prev => ({ ...prev, "80c": "Section 80C deduction cannot exceed ₹1,50,000 as per Income Tax Act." }));
      setResult(null);
      return;
    }

    // Rule 4: Section 80D age-based limits
    let sec80DMax = 25000; // Default for below 60
    if (ageCategory === "senior" || ageCategory === "superSenior") {
      sec80DMax = 50000; // ₹50,000 for senior citizens (60+)
    }
    const sec80D = Math.min(sec80DInput, sec80DMax);
    if (sec80DInput > sec80DMax) {
      setErrors(prev => ({ ...prev, "80d": `Section 80D cannot exceed ₹${sec80DMax.toLocaleString("en-IN")} for ${ageCategory === "below60" ? "individuals below 60" : "senior citizens"} as per Income Tax Act.` }));
      setResult(null);
      return;
    }

    // Rule 5: Total deductions cannot exceed annual income (Income Tax Act requirement)
    const totalDeductions = sec80C + sec80D + hraValue + otherDed;
    if (totalDeductions > income) {
      setErrors(prev => ({ ...prev, deductions: "Total deductions cannot exceed annual income as per Income Tax rules." }));
      setResult(null);
      return;
    }

    // Use the comprehensive tax calculator utility
    const oldRegimeInput: TaxInput = {
      annualGrossIncome: income,
      regime: 'OLD',
      ageCategory: ageCategory,
      deductions: {
        section80C: sec80C,
        section80D: sec80D,
        hra: hraValue,
        otherDeductions: otherDed,
      },
    };

    const newRegimeInput: TaxInput = {
      annualGrossIncome: income,
      regime: 'NEW',
      ageCategory: ageCategory,
      deductions: {},
    };

    let oldRegime = calculateIncomeTax(oldRegimeInput);
    let newRegime = calculateIncomeTax(newRegimeInput);

    // IMPORTANT: If Gross Salary ≤ ₹12,00,000 (New Regime), no tax should be shown
    // This matches the Hand Salary Calculator logic
    if (income <= 1200000) {
      // Override tax to 0 for New Regime if gross income <= ₹12,00,000
      newRegime = {
        ...newRegime,
        taxBeforeRebate: 0,
        rebateAmount: 0,
        taxAfterRebate: 0,
        surcharge: 0,
        cessAmount: 0,
        finalTaxPayable: 0,
        taxSlabBreakdown: [],
      };
    }

    // Determine recommendation
    const recommendation = newRegime.finalTaxPayable < oldRegime.finalTaxPayable ? "NEW" : "OLD";
    const taxSavings = Math.abs(newRegime.finalTaxPayable - oldRegime.finalTaxPayable);

    setResult({
      oldRegime,
      newRegime,
      recommendation,
      taxSavings,
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

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
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
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Indian Income Tax Regime Calculator</h1>
                <p className="text-muted-foreground">Calculate tax accurately under Old and New Tax Regimes with step-by-step breakdown</p>
              </div>
            </div>
          </div>

          {/* Tax Regime Tabs */}
          <div className="mb-6">
            <Tabs value={taxRegime} onValueChange={(value) => {
              setTaxRegime(value as "old" | "new");
              setResult(null); // Clear results when switching tabs
            }}>
              <TabsList className="grid w-full max-w-md grid-cols-2 gap-1">
                <TabsTrigger value="old" className="flex items-center gap-2 text-xs sm:text-sm">
                  {taxRegime === "old" && <CheckCircle2 className="h-4 w-4" />}
                  Old Regime
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  {taxRegime === "new" && <CheckCircle2 className="h-4 w-4" />}
                  New Regime
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground mt-2">You can switch regimes anytime to compare results</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>Provide your income and deduction details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Annual Gross Income (₹) *</Label>
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
                  <Label htmlFor="age">Age Category *</Label>
                  <RadioGroup value={ageCategory} onValueChange={(value) => setAgeCategory(value as AgeCategory)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="below60" id="below60" />
                      <Label htmlFor="below60" className="font-normal cursor-pointer">Below 60 years</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior" className="font-normal cursor-pointer">Senior Citizen (60-79 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="superSenior" id="superSenior" />
                      <Label htmlFor="superSenior" className="font-normal cursor-pointer">Super Senior Citizen (80+ years)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {taxRegime === "old" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Deductions (Old Regime Only)</p>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="80c">Section 80C (₹)</Label>
                    <Input
                      id="80c"
                      type="text"
                      placeholder="150000"
                      value={section80C}
                      onChange={(e) => handleNumberInput(e.target.value, setSection80C, "80c", false, 150000)}
                    />
                    <p className="text-xs text-muted-foreground">Maximum ₹1,50,000 (EPF, PPF, ELSS, etc.)</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="80d">Section 80D - Health Insurance (₹)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Below 60: ₹25,000<br />Senior (60+): ₹50,000</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="80d"
                      type="text"
                      placeholder="0"
                      value={section80D}
                      onChange={(e) => handleNumberInput(e.target.value, setSection80D, "80d", false, ageCategory === "below60" ? 25000 : 50000)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Health insurance premium (Max: ₹{ageCategory === "below60" ? "25,000" : "50,000"} for {ageCategory === "below60" ? "individuals below 60" : "senior citizens"})
                    </p>
                    {errors["80d"] && (
                      <p className="text-xs text-destructive">{errors["80d"]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other">Other Deductions (₹)</Label>
                    <Input
                      id="other"
                      type="text"
                      placeholder="0"
                      value={otherDeductions}
                      onChange={(e) => handleNumberInput(e.target.value, setOtherDeductions, "other", false)}
                    />
                    <p className="text-xs text-muted-foreground">80G, 80E, 24(b), etc.</p>
                  </div>

                    {errors.deductions && (
                      <p className="text-xs text-destructive">{errors.deductions}</p>
                    )}
                  </div>
                )}

                {taxRegime === "new" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">New Regime Information</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                      <p className="text-sm text-muted-foreground">
                        The New Tax Regime offers a simplified tax structure with:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                        <li>Higher standard deduction of ₹75,000</li>
                        <li>No need to maintain investment proofs</li>
                        <li>Lower tax rates for income up to ₹15L</li>
                        <li>No deductions allowed (except standard deduction)</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={calculateTax} className={annualIncome || section80C !== "150000" || section80D !== "0" || otherDeductions !== "0" ? "flex-1" : "w-full"} size="lg">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate Tax
                  </Button>
                  {(annualIncome || section80C !== "150000" || section80D !== "0" || otherDeductions !== "0") && (
                    <Button 
                      onClick={() => {
                        setAnnualIncome("");
                        setSection80C("150000");
                        setSection80D("0");
                        setOtherDeductions("0");
                        setAgeCategory("below60");
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
                    How It Works - {taxRegime === "old" ? "Old" : "New"} Tax Regime
                  </CardTitle>
                  <CardDescription>Complete guide to understanding {taxRegime === "old" ? "Old" : "New"} Tax Regime calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {taxRegime === "old" ? (
                    <>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <h3 className="font-semibold mb-3 text-base text-foreground">Old Tax Regime - Overview</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          The Old Tax Regime allows you to claim various deductions and exemptions to reduce your taxable income. 
                          This regime is beneficial if you have significant investments, insurance premiums, home loan interest, 
                          and other eligible deductions. You need to maintain proof of investments and expenses to claim these deductions.
                        </p>
                        
                        <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">Step-by-Step Calculation Process:</h4>
                        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Enter Annual Gross Income:</strong> Your total income from all sources including salary, 
                            interest, rental income, etc.
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Add Deductions:</strong>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                              <li><strong>Section 80C:</strong> Up to ₹1,50,000 (EPF, PPF, ELSS, Life Insurance, NSC, Tax-saving FDs, etc.)</li>
                              <li><strong>Section 80D:</strong> Health insurance premiums (₹25,000 for self/family, ₹50,000 for senior citizens)</li>
                              <li><strong>HRA:</strong> House Rent Allowance exemption based on actual rent paid</li>
                              <li><strong>Other Deductions:</strong> 80G (donations), 80E (education loan), 24(b) (home loan interest), etc.</li>
                            </ul>
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Standard Deduction:</strong> ₹50,000 is automatically deducted from your salary income
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Calculate Taxable Income:</strong> Gross Income - Total Deductions - Standard Deduction
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Apply Tax Slabs:</strong> Tax is calculated progressively using these rates:
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 bg-muted/30 p-2 rounded">
                              <li><strong>0 - ₹2.5L:</strong> 0% (₹3L for senior citizens 60-79, ₹5L for super senior citizens 80+)</li>
                              <li><strong>₹2.5L - ₹5L:</strong> 5%</li>
                              <li><strong>₹5L - ₹10L:</strong> 20%</li>
                              <li><strong>Above ₹10L:</strong> 30%</li>
                            </ul>
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Section 87A Rebate:</strong> If your taxable income is ≤ ₹5,00,000, 
                            you get a rebate of up to ₹12,500 (reduces your tax liability)
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Health & Education Cess:</strong> 4% of the tax amount is added as cess
                          </li>
                        </ol>
                      </div>

                      <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                        <h4 className="font-semibold mb-2 text-sm text-foreground">Who Should Choose Old Regime?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>If you have investments in PPF, ELSS, Life Insurance, etc. exceeding ₹1.5L</li>
                          <li>If you pay home loan interest (Section 24(b))</li>
                          <li>If you have significant health insurance premiums</li>
                          <li>If you pay rent and can claim HRA exemption</li>
                          <li>If your total deductions reduce taxable income significantly</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                        <h3 className="font-semibold mb-3 text-base text-foreground">New Tax Regime - Overview</h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          The New Tax Regime (introduced in Budget 2020, made default from FY 2023-24) offers simplified tax calculation 
                          with lower tax rates but without most deductions. This regime is ideal if you don&apos;t have many investments or 
                          deductions to claim. You don&apos;t need to maintain investment proofs, making tax filing simpler.
                        </p>
                        
                        <h4 className="font-semibold mb-2 text-sm text-foreground mt-4">Step-by-Step Calculation Process:</h4>
                        <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Enter Annual Gross Income:</strong> Your total income from all sources
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Standard Deduction:</strong> ₹75,000 is automatically deducted (higher than Old Regime&apos;s ₹50,000)
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">No Other Deductions:</strong> Unlike Old Regime, you cannot claim:
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                              <li>Section 80C (PPF, ELSS, Life Insurance, etc.)</li>
                              <li>Section 80D (Health Insurance)</li>
                              <li>HRA exemption</li>
                              <li>Home loan interest deduction</li>
                              <li>Other chapter VI-A deductions</li>
                            </ul>
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Calculate Taxable Income:</strong> Gross Income - Standard Deduction (₹75,000)
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Apply Tax Slabs:</strong> Tax is calculated progressively using these rates:
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 bg-muted/30 p-2 rounded">
                              <li><strong>₹0 - ₹3L:</strong> 0%</li>
                              <li><strong>₹3,00,001 - ₹6L:</strong> 5%</li>
                              <li><strong>₹6,00,001 - ₹9L:</strong> 10%</li>
                              <li><strong>₹9,00,001 - ₹12L:</strong> 15%</li>
                              <li><strong>₹12,00,001 - ₹15L:</strong> 20%</li>
                              <li><strong>Above ₹15L:</strong> 30%</li>
                            </ul>
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Section 87A Rebate:</strong> 
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                              <li>Up to ₹25,000 rebate if taxable income ≤ ₹7,00,000</li>
                              <li>Income up to ₹12,75,000 gross (₹12,00,000 taxable) is effectively tax-free due to rebate</li>
                            </ul>
                          </li>
                          <li className="leading-relaxed">
                            <strong className="text-foreground">Health & Education Cess:</strong> 4% of the tax amount is added as cess
                          </li>
                        </ol>
                      </div>

                      <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                        <h4 className="font-semibold mb-2 text-sm text-foreground">Who Should Choose New Regime?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li>If you don&apos;t have significant investments or deductions to claim</li>
                          <li>If you prefer simpler tax filing without maintaining investment proofs</li>
                          <li>If your income is up to ₹15L (benefits from lower tax rates)</li>
                          <li>If you don&apos;t have home loan, HRA, or major insurance premiums</li>
                          <li>If you want hassle-free tax calculation</li>
                        </ul>
                      </div>
                    </>
                  )}

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">💡 Pro Tip</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Switch between regimes using the tabs above</strong> to see detailed calculations for both. 
                      After calculating, you&apos;ll see a comparison showing which regime saves you more tax. The recommended regime 
                      is highlighted with the lower tax amount. Remember, you can choose your preferred regime each financial year 
                      when filing your income tax return.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Important:</strong> This calculator uses the latest tax slabs and rates for FY 2024-25 (AY 2025-26). 
                      All calculations are based on the Income Tax Act, 1961. For personalized tax planning advice, 
                      please consult a qualified Chartered Accountant.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Selected Regime Results */}
                {taxRegime === "old" ? (
                  <Card className={result.recommendation === "OLD" ? "border-green-500" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Old Tax Regime</span>
                        {result.recommendation === "OLD" && (
                          <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Recommended</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Gross Income</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Deductions</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.totalDeductions)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Deduction</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.standardDeduction)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Taxable Income</span>
                          <span className="font-bold">{formatCurrency(result.oldRegime.taxableIncome)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-medium">Slab-wise Tax Calculation:</p>
                        {result.oldRegime.taxSlabBreakdown.map((slab, index) => (
                          <div key={index} className="text-xs bg-muted/50 p-2 rounded">
                            <div className="flex justify-between">
                              <span>₹{formatNumber(slab.from)} - ₹{formatNumber(slab.to)} @ {slab.rate}%</span>
                              <span className="font-semibold">{formatCurrency(slab.tax)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Tax Before Rebate</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.taxBeforeRebate)}</span>
                        </div>
                        {result.oldRegime.rebateAmount > 0 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Rebate (Section 87A)</span>
                            <span className="font-semibold">-{formatCurrency(result.oldRegime.rebateAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax After Rebate</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.taxAfterRebate)}</span>
                        </div>
                        {result.oldRegime.surcharge > 0 && (
                          <div className="flex justify-between">
                            <span>Surcharge</span>
                            <span className="font-semibold">{formatCurrency(result.oldRegime.surcharge)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Health & Education Cess (4%)</span>
                          <span className="font-semibold">{formatCurrency(result.oldRegime.cessAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold">Final Tax Payable</span>
                          <span className="text-lg font-bold text-destructive">{formatCurrency(result.oldRegime.finalTaxPayable)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className={result.recommendation === "NEW" ? "border-green-500" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>New Tax Regime</span>
                        {result.recommendation === "NEW" && (
                          <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Recommended</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Gross Income</span>
                          <span className="font-semibold">{formatCurrency(result.newRegime.grossIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Deduction</span>
                          <span className="font-semibold">{formatCurrency(result.newRegime.standardDeduction)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Taxable Income</span>
                          <span className="font-bold">{formatCurrency(result.newRegime.taxableIncome)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <p className="text-sm font-medium">Slab-wise Tax Calculation:</p>
                        {result.newRegime.taxSlabBreakdown.map((slab, index) => (
                          <div key={index} className="text-xs bg-muted/50 p-2 rounded">
                            <div className="flex justify-between">
                              <span>₹{formatNumber(slab.from)} - ₹{formatNumber(slab.to)} @ {slab.rate}%</span>
                              <span className="font-semibold">{formatCurrency(slab.tax)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Tax Before Rebate</span>
                          <span className="font-semibold">{formatCurrency(result.newRegime.taxBeforeRebate)}</span>
                        </div>
                        {result.newRegime.rebateAmount > 0 && (
                          <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Rebate (Section 87A)</span>
                            <span className="font-semibold">-{formatCurrency(result.newRegime.rebateAmount)}</span>
                          </div>
                        )}
                        {result.newRegime.marginalRelief && result.newRegime.marginalRelief > 0 && (
                          <div className="flex justify-between text-blue-600 dark:text-blue-400">
                            <span>Marginal Relief</span>
                            <span className="font-semibold">-{formatCurrency(result.newRegime.marginalRelief)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax After Rebate</span>
                          <span className="font-semibold">{formatCurrency(result.newRegime.taxAfterRebate)}</span>
                        </div>
                        {result.newRegime.surcharge > 0 && (
                          <div className="flex justify-between">
                            <span>Surcharge (max 25%)</span>
                            <span className="font-semibold">{formatCurrency(result.newRegime.surcharge)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Health & Education Cess (4%)</span>
                          <span className="font-semibold">{formatCurrency(result.newRegime.cessAmount)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold">Final Tax Payable</span>
                          <span className="text-lg font-bold text-destructive">{formatCurrency(result.newRegime.finalTaxPayable)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comparison */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      {result.recommendation === "NEW" ? (
                        <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      )}
                      <div>
                        <p className="font-semibold text-lg">Recommended Regime: {result.recommendation}</p>
                        <p className="text-sm text-muted-foreground">Lower tax option for your income</p>
                      </div>
                    </div>
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Tax under Old Regime</span>
                        <span className="font-semibold">{formatCurrency(result.oldRegime.finalTaxPayable)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax under New Regime</span>
                        <span className="font-semibold">{formatCurrency(result.newRegime.finalTaxPayable)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold">Tax Savings</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(result.taxSavings)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Article Links Section */}
            <ArticleLinks calculatorType="tax-regime" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
