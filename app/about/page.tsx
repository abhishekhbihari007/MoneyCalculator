import { ArrowLeft, Target, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "About Us - ManageYourSalary | Free Financial Calculators for India",
  description: "Learn about ManageYourSalary - your trusted partner for salary calculations, tax planning, and financial planning. Free tools for Indian professionals.",
  keywords: "about manageyoursalary, salary calculator about, financial planning tools india",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">About ManageYourSalary</h1>
              <p className="text-xl text-muted-foreground">
                Empowering Indian professionals to take control of their finances
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At ManageYourSalary, we believe that financial literacy should be accessible to everyone. 
                  Our mission is to empower Indian professionals with free, accurate, and easy-to-use financial 
                  calculators that help them understand their salary, plan their taxes, and build wealth for 
                  the future.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We understand that navigating the complexities of Indian tax laws, EPF rules, and investment 
                  options can be overwhelming. That&apos;s why we&apos;ve created comprehensive calculators that break 
                  down complex financial concepts into simple, actionable insights.
                </p>
              </section>

              <section className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Salary Calculators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Calculate your in-hand salary, understand CTC breakdown, compare tax regimes, 
                        and plan your salary growth over time.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Shield className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Tax Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Compare Old vs New Tax Regime, understand deductions, and optimize your tax 
                        savings legally.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Zap className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Investment Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Plan your EPF, NPS, SIP investments, and calculate your retirement corpus 
                        requirements.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Users className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Insurance Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Calculate adequate term insurance and health insurance coverage based on 
                        your financial profile.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold">Our Values</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground">✓ Free & Accessible:</span>
                    <span>All our tools are completely free with no hidden costs or premium features.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground">✓ Privacy First:</span>
                    <span>Your financial data stays in your browser. We don&apos;t store or track any personal information.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground">✓ Accurate & Updated:</span>
                    <span>Our calculators are based on the latest tax laws and financial regulations, updated regularly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-semibold text-foreground">✓ Easy to Use:</span>
                    <span>Complex financial calculations made simple with intuitive interfaces and clear explanations.</span>
                  </li>
                </ul>
              </section>

              <section className="space-y-4 mt-8">
                <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Comprehensive Coverage:</strong> We cover all aspects of salary 
                    and financial planning - from CTC breakdown to retirement planning, tax optimization to insurance 
                    coverage.
                  </p>
                  <p>
                    <strong className="text-foreground">Indian Context:</strong> All our calculators are specifically 
                    designed for Indian tax laws, EPFO rules, and financial regulations. No generic international tools.
                  </p>
                  <p>
                    <strong className="text-foreground">Educational:</strong> We don&apos;t just calculate - we explain 
                    how things work, why they matter, and what you should do. Financial literacy is at the core of 
                    everything we do.
                  </p>
                  <p>
                    <strong className="text-foreground">Regular Updates:</strong> We stay updated with the latest 
                    budget announcements, tax law changes, and policy updates to ensure our calculators remain accurate.
                  </p>
                </div>
              </section>

              <section className="space-y-4 mt-8 p-6 bg-primary/5 rounded-lg border border-primary/10">
                <h2 className="text-2xl font-semibold">Disclaimer</h2>
                <p className="text-sm text-muted-foreground">
                  While we strive for accuracy, our calculators provide estimates for planning purposes. 
                  For official tax filing, legal advice, or complex financial planning, please consult a 
                  qualified Chartered Accountant or Financial Advisor. We are not responsible for any 
                  financial decisions made based on our calculators.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

