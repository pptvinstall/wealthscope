"use strict";

/*
 * 2026 federal planning data.
 * Source: IRS Revenue Procedure 2025-32.
 * This calculator intentionally models only the listed provisions and is not
 * a substitute for a complete tax return.
 */
window.WEALTHSCOPE_FEDERAL_2026 = {
  taxYear: 2026,
  sourceUrl: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
  filingStatuses: {
    single: {
      name: "Single",
      standardDeduction: 16100,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 12400, rate: 0.10 },
        { minimum: 12400, maximum: 50400, rate: 0.12 },
        { minimum: 50400, maximum: 105700, rate: 0.22 },
        { minimum: 105700, maximum: 201775, rate: 0.24 },
        { minimum: 201775, maximum: 256225, rate: 0.32 },
        { minimum: 256225, maximum: 640600, rate: 0.35 },
        { minimum: 640600, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 49450, rate: 0 },
        { minimum: 49450, maximum: 545500, rate: 0.15 },
        { minimum: 545500, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 200000
    },
    marriedJoint: {
      name: "Married Filing Jointly",
      standardDeduction: 32200,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 24800, rate: 0.10 },
        { minimum: 24800, maximum: 100800, rate: 0.12 },
        { minimum: 100800, maximum: 211400, rate: 0.22 },
        { minimum: 211400, maximum: 403550, rate: 0.24 },
        { minimum: 403550, maximum: 512450, rate: 0.32 },
        { minimum: 512450, maximum: 768700, rate: 0.35 },
        { minimum: 768700, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 98900, rate: 0 },
        { minimum: 98900, maximum: 613700, rate: 0.15 },
        { minimum: 613700, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 250000
    },
    marriedSeparate: {
      name: "Married Filing Separately",
      standardDeduction: 16100,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 12400, rate: 0.10 },
        { minimum: 12400, maximum: 50400, rate: 0.12 },
        { minimum: 50400, maximum: 105700, rate: 0.22 },
        { minimum: 105700, maximum: 201775, rate: 0.24 },
        { minimum: 201775, maximum: 256225, rate: 0.32 },
        { minimum: 256225, maximum: 384350, rate: 0.35 },
        { minimum: 384350, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 49450, rate: 0 },
        { minimum: 49450, maximum: 306850, rate: 0.15 },
        { minimum: 306850, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 125000
    },
    headOfHousehold: {
      name: "Head of Household",
      standardDeduction: 24150,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 17700, rate: 0.10 },
        { minimum: 17700, maximum: 67450, rate: 0.12 },
        { minimum: 67450, maximum: 105700, rate: 0.22 },
        { minimum: 105700, maximum: 201750, rate: 0.24 },
        { minimum: 201750, maximum: 256200, rate: 0.32 },
        { minimum: 256200, maximum: 640600, rate: 0.35 },
        { minimum: 640600, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 66200, rate: 0 },
        { minimum: 66200, maximum: 579600, rate: 0.15 },
        { minimum: 579600, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 200000
    }
  },
  netInvestmentIncomeTax: {
    rate: 0.038,
    name: "Net Investment Income Tax (NIIT)"
  }
};
