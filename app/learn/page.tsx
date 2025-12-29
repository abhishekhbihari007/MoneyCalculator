import { ArrowLeft, BookOpen, GraduationCap, Target, TrendingUp, Shield, PiggyBank, Receipt, Lightbulb, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Learn Financial Planning - ManageYourSalary | Free Financial Education",
  description: "Learn about salary planning, tax optimization, retirement planning, and wealth building. Free financial education resources for Indian professionals.",
  keywords: "financial education, learn financial planning, salary planning guide, tax planning guide, retirement planning india",
};

export default function LearnPage() {
  const learningTopics = [
    {
      title: "Salary & Tax Planning",
      icon: Receipt,
      description: "Master the art of salary negotiation, understand your CTC breakdown, and optimize your tax savings.",
      topics: [
        "Understanding CTC vs In-Hand Salary",
        "Old vs New Tax Regime Comparison",
        "Maximizing Tax Deductions",
        "HRA Exemption Rules",
        "Section 80C, 80D, and Other Deductions"
      ]
    },
    {
      title: "Retirement Planning",
      icon: Target,
      description: "Plan for a secure retirement with EPF, NPS, and other retirement instruments.",
      topics: [
        "EPF vs NPS: Which is Better?",
        "Gratuity Calculation & Tax Benefits",
        "Retirement Corpus Planning",
        "Pension vs Lump Sum Options",
        "Early Retirement Planning (FIRE)"
      ]
    },
    {
      title: "Wealth Building",
      icon: TrendingUp,
      description: "Learn about SIP, mutual funds, fixed deposits, and other investment options.",
      topics: [
        "Power of Compounding",
        "SIP vs Lump Sum Investment",
        "FD vs RD vs Mutual Funds",
        "Asset Allocation Strategies",
        "Long-term Wealth Creation"
      ]
    },
    {
      title: "Protection Planning",
      icon: Shield,
      description: "Understand insurance needs and protect your family's financial future.",
      topics: [
        "Term Insurance Coverage Calculation",
        "Health Insurance Requirements",
        "Life Insurance vs Term Insurance",
        "Critical Illness Coverage",
        "Insurance Premium Optimization"
      ]
    },
    {
      title: "Smart Financial Decisions",
      icon: Lightbulb,
      description: "Make informed decisions about major financial choices in your life.",
      topics: [
        "Rent vs Own: Home Buying Decision",
        "Job Offer Comparison",
        "Salary Growth Planning",
        "Emergency Fund Planning",
        "Debt Management Strategies"
      ]
    }
  ];

  const quickGuides = [
    {
      title: "How to Calculate In-Hand Salary",
      href: "/calculator/in-hand-salary",
      description: "Step-by-step guide to understanding your take-home salary"
    },
    {
      title: "Old vs New Tax Regime: Which to Choose?",
      href: "/calculator/tax-regime",
      description: "Complete comparison guide to help you decide"
    },
    {
      title: "EPF vs NPS: Complete Comparison",
      href: "/blog/epf-vs-nps-which-is-better",
      description: "Detailed analysis of both retirement schemes"
    },
    {
      title: "Retirement Planning Calculator",
      href: "/calculator/retirement",
      description: "Calculate how much you need to retire comfortably"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-6xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Learn Financial Planning</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master the fundamentals of personal finance, tax planning, and wealth building with our comprehensive learning resources
              </p>
            </div>

            {/* Learning Topics */}
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">What You&apos;ll Learn</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningTopics.map((topic, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <topic.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {topic.topics.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Quick Guides */}
            <section>
              <h2 className="text-3xl font-bold mb-8 text-center">Quick Guides & Calculators</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickGuides.map((guide, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {guide.title}
                      </CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link 
                        href={guide.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        Learn More
                        <span>→</span>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-primary/5 rounded-lg p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Start Planning?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Use our free calculators to apply what you&apos;ve learned and take control of your financial future
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link href="/calculator/in-hand-salary">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Calculate In-Hand Salary
                  </button>
                </Link>
                <Link href="/calculator/tax-regime">
                  <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                    Compare Tax Regimes
                  </button>
                </Link>
                <Link href="/calculator/retirement">
                  <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                    Plan Your Retirement
                  </button>
                </Link>
              </div>
            </section>

            {/* Blog Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Latest Articles</h2>
                <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Check out our blog for in-depth articles on financial planning, tax strategies, and investment tips
                </p>
                <Link href="/blog">
                  <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Visit Blog
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

