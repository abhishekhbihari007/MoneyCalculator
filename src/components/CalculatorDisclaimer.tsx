"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CalculatorDisclaimerProps {
  calculatorType?: 'tax' | 'investment' | 'retirement' | 'insurance' | 'general';
  showRegulatory?: boolean;
}

export default function CalculatorDisclaimer({ 
  calculatorType = 'general',
  showRegulatory = false 
}: CalculatorDisclaimerProps) {
  const getDisclaimerText = () => {
    switch (calculatorType) {
      case 'tax':
        return "This calculator provides estimates for planning purposes only. It does not constitute professional tax advice. For official tax filing and complex tax planning, please consult a qualified Chartered Accountant.";
      
      case 'investment':
        return "This calculator provides estimates for planning purposes only. Returns are subject to market risks. Past performance does not guarantee future results. Please read all scheme-related documents carefully. Consult a SEBI-registered investment advisor before making investment decisions.";
      
      case 'retirement':
        return "This calculator provides estimates for planning purposes only. It does not constitute professional financial planning advice. For comprehensive retirement planning, please consult a certified financial planner.";
      
      case 'insurance':
        return "This calculator provides estimates for planning purposes only. It does not constitute insurance advice. Please consult a licensed insurance advisor for personalized coverage recommendations.";
      
      default:
        return "This calculator provides estimates for planning purposes only. It does not constitute professional financial, tax, or legal advice. Always consult with qualified professionals before making financial decisions.";
    }
  };

  const getRegulatoryDisclaimer = () => {
    if (!showRegulatory) return null;
    
    return (
      <div className="mt-2 text-xs text-muted-foreground">
        <strong>Regulatory Disclaimers:</strong>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Mutual Funds: Subject to market risks. Read all scheme-related documents carefully. (SEBI Registered)</li>
          <li>Fixed Deposits: Interest rates are indicative. Actual rates may vary by bank. Deposit insurance coverage up to ₹5 lakhs per depositor per bank. (RBI Regulated)</li>
          <li>NPS: Returns are market-linked and not guaranteed. PFRDA registered.</li>
        </ul>
      </div>
    );
  };

  return (
    <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-sm font-semibold text-amber-900 dark:text-amber-100">
        Important Disclaimer
      </AlertTitle>
      <AlertDescription className="text-xs text-amber-800 dark:text-amber-200 mt-1">
        {getDisclaimerText()}
        {getRegulatoryDisclaimer()}
      </AlertDescription>
    </Alert>
  );
}

