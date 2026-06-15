/**
 * Federal Tax Data for 2026
 * Contains tax brackets, deductions, and thresholds for all filing statuses
 */

window.WEALTHSCOPE_FEDERAL_2026 = {
  taxYear: 2026,
  
  filingStatuses: {
    single: {
      name: "Single",
      standardDeduction: 15000,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 11600, rate: 0.10 },
        { minimum: 11600, maximum: 47150, rate: 0.12 },
        { minimum: 47150, maximum: 100525, rate: 0.22 },
        { minimum: 100525, maximum: 191950, rate: 0.24 },
        { minimum: 191950, maximum: 243725, rate: 0.32 },
        { minimum: 243725, maximum: 609350, rate: 0.35 },
        { minimum: 609350, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 47025, rate: 0.00 },
        { minimum: 47025, maximum: 518900, rate: 0.15 },
        { minimum: 518900, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 200000
    },
    marriedJoint: {
      name: "Married Filing Jointly",
      standardDeduction: 30000,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 23200, rate: 0.10 },
        { minimum: 23200, maximum: 94300, rate: 0.12 },
        { minimum: 94300, maximum: 201050, rate: 0.22 },
        { minimum: 201050, maximum: 383900, rate: 0.24 },
        { minimum: 383900, maximum: 487450, rate: 0.32 },
        { minimum: 487450, maximum: 731200, rate: 0.35 },
        { minimum: 731200, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 94050, rate: 0.00 },
        { minimum: 94050, maximum: 583750, rate: 0.15 },
        { minimum: 583750, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 250000
    },
    marriedSeparate: {
      name: "Married Filing Separately",
      standardDeduction: 15000,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 11600, rate: 0.10 },
        { minimum: 11600, maximum: 47150, rate: 0.12 },
        { minimum: 47150, maximum: 100525, rate: 0.22 },
        { minimum: 100525, maximum: 191950, rate: 0.24 },
        { minimum: 191950, maximum: 243725, rate: 0.32 },
        { minimum: 243725, maximum: 365600, rate: 0.35 },
        { minimum: 365600, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 47025, rate: 0.00 },
        { minimum: 47025, maximum: 291875, rate: 0.15 },
        { minimum: 291875, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 125000
    },
    headOfHousehold: {
      name: "Head of Household",
      standardDeduction: 22500,
      ordinaryIncomeBrackets: [
        { minimum: 0, maximum: 16550, rate: 0.10 },
        { minimum: 16550, maximum: 63100, rate: 0.12 },
        { minimum: 63100, maximum: 100500, rate: 0.22 },
        { minimum: 100500, maximum: 191950, rate: 0.24 },
        { minimum: 191950, maximum: 243700, rate: 0.32 },
        { minimum: 243700, maximum: 609350, rate: 0.35 },
        { minimum: 609350, maximum: null, rate: 0.37 }
      ],
      longTermCapitalGainBrackets: [
        { minimum: 0, maximum: 63000, rate: 0.00 },
        { minimum: 63000, maximum: 551350, rate: 0.15 },
        { minimum: 551350, maximum: null, rate: 0.20 }
      ],
      netInvestmentIncomeTaxThreshold: 200000
    }
  },

  netInvestmentIncomeTax: {
    rate: 0.038,
    name: "Net Investment Income Tax (NIIT)"
  },

  deductions: {
    qualifyingDividends: {
      description: "Qualified dividend income",
      taxTreatment: "capital_gains"
    }
  },

  credits: {
    childTaxCredit: 2000,
    earnedIncomeCredit: true,
    dependentCredit: 500
  },

  alternativeMinimumTax: {
    enabled: true,
    exemption: {
      single: 87900,
      marriedJoint: 137450,
      marriedSeparate: 68725
    },
    rate: 0.26
  }
};