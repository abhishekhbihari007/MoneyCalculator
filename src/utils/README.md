# Indian Financial Calculator Utilities - Architecture Guide

**Project Created**: December 2025  
**Project Type**: Client Project

## 📁 File Structure

```
src/utils/
├── tax-constants.ts          # ⭐ Source of Truth - ALL magic numbers here
├── taxCalculator.ts           # Income Tax calculations (Old & New Regime)
├── salaryCalculator.ts        # In-Hand Salary & Offer Comparison
├── retirementCalculator.ts    # EPF, Gratuity, NPS, Retirement Planning
├── investmentCalculator.ts    # SIP, RD, FD, Salary Growth
└── __tests__/
    └── verification.test.ts   # Comprehensive unit tests for edge cases
```

### Root Level Test Configuration

```
root/
├── jest.config.js            # Jest configuration for Next.js
├── jest.setup.js              # Test setup (mocks, jest-dom imports)
└── jest.d.ts                  # TypeScript declarations for jest-dom matchers
```

## 🎯 Source of Truth: `tax-constants.ts`

**This is the ONLY file you need to update when Budget changes are announced.**

### What's Inside:

1. **Tax Regime Constants**
   - Standard Deduction (Old: ₹50k, New: ₹75k)
   - Cess Rate (4%)
   - Rebate Thresholds (Old: ₹5L, New: ₹7L)
   - Tax Slabs (New & Old Regime, age-based)

2. **Deduction Limits**
   - Section 80C (₹1.5L)
   - Section 80D (₹25k/₹50k)
   - Section 80CCD(1B) (₹50k)
   - Section 24(b) - Home Loan Interest (₹2L)

3. **EPF Constants**
   - Interest Rate (8.25% for FY 2024-25, pending FY 2025-26 announcement)
   - Contribution Percentages (12% employee, 12% employer)
   - Wage Ceiling (₹15,000)
   - Tax Threshold (₹2.5L annual contribution)

4. **Gratuity Constants**
   - Formula Multiplier (15)
   - Divisor (26)
   - Tax Exemption Limits (Govt: ₹25L, Private: ₹20L)

5. **NPS Constants**
   - Default Return Rate (10%)
   - Withdrawal Percentages (60% lump sum, 40% annuity)
   - Employer Contribution Limits (Budget 2024 Update: 14% New Regime, 10% Old Regime for Private Sector)

6. **Retirement Planning Defaults**
   - Life Expectancy (85)
   - Default Inflation (6%)
   - Safe Withdrawal Rate (4%)

7. **Investment & TDS**
   - TDS Thresholds (General: ₹40k, Senior: ₹50k)
   - TDS Rate (10%)

## 🔄 How to Update Constants (Annual Budget Update)

### Step 1: Update `tax-constants.ts`

When the Budget is announced (typically February/July):

```typescript
// Example: If Standard Deduction changes to ₹80k in New Regime
export const STANDARD_DEDUCTION_NEW = 80000; // Updated from 75000

// Example: If EPF Interest Rate changes to 8.5%
export const EPF_INTEREST_RATE = 0.085; // Updated from 0.0825
```

### Step 2: Run Tests

```bash
npm test
```

All tests should pass. If any fail, check:
- Did the formula change? (Update calculation logic, not just constants)
- Are the new limits correct? (Verify against official notifications)

### Step 3: Update Test Cases (if needed)

If new edge cases emerge, add them to `verification.test.ts`:

```typescript
test('New Budget Rule: Income = ₹X -> Tax should be ₹Y', () => {
  // Test new rule
});
```

## 🧪 Testing Strategy

### Critical Edge Cases Tested:

1. **The "7 Lakh" Cliff**
   - Income = ₹7,00,000 → Tax = ₹0 (Rebate applies)
   - Income = ₹7,00,100 → Tax ≈ ₹100 (Marginal Relief)

2. **The "Surcharge" Trap**
   - Income = ₹51,00,000 → Verify 10% surcharge applied
   - Verify Marginal Relief doesn't exceed income above threshold

3. **The "Gratuity" Split**
   - Private Employee, Gratuity = ₹22L → Tax-Free capped at ₹20L (not ₹25L)
   - Government Employee, Gratuity = ₹27L → Tax-Free capped at ₹25L

4. **Section 87A Rebate**
   - Old Regime: Taxable ≤ ₹5L → Tax = ₹0
   - New Regime: Taxable ≤ ₹7L → Tax = ₹0

5. **NPS Budget 2024 Update (Effective 2025)**
   - New Regime: Private Sector = 14% (matching Central Govt)
   - Old Regime: Private Sector = 10%

## 🚨 Important Notes

### DO NOT:
- ❌ Hardcode values in calculator files
- ❌ Update constants in multiple places
- ❌ Skip tests after updating constants

### DO:
- ✅ Update only `tax-constants.ts`
- ✅ Run tests after every change
- ✅ Document changes with comments
- ✅ Add test cases for new edge cases

## 📊 Visualization Recommendations

Once logic is solid, consider adding charts:

1. **In-Hand Salary**: Stacked Bar Chart
   - Breakdown: Take Home, Income Tax, PF/Deductions

2. **Tax Regime Comparison**: Grouped Bar Chart
   - Old Regime Tax vs New Regime Tax side-by-side

3. **SIP/Wealth Growth**: Stacked Area Chart
   - Total Invested vs Wealth Gained over time (Power of Compounding)

## 🔍 Finding Hardcoded Values

If you suspect hardcoded values exist:

```bash
# Search for common patterns
grep -r "0\.0825\|75000\|50000\|150000" src/utils/
```

All values should reference `tax-constants.ts`.

## 🔧 Recent Updates & Fixes (2025)

### TypeScript & Build Fixes (December 2025)

1. **Jest TypeScript Support**
   - Created `jest.d.ts` for proper type declarations for jest-dom matchers (`toBeInTheDocument`, etc.)
   - Fixed TypeScript errors in test files

2. **Interface Updates**
   - Updated `TaxSlab` interface: Made `tax` property optional (calculated dynamically)
   - Updated `NPSResult` interface: Added `earlyExitLumpSum`, `earlyExitAnnuity`, `maxPartialWithdrawal`, `isEarlyExit`, and `ownContributionTotal` properties
   - Added `NPS_80CCD1B_LIMIT` export alias in `tax-constants.ts`

3. **ESLint Fixes**
   - Fixed all unescaped entity errors (apostrophes and quotes) across all component files
   - Replaced `'` with `&apos;` and `"` with `&quot;` in JSX content

4. **Build Configuration**
   - Fixed sitemap.ts TypeScript errors for `changeFrequency` property
   - Removed duplicate `AgeCategory` type definition
   - Fixed offer-analyzer undefined `setTaxRegime` reference

5. **Build Status**
   - ✅ Production build successful (33 pages generated)
   - ✅ All TypeScript compilation errors resolved
   - ✅ All ESLint errors resolved

## 📝 Maintenance Checklist

When Budget is announced:

- [ ] Update `tax-constants.ts` with new values
- [ ] Update comments with Budget year (e.g., "FY 2025-26")
- [ ] Run `npm test` to verify all tests pass
- [ ] Run `npm run build` to verify production build succeeds
- [ ] Add new test cases for any new rules
- [ ] Update this README if structure changes
- [ ] Document any formula changes (not just constant changes)

### Testing & Build Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start
```

---

**Last Updated**: December 2025 (Build Fixes & TypeScript Updates)
**Budget Version**: July 2024 Budget (FY 2024-25)
**Next Review**: February 2026 Budget (FY 2026-27)

