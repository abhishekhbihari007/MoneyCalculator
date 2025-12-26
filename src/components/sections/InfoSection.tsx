"use client";

import { useState } from "react";
import { CreditCard, Shield, Landmark, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

const sections = [
  {
    id: "credit",
    icon: CreditCard,
    title: "Understanding Your Credit Health",
    subtitle: "Why your financial reputation matters",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20 text-primary",
    content: "Think of your credit score as your financial report card. It's a three-digit number that tells lenders how reliably you've managed borrowed money in the past. In India, this score ranges from 300 to 900—the higher, the better your chances of getting approved for loans and credit cards with favorable terms.",
    tips: [
      "Pay all your EMIs and credit card bills before the due date—even a single late payment can hurt your score",
      "Keep your credit card spending below 30% of your total limit to show responsible usage",
      "Avoid applying for multiple loans or cards within a short period",
      "Check your credit report annually for errors that might be pulling your score down"
    ],
    faqs: [
      {
        question: "How is my credit score actually calculated?",
        answer: "Your score is built from five key ingredients: payment history (do you pay on time?), credit utilization (how much of your limit do you use?), length of credit history (how long have you been borrowing?), credit mix (do you have different types of credit?), and recent inquiries (have you been applying for lots of credit recently?).",
      },
      {
        question: "Can I build credit without a credit card?",
        answer: "Absolutely! A secured loan, a small personal loan, or even being an authorized user on a family member's credit card can help you build a credit history. The key is demonstrating that you can borrow responsibly and repay on time.",
      },
      {
        question: "How long does it take to improve a low score?",
        answer: "With consistent positive behavior—paying on time, reducing balances, avoiding new credit applications—you can typically see meaningful improvement in 3-6 months. Major improvements usually take 12-18 months of disciplined financial habits.",
      },
    ],
  },
  {
    id: "insurance",
    icon: Shield,
    title: "The Protection Every Earner Needs",
    subtitle: "Building a safety net for life's uncertainties",
    color: "from-destructive/20 to-destructive/5",
    iconBg: "bg-destructive/20 text-destructive",
    content: "Insurance isn't just another expense—it's the foundation of sound financial planning. The right coverage ensures that unexpected events don't derail your family's financial security. Term insurance protects your loved ones' future, while health insurance shields your savings from medical emergencies.",
    tips: [
      "Get term insurance early in your career when premiums are lowest",
      "Your life cover should be at least 10-15 times your annual income",
      "Choose health insurance with adequate room rent limits and no sub-limits on treatments",
      "Review and update your coverage whenever you have major life changes"
    ],
    faqs: [
      {
        question: "Term insurance vs. endowment plans—which is better?",
        answer: "For pure protection, term insurance wins hands down. It offers maximum coverage at minimum cost. Endowment plans mix insurance with investment, but typically provide lower coverage and modest returns. Keep insurance and investments separate for better results in both.",
      },
      {
        question: "What health insurance sum insured makes sense today?",
        answer: "For a family in a major city, consider at least ₹10-15 lakhs as a base. Factor in that a week in a good hospital ICU can cost ₹3-5 lakhs, and major surgeries can run into ₹8-15 lakhs. A super top-up policy can affordably extend your coverage.",
      },
      {
        question: "Should I rely on my employer's group health insurance?",
        answer: "Your employer's cover is a great benefit, but it has limitations—coverage ends if you leave the job, and you can't customize it. Having your own policy ensures continuous coverage and gives you control over your protection.",
      },
    ],
  },
  {
    id: "retirement",
    icon: Landmark,
    title: "Building Your Retirement Wealth",
    subtitle: "Making EPF and NPS work harder for you",
    color: "from-success/20 to-success/5",
    iconBg: "bg-success/20 text-success",
    content: "Your Employee Provident Fund and National Pension System are powerful wealth-building tools that many professionals don't fully leverage. EPF provides safe, guaranteed returns with employer matching, while NPS offers market-linked growth potential with attractive tax benefits beyond Section 80C.",
    tips: [
      "Never withdraw your EPF when changing jobs—let compounding work its magic",
      "Consider increasing your EPF contribution through VPF for guaranteed returns",
      "NPS offers an extra ₹50,000 tax deduction under Section 80CCD(1B)",
      "Start with aggressive equity allocation in NPS while young, then gradually shift to safer options"
    ],
    faqs: [
      {
        question: "Is the additional NPS tax benefit worth it?",
        answer: "If you're in the 30% tax bracket, the extra ₹50,000 deduction saves you ₹15,600 in taxes annually. Over a 25-year career, this alone could grow to a substantial corpus. Plus, NPS has among the lowest fund management charges in India.",
      },
      {
        question: "VPF vs. PPF vs. NPS—where should my extra savings go?",
        answer: "VPF offers the same guaranteed return as EPF (currently around 8.25%) with the convenience of payroll deduction. PPF provides similar safety but has a ₹1.5 lakh annual limit. NPS offers potentially higher returns through equity exposure. A mix of all three provides both safety and growth.",
      },
      {
        question: "How much do I actually need for retirement?",
        answer: "A practical approach: estimate your annual expenses at retirement, multiply by 25-30 (assuming 3-4% annual withdrawal rate), and adjust for inflation. Our Retirement Mapper calculator can help you work out your specific target based on your lifestyle and goals.",
      },
    ],
  },
];

const InfoSection = () => {
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, number | null>>({});
  const [showTips, setShowTips] = useState<Record<string, boolean>>({});

  const toggleFaq = (sectionId: string, faqIndex: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [sectionId]: prev[sectionId] === faqIndex ? null : faqIndex
    }));
  };

  const toggleTips = (sectionId: string) => {
    setShowTips(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <section id="knowledge" className="py-12 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Lightbulb className="h-3.5 w-3.5" />
            Learn & Grow
          </span>
          <h2 className="mb-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Money Knowledge That Matters
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Practical financial insights written for real people, not finance textbooks. 
            Tap any section to explore.
          </p>
        </div>

        {/* Info Cards - Grid Layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`rounded-xl border border-border bg-gradient-to-br ${section.color} p-4 md:p-5 animate-fade-up transition-all hover:shadow-md`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="mb-4 flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.iconBg} transition-transform hover:scale-105`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base md:text-lg font-bold text-foreground mb-1">
                    {section.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                </div>
              </div>

              {/* Main Content */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                {section.content}
              </p>

              {/* Interactive Tips Toggle */}
              <button
                onClick={() => toggleTips(section.id)}
                className={`mb-4 flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${section.iconBg} hover:opacity-80`}
              >
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{showTips[section.id] ? "Hide Tips" : "Show Tips"}</span>
                </div>
                {showTips[section.id] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {/* Tips List */}
              {showTips[section.id] && (
                <ul className="mb-4 space-y-1.5 rounded-lg bg-card/50 p-3 animate-fade-in">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[10px] font-bold text-accent">
                        {tipIndex + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* FAQ Section */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground mb-2">FAQs</p>
                {section.faqs.map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className="rounded-lg bg-card/50 border border-border/50 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(section.id, faqIndex)}
                      className="flex w-full items-start justify-between gap-2 p-2.5 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-foreground text-xs pr-2 leading-relaxed">{faq.question}</span>
                      {expandedFaqs[section.id] === faqIndex ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                    </button>
                    {expandedFaqs[section.id] === faqIndex && (
                      <div className="px-2.5 pb-2.5 text-xs text-muted-foreground leading-relaxed animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
