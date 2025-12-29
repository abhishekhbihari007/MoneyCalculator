"use client";

import { CreditCard, TrendingUp, Shield, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CreditScorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          {/* Back Button */}
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Credit Score</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understand and improve your credit score to unlock better financial opportunities
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  What is Credit Score?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A credit score is a 3-digit number (300-900) that represents your creditworthiness. 
                  Higher scores indicate better credit health and help you get loans at lower interest rates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Why It Matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lenders use your credit score to determine loan eligibility and interest rates. 
                  A good score (750+) can save you lakhs in interest over time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  How to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pay bills on time, keep credit utilization low, maintain a healthy credit mix, 
                  and avoid too many credit inquiries.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Credit Score Ranges */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Credit Score Ranges</CardTitle>
              <CardDescription>Understanding where you stand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                  <div>
                    <p className="font-semibold text-success">750 - 900 (Excellent)</p>
                    <p className="text-sm text-muted-foreground">Best interest rates, easy loan approval</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div>
                    <p className="font-semibold text-primary">700 - 749 (Good)</p>
                    <p className="text-sm text-muted-foreground">Good rates, likely approval</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div>
                    <p className="font-semibold text-accent">650 - 699 (Fair)</p>
                    <p className="text-sm text-muted-foreground">Moderate rates, may need co-signer</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div>
                    <p className="font-semibold text-destructive">300 - 649 (Poor)</p>
                    <p className="text-sm text-muted-foreground">High rates, difficult approval</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tips to Improve Your Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Pay on Time</p>
                    <p className="text-sm text-muted-foreground">Payment history is 35% of your score</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Keep Utilization Low</p>
                    <p className="text-sm text-muted-foreground">Use less than 30% of credit limit</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Maintain Credit History</p>
                    <p className="text-sm text-muted-foreground">Longer history improves your score</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Limit New Applications</p>
                    <p className="text-sm text-muted-foreground">Too many inquiries can hurt your score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

