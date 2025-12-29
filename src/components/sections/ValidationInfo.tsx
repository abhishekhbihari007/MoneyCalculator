"use client";

import { Shield, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Public-facing validation information component
 * Can be used on calculator pages or FAQ sections
 */
export default function ValidationInfo() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">How We Validate Calculations</CardTitle>
        </div>
        <CardDescription>
          Ensuring accuracy, transparency, and compliance with Indian financial regulations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            How are inputs validated?
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All our calculators use strict validation rules based on Indian tax laws, statutory financial limits, and logical constraints.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Inputs that violate legal or logical limits are blocked immediately</p>
              <p className="text-xs text-muted-foreground mt-1">No calculation proceeds with invalid data</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Calculations never run on invalid data</p>
              <p className="text-xs text-muted-foreground mt-1">Results are cleared if validation fails</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">No values are auto-corrected silently</p>
              <p className="text-xs text-muted-foreground mt-1">You&apos;ll always see clear error messages explaining what needs to be fixed</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Clear error messages explain what needs to be fixed</p>
              <p className="text-xs text-muted-foreground mt-1">All errors reference specific laws and regulations</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">This ensures results are accurate, transparent, and compliant with Indian financial regulations.</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

