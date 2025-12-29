"use client";

import { useState } from "react";
import { HelpCircle, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqCategories = [
  {
    category: "General",
    questions: [
      {
        question: "What is ManageYourSalary?",
        answer: "ManageYourSalary is a free online platform providing comprehensive salary and financial planning calculators for Indian professionals. We help you understand your salary breakdown, plan taxes, calculate retirement corpus, and make informed financial decisions."
      },
      {
        question: "Are the calculators free to use?",
        answer: "Yes, all our calculators are completely free to use. There are no hidden charges, no registration required, and no premium features. We believe financial planning should be accessible to everyone."
      },
      {
        question: "How accurate are the calculations?",
        answer: "Our calculators are built based on the latest Indian tax laws, EPFO rules, and financial regulations. We update them regularly to reflect changes in tax slabs, interest rates, and statutory limits. However, these are estimates and should be used for planning purposes. For official tax filing, please consult a Chartered Accountant."
      },
      {
        question: "Do I need to create an account?",
        answer: "No, you don't need to create an account or provide any personal information. All calculators work instantly without any registration. Your data is processed locally in your browser and never stored on our servers."
      },
      {
        question: "Is my data secure?",
        answer: "Yes, your privacy is our priority. All calculations happen locally in your browser. We don't store, track, or share any of your financial information. You can use our calculators with complete confidence."
      }
    ]
  },
  {
    category: "Salary Calculators",
    questions: [
      {
        question: "How does the In-Hand Salary Calculator work?",
        answer: "The In-Hand Salary Calculator breaks down your CTC (Cost to Company) into various components like Basic Salary, HRA, PF, ESI, Professional Tax, and Income Tax. It calculates your monthly take-home salary based on the old or new tax regime you choose."
      },
      {
        question: "What's the difference between Old and New Tax Regime?",
        answer: "The Old Tax Regime allows you to claim deductions under Section 80C, 80D, HRA exemption, and other benefits. The New Tax Regime offers lower tax rates but with minimal deductions. Our Tax Regime Calculator helps you compare both and choose the one that saves you more tax."
      },
      {
        question: "How is EPF calculated?",
        answer: "EPF (Employee Provident Fund) is calculated as 12% of your Basic Salary. Both you and your employer contribute 12% each. However, the contribution is capped at ₹1,800 per month (when basic salary is ₹15,000 or more). Our EPF calculator shows your projected corpus at retirement."
      },
      {
        question: "What is Gratuity and how is it calculated?",
        answer: "Gratuity is a retirement benefit paid by your employer. It's calculated as (Last Drawn Salary × 15 × Years of Service) / 26. You're eligible after completing 5 years of continuous service. The maximum gratuity is capped at ₹20 lakhs."
      },
      {
        question: "How does the Salary Growth Calculator work?",
        answer: "The Salary Growth Calculator projects your future salary based on your current salary, expected annual increment percentage, and number of years. It helps you plan your career growth and financial goals."
      }
    ]
  },
  {
    category: "Tax & Investment",
    questions: [
      {
        question: "Which tax regime should I choose?",
        answer: "It depends on your investments and deductions. If you have significant investments in PPF, ELSS, Life Insurance, Health Insurance, and HRA benefits, the Old Regime might be better. If you don't have many deductions, the New Regime could save you tax. Use our Tax Regime Calculator to compare both."
      },
      {
        question: "What is Section 80C?",
        answer: "Section 80C allows you to claim deductions up to ₹1,50,000 on investments in EPF, PPF, ELSS, Life Insurance, NSC, Tax-saving FDs, and home loan principal repayment. This reduces your taxable income."
      },
      {
        question: "How much should I invest in NPS?",
        answer: "NPS offers excellent tax benefits - up to ₹2 lakhs per year (₹1.5L under 80CCD(1) + ₹50K under 80CCD(1B)). Our NPS calculator helps you project your retirement corpus and understand the pension options available at retirement."
      },
      {
        question: "What is SIP and how does it help?",
        answer: "SIP (Systematic Investment Plan) is a disciplined way to invest in mutual funds. You invest a fixed amount monthly, which helps with rupee cost averaging and compounding. Our SIP calculator shows your potential returns over time."
      },
      {
        question: "How much should I save for retirement?",
        answer: "A common rule is to have 25-30 times your annual expenses at retirement. Our Retirement Planner helps you calculate your required corpus based on your current age, retirement age, expected returns, and inflation. It also shows if you're on track."
      }
    ]
  },
  {
    category: "Insurance",
    questions: [
      {
        question: "How much term insurance do I need?",
        answer: "A general rule is 10-20 times your annual income. However, it depends on your dependents, outstanding debts, existing assets, and years to retirement. Our Term Insurance Calculator provides personalized coverage recommendations."
      },
      {
        question: "What health insurance coverage should I have?",
        answer: "For individuals, minimum ₹5 lakhs is recommended, ideally ₹10 lakhs. For families, start with ₹10 lakhs and go up to ₹15-20 lakhs. Metro cities require higher coverage due to expensive medical costs. Our Health Insurance Calculator considers your family size, city tier, and age."
      },
      {
        question: "Is health insurance tax deductible?",
        answer: "Yes, health insurance premiums are deductible under Section 80D. For individuals below 60, you can claim up to ₹25,000. For senior citizens (60+), the limit is ₹50,000."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        question: "Do the calculators work on mobile?",
        answer: "Yes, all our calculators are fully responsive and work seamlessly on mobile phones, tablets, and desktops. You can use them anywhere, anytime."
      },
      {
        question: "Can I use these calculators offline?",
        answer: "The calculators require an internet connection to load initially. However, once loaded, basic calculations can work offline. For the best experience, we recommend using them online."
      },
      {
        question: "How often are the calculators updated?",
        answer: "We update our calculators whenever there are changes in tax laws, EPFO rules, or financial regulations. Major updates happen during budget announcements and policy changes."
      },
      {
        question: "Can I embed these calculators on my website?",
        answer: "Currently, our calculators are available only on our website. If you're interested in embedding them, please contact us through our support channels."
      },
      {
        question: "I found an error in a calculation. How do I report it?",
        answer: "We take accuracy seriously. If you find any discrepancy, please report it to us immediately. We'll verify and fix it promptly. Your feedback helps us improve."
      }
    ]
  }
];

export default function FAQPage() {
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
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">Find answers to common questions about our salary and financial calculators</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                  <CardDescription>Common questions about {category.category.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Still have questions?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact" className="text-sm text-primary hover:underline">
                    Contact Us →
                  </Link>
                  <Link href="/blog" className="text-sm text-primary hover:underline">
                    Read Our Blog →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

