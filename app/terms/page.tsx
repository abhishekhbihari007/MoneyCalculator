import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service - ManageYourSalary",
  description: "Terms of Service for ManageYourSalary. Read our terms and conditions.",
};

export default function TermsPage() {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using ManageYourSalary, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to these terms, please do not use 
                  our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  ManageYourSalary provides free financial calculators for informational and planning purposes. 
                  You agree to use our services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Only for lawful purposes</li>
                  <li>In accordance with these Terms of Service</li>
                  <li>Not to misuse or abuse our services</li>
                  <li>Not to attempt to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our calculators are provided &quot;as is&quot; without warranties of any kind, either express or 
                  implied. While we strive for accuracy, we make no representations or warranties regarding:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                  <li>The accuracy, completeness, or reliability of calculations</li>
                  <li>The suitability of results for your specific financial situation</li>
                  <li>Uninterrupted or error-free operation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ManageYourSalary shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of or inability to use our calculators. Our 
                  calculators are for planning purposes only and should not be considered as professional 
                  financial or tax advice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Not Professional Advice</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important:</strong> Our calculators provide estimates 
                  and should be used for planning purposes only. They do not constitute:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                  <li>Professional tax advice</li>
                  <li>Financial planning advice</li>
                  <li>Legal advice</li>
                  <li>Investment recommendations</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  For official tax filing, complex financial planning, or legal matters, please consult a 
                  qualified Chartered Accountant, Financial Advisor, or Legal Professional.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Accuracy of Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We make every effort to ensure our calculators are based on the latest tax laws and financial 
                  regulations. However, tax laws and regulations change frequently. We update our calculators 
                  regularly, but we cannot guarantee they always reflect the most current rules. Always verify 
                  calculations with official sources or professionals.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, calculators, and materials on ManageYourSalary are protected by copyright and 
                  other intellectual property laws. You may use our calculators for personal, non-commercial 
                  purposes only. You may not reproduce, distribute, or create derivative works without our 
                  written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Modifications to Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any part of our service at any time 
                  without notice. We are not liable to you or any third party for any modification, suspension, 
                  or discontinuance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of India. 
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction of 
                  the courts in India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to update these Terms of Service at any time. We&apos;ll notify you of 
                  significant changes by posting the updated terms on this page. Your continued use of our 
                  services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through our 
                  <Link href="/contact" className="text-primary hover:underline"> contact page</Link>.
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

