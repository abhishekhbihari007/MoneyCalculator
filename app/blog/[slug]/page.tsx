import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const blogPosts: Record<string, {
  title: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
}> = {
  "old-vs-new-tax-regime-2024": {
    title: "Old vs New Tax Regime 2024: Which One Should You Choose?",
    category: "Tax Planning",
    date: "2024-01-15",
    readTime: "8 min read",
    excerpt: "A comprehensive guide to help you decide between Old and New Tax Regime for FY 2024-25.",
    content: `
# Old vs New Tax Regime 2024: Which One Should You Choose?

The Indian tax system offers two regimes - Old and New. Choosing the right one can save you thousands of rupees. Let's understand both regimes and help you make an informed decision.

## Understanding the Old Tax Regime

The Old Tax Regime allows you to claim various deductions and exemptions:

### Key Deductions Available:
- **Section 80C**: Up to ₹1,50,000 (EPF, PPF, ELSS, Life Insurance, etc.)
- **Section 80D**: Health Insurance (₹25,000 for self, ₹50,000 for seniors)
- **HRA Exemption**: Based on actual rent paid
- **Section 24(b)**: Home loan interest deduction
- **Standard Deduction**: ₹50,000

### Tax Slabs (Old Regime):
- 0 - ₹2.5L: 0% (₹3L for seniors 60-79, ₹5L for super seniors 80+)
- ₹2.5L - ₹5L: 5%
- ₹5L - ₹10L: 20%
- Above ₹10L: 30%

## Understanding the New Tax Regime

The New Tax Regime offers lower tax rates but with minimal deductions:

### Key Features:
- **Higher Standard Deduction**: ₹75,000 (vs ₹50,000 in Old Regime)
- **No Section 80C, 80D, HRA deductions**
- **Simplified tax filing**
- **No need to maintain investment proofs**

### Tax Slabs (New Regime):
- 0 - ₹3L: 0%
- ₹3L - ₹7L: 5%
- ₹7L - ₹10L: 10%
- ₹10L - ₹12L: 15%
- ₹12L - ₹15L: 20%
- ₹15L - ₹20L: 25%
- Above ₹20L: 30%

## When to Choose Old Regime?

Choose Old Regime if:
- You have investments exceeding ₹1.5L under Section 80C
- You pay home loan interest (Section 24(b))
- You have significant HRA exemption
- Your total deductions reduce taxable income significantly
- You're comfortable maintaining investment proofs

## When to Choose New Regime?

Choose New Regime if:
- You don't have many investments or deductions
- You prefer simpler tax filing
- Your income is up to ₹15L (benefits from lower rates)
- You don't have home loan or major insurance premiums
- You want hassle-free tax calculation

## How to Decide?

Use our Tax Regime Calculator to compare both regimes with your actual numbers. Enter your income, deductions, and see which one saves you more tax.

## Conclusion

The choice depends on your individual financial situation. Generally:
- **High deductions** → Old Regime
- **Minimal deductions** → New Regime
- **Income ₹5-15L** → Compare both carefully

Remember, you can switch regimes each financial year. Calculate both and choose the one that saves you more tax!
    `,
  },
  "epf-vs-nps-which-is-better": {
    title: "EPF vs NPS: Which Retirement Scheme is Better for You?",
    category: "Retirement Planning",
    date: "2024-01-10",
    readTime: "10 min read",
    excerpt: "Compare EPF and NPS to understand their differences, benefits, and which one suits your retirement planning goals better.",
    content: `
# EPF vs NPS: Which Retirement Scheme is Better for You?

Both EPF and NPS are excellent retirement savings schemes, but they serve different purposes. Let's compare them to help you make the right choice.

## Employee Provident Fund (EPF)

### Key Features:
- **Mandatory** for salaried employees
- **Guaranteed returns** (currently 8.25% p.a.)
- **Tax-free** interest and withdrawal (after 5 years)
- **Employer matching** (12% contribution)
- **Capped contribution** (₹1,800/month max)

### Pros:
- Risk-free guaranteed returns
- Employer contributes equally
- Triple tax benefit
- Can withdraw for emergencies
- No market risk

### Cons:
- Lower returns compared to equity
- Contribution cap limits growth
- Limited flexibility in investment

## National Pension System (NPS)

### Key Features:
- **Voluntary** retirement savings scheme
- **Market-linked returns** (8-12% typically)
- **Higher tax benefits** (up to ₹2L deduction)
- **Flexible asset allocation**
- **Lock-in until 60 years**

### Pros:
- Higher potential returns
- Better tax benefits (₹2L vs ₹1.5L)
- Flexible asset allocation
- Professional fund management
- Can choose equity exposure

### Cons:
- Market risk involved
- Lock-in until retirement
- Lower liquidity
- Returns not guaranteed

## EPF vs NPS: Comparison

| Feature | EPF | NPS |
|---------|-----|-----|
| Returns | 8.25% (guaranteed) | 8-12% (market-linked) |
| Risk | Risk-free | Market risk |
| Tax Benefit | ₹1.5L (80C) | ₹2L (80CCD) |
| Liquidity | Partial withdrawals allowed | Lock-in until 60 |
| Employer Contribution | Yes (mandatory) | Optional |
| Contribution Cap | ₹1,800/month | No cap |

## Which One Should You Choose?

### Choose EPF if:
- You want guaranteed, risk-free returns
- You prefer stability over growth
- You need emergency access to funds
- You're risk-averse

### Choose NPS if:
- You want higher potential returns
- You can take market risk
- You want maximum tax benefits
- You're investing for long-term (20+ years)

## The Best Strategy: Both!

**Ideal approach**: Use both EPF and NPS
- **EPF**: For guaranteed, risk-free retirement savings
- **NPS**: For higher growth potential and tax benefits

This diversification balances safety and growth, giving you the best of both worlds.

## Conclusion

EPF and NPS complement each other. EPF provides guaranteed safety, while NPS offers growth potential. Use our EPF and NPS calculators to project your retirement corpus with both schemes.
    `,
  },
  "how-to-calculate-in-hand-salary": {
    title: "How to Calculate Your In-Hand Salary: Complete Guide",
    category: "Salary Management",
    date: "2024-01-05",
    readTime: "6 min read",
    excerpt: "Learn how to break down your CTC and calculate your actual take-home salary.",
    content: `
# How to Calculate Your In-Hand Salary: Complete Guide

Understanding your salary breakdown is crucial for financial planning. Let's learn how to calculate your actual take-home salary from your CTC.

## Understanding CTC Components

CTC (Cost to Company) includes:
- **Basic Salary**: Core salary component
- **HRA**: House Rent Allowance
- **Special Allowances**: Various allowances
- **PF Contribution**: Employee + Employer
- **Gratuity**: Retirement benefit
- **Insurance**: Health/Life insurance
- **Other Benefits**: Variable pay, bonuses, etc.

## Step-by-Step Calculation

### Step 1: Calculate Gross Salary
Gross Salary = CTC - Employer PF - Gratuity - Insurance

### Step 2: Calculate Deductions
- **Employee PF**: 12% of Basic (max ₹1,800/month)
- **Professional Tax**: ₹200/month (varies by state)
- **Income Tax**: Based on tax regime and deductions
- **ESI**: 0.75% of Gross (if applicable)

### Step 3: Calculate In-Hand Salary
In-Hand Salary = Gross Salary - All Deductions

## Factors Affecting In-Hand Salary

1. **Tax Regime**: Old vs New affects tax calculation
2. **Deductions**: 80C, 80D, HRA reduce taxable income
3. **Exemptions**: HRA, LTA reduce tax liability
4. **Investments**: Section 80C investments save tax

## Use Our Calculator

Our In-Hand Salary Calculator does all these calculations automatically. Just enter your CTC and get:
- Detailed salary breakdown
- Tax calculations
- Comparison of Old vs New Regime
- Monthly and annual breakdowns

## Tips to Increase In-Hand Salary

1. **Optimize Tax Regime**: Choose the one that saves more tax
2. **Maximize Deductions**: Invest in 80C, 80D
3. **Claim HRA**: If you pay rent
4. **Plan Investments**: Reduce taxable income legally

## Conclusion

Understanding your salary breakdown helps you:
- Plan your budget better
- Optimize tax savings
- Make informed financial decisions
- Negotiate better CTC

Use our calculator to see your exact in-hand salary!
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - ManageYourSalary Blog`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  const otherPosts = Object.entries(blogPosts)
    .filter(([slug]) => slug !== params.slug)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container py-8 md:py-12">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">{post.category}</Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              {post.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{line.substring(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
                }
                if (line.startsWith('|')) {
                  return null; // Skip table rows for now
                }
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                  if (match) {
                    return (
                      <p key={index} className="mb-2">
                        <strong>{match[1]}</strong>: {match[2]}
                      </p>
                    );
                  }
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
                }
                return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
              })}
            </div>

            {otherPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {otherPosts.map(([slug, relatedPost]) => (
                    <Card key={slug} className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <Badge variant="outline" className="mb-2">{relatedPost.category}</Badge>
                        <h3 className="font-semibold mb-2">
                          <Link href={`/blog/${slug}`} className="hover:text-primary transition-colors">
                            {relatedPost.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <Link 
                          href={`/blog/${slug}`}
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

