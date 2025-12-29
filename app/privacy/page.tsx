import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy - ManageYourSalary",
  description: "Privacy Policy for ManageYourSalary. Learn how we protect your data and privacy.",
};

export default function PrivacyPage() {
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
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At ManageYourSalary, we take your privacy seriously. This Privacy Policy explains how we handle 
                  your information when you use our website and calculators.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Information We Don&apos;t Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong className="text-foreground">We don&apos;t collect any personal or financial information.</strong> 
                  This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>No registration or account creation required</li>
                  <li>No email addresses or contact information</li>
                  <li>No salary, tax, or financial data stored</li>
                  <li>No cookies for tracking personal information</li>
                  <li>No third-party data sharing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How Our Calculators Work</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All calculations happen locally in your browser. When you enter data into our calculators:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                  <li>Data is processed in your browser only</li>
                  <li>Nothing is sent to our servers</li>
                  <li>No data is stored on our systems</li>
                  <li>Your information never leaves your device</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Analytics & Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Currently, we do not use any analytics or tracking cookies. All calculations happen locally 
                  in your browser without any data transmission. If we implement analytics in the future, we will 
                  update this policy and provide a cookie consent mechanism.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website is hosted on third-party hosting services. These services may collect anonymous 
                  technical data (like IP addresses for security purposes) but do not have access to your personal 
                  or financial information entered into our calculators. All calculator data remains in your browser.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Since we don&apos;t collect or store your data, there&apos;s nothing to secure. Your financial 
                  information never reaches our servers, ensuring maximum privacy and security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are intended for adults. We don&apos;t knowingly collect information from children 
                  under 18 years of age.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We&apos;ll notify you of any changes by 
                  posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our 
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

