"use strict";

/*
WealthScope
Federal tax data for tax year 2026.

This file contains data only.
The calculation functions will live in app.js.

Important:

* These amounts apply to tax year 2026.
* Returns for tax year 2026 are generally filed in 2027.
* This model does not replace a complete federal tax return.
  */

window.WEALTHSCOPE_FEDERAL_2026 = Object.freeze({

taxYear: 2026,

filingStatuses: Object.freeze({

```
single: Object.freeze({

  id: "single",

  name: "Single",

  standardDeduction: 16100,

  ordinaryIncomeBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 12400,
      rate: 0.10
    }),

    Object.freeze({
      minimum: 12400,
      maximum: 50400,
      rate: 0.12
    }),

    Object.freeze({
      minimum: 50400,
      maximum: 105700,
      rate: 0.22
    }),

    Object.freeze({
      minimum: 105700,
      maximum: 201775,
      rate: 0.24
    }),

    Object.freeze({
      minimum: 201775,
      maximum: 256225,
      rate: 0.32
    }),

    Object.freeze({
      minimum: 256225,
      maximum: 640600,
      rate: 0.35
    }),

    Object.freeze({
      minimum: 640600,
      maximum: null,
      rate: 0.37
    })

  ]),

  longTermCapitalGainBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 49450,
      rate: 0
    }),

    Object.freeze({
      minimum: 49450,
      maximum: 545500,
      rate: 0.15
    }),

    Object.freeze({
      minimum: 545500,
      maximum: null,
      rate: 0.20
    })

  ]),

  netInvestmentIncomeTaxThreshold: 200000

}),

marriedJoint: Object.freeze({

  id: "marriedJoint",

  name: "Married filing jointly",

  standardDeduction: 32200,

  ordinaryIncomeBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 24800,
      rate: 0.10
    }),

    Object.freeze({
      minimum: 24800,
      maximum: 100800,
      rate: 0.12
    }),

    Object.freeze({
      minimum: 100800,
      maximum: 211400,
      rate: 0.22
    }),

    Object.freeze({
      minimum: 211400,
      maximum: 403550,
      rate: 0.24
    }),

    Object.freeze({
      minimum: 403550,
      maximum: 512450,
      rate: 0.32
    }),

    Object.freeze({
      minimum: 512450,
      maximum: 768700,
      rate: 0.35
    }),

    Object.freeze({
      minimum: 768700,
      maximum: null,
      rate: 0.37
    })

  ]),

  longTermCapitalGainBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 98900,
      rate: 0
    }),

    Object.freeze({
      minimum: 98900,
      maximum: 613700,
      rate: 0.15
    }),

    Object.freeze({
      minimum: 613700,
      maximum: null,
      rate: 0.20
    })

  ]),

  netInvestmentIncomeTaxThreshold: 250000

}),

marriedSeparate: Object.freeze({

  id: "marriedSeparate",

  name: "Married filing separately",

  standardDeduction: 16100,

  ordinaryIncomeBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 12400,
      rate: 0.10
    }),

    Object.freeze({
      minimum: 12400,
      maximum: 50400,
      rate: 0.12
    }),

    Object.freeze({
      minimum: 50400,
      maximum: 105700,
      rate: 0.22
    }),

    Object.freeze({
      minimum: 105700,
      maximum: 201775,
      rate: 0.24
    }),

    Object.freeze({
      minimum: 201775,
      maximum: 256225,
      rate: 0.32
    }),

    Object.freeze({
      minimum: 256225,
      maximum: 384350,
      rate: 0.35
    }),

    Object.freeze({
      minimum: 384350,
      maximum: null,
      rate: 0.37
    })

  ]),

  longTermCapitalGainBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 49450,
      rate: 0
    }),

    Object.freeze({
      minimum: 49450,
      maximum: 306850,
      rate: 0.15
    }),

    Object.freeze({
      minimum: 306850,
      maximum: null,
      rate: 0.20
    })

  ]),

  netInvestmentIncomeTaxThreshold: 125000

}),

headOfHousehold: Object.freeze({

  id: "headOfHousehold",

  name: "Head of household",

  standardDeduction: 24150,

  ordinaryIncomeBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 17700,
      rate: 0.10
    }),

    Object.freeze({
      minimum: 17700,
      maximum: 67450,
      rate: 0.12
    }),

    Object.freeze({
      minimum: 67450,
      maximum: 107000,
      rate: 0.22
    }),

    Object.freeze({
      minimum: 107000,
      maximum: 204050,
      rate: 0.24
    }),

    Object.freeze({
      minimum: 204050,
      maximum: 256200,
      rate: 0.32
    }),

    Object.freeze({
      minimum: 256200,
      maximum: 640600,
      rate: 0.35
    }),

    Object.freeze({
      minimum: 640600,
      maximum: null,
      rate: 0.37
    })

  ]),

  longTermCapitalGainBrackets: Object.freeze([

    Object.freeze({
      minimum: 0,
      maximum: 66200,
      rate: 0
    }),

    Object.freeze({
      minimum: 66200,
      maximum: 579600,
      rate: 0.15
    }),

    Object.freeze({
      minimum: 579600,
      maximum: null,
      rate: 0.20
    })

  ]),

  netInvestmentIncomeTaxThreshold: 200000

})
```

}),

netInvestmentIncomeTax: Object.freeze({

```
rate: 0.038,

description:
  "The Net Investment Income Tax may apply to certain net investment income when modified adjusted gross income exceeds the applicable filing-status threshold."
```

}),

specialRates: Object.freeze({

```
qualifiedDividendRates: Object.freeze([
  0,
  0.15,
  0.20
]),

shortTermCapitalGainTreatment:
  "ordinaryIncome",

maximumCollectiblesGainRate: 0.28,

maximumUnrecapturedSection1250Rate: 0.25
```

}),

incomeClassifications: Object.freeze({

```
ordinaryIncome: Object.freeze({

  id: "ordinaryIncome",

  displayName: "Ordinary income",

  federalTreatment: "ordinaryIncome",

  description:
    "Generally modeled using the progressive federal ordinary-income brackets."

}),

shortTermCapitalGain: Object.freeze({

  id: "shortTermCapitalGain",

  displayName: "Short-term capital gain",

  federalTreatment: "ordinaryIncome",

  description:
    "Generally treated as ordinary income for federal tax purposes."

}),

longTermCapitalGain: Object.freeze({

  id: "longTermCapitalGain",

  displayName: "Long-term capital gain",

  federalTreatment: "longTermCapitalGain",

  description:
    "Generally modeled using the federal 0%, 15%, and 20% long-term capital-gain brackets."

}),

qualifiedDividend: Object.freeze({

  id: "qualifiedDividend",

  displayName: "Qualified dividend",

  federalTreatment: "longTermCapitalGain",

  description:
    "Generally modeled using preferential long-term capital-gain tax rates when qualification requirements are met."

}),

ordinaryDividend: Object.freeze({

  id: "ordinaryDividend",

  displayName: "Ordinary dividend",

  federalTreatment: "ordinaryIncome",

  description:
    "Generally modeled as ordinary federal taxable income."

}),

taxableInterest: Object.freeze({

  id: "taxableInterest",

  displayName: "Taxable interest",

  federalTreatment: "ordinaryIncome",

  description:
    "Generally modeled as ordinary federal taxable income."

}),

municipalInterest: Object.freeze({

  id: "municipalInterest",

  displayName: "Municipal-bond interest",

  federalTreatment: "federalExempt",

  description:
    "Modeled as federally exempt interest, although state and alternative-minimum-tax treatment can vary."

}),

treasuryInterest: Object.freeze({

  id: "treasuryInterest",

  displayName: "U.S. Treasury interest",

  federalTreatment: "ordinaryIncome",

  stateTreatment: "stateExempt",

  description:
    "Generally federally taxable but exempt from state and local income taxation."

}),

reitDistribution: Object.freeze({

  id: "reitDistribution",

  displayName: "REIT distribution",

  federalTreatment: "ordinaryIncome",

  description:
    "Modeled primarily as ordinary income. Actual REIT distributions may contain multiple tax components."

}),

rothQualifiedDistribution: Object.freeze({

  id: "rothQualifiedDistribution",

  displayName: "Qualified Roth distribution",

  federalTreatment: "taxFree",

  description:
    "Modeled as federally tax-free when qualified-distribution requirements are met."

})
```

}),

assumptions: Object.freeze({

```
bracketsApplyToTaxableIncome: true,

shortTermCapitalGainsUseOrdinaryBrackets: true,

qualifiedDividendsUseCapitalGainBrackets: true,

capitalGainBracketsStackAboveOrdinaryIncome: true,

niitUsesModifiedAdjustedGrossIncome: true,

standardDeductionAutomaticallyApplied:
  "The application engine may use the standard deduction unless the user selects itemized or no deduction."
```

}),

sourceMetadata: Object.freeze({

```
datasetName:
  "WealthScope Federal Tax Dataset",

taxYear: 2026,

lastReviewed:
  "2026-06-15",

filingYear:
  2027,

status:
  "Planning estimate",

notes: Object.freeze([

  "The dataset models core federal ordinary-income brackets, standard deductions, long-term capital-gain brackets, and NIIT thresholds.",

  "It does not fully model every deduction, credit, phaseout, exemption, alternative minimum tax rule, business-tax rule, retirement exception, penalty, or special capital-gain category.",

  "Tax laws and official guidance can change. Verify important decisions with current IRS guidance and a qualified tax professional."

])
```

})

});

/*
Basic validation
----------------

This runs when the file loads. If the data is incomplete,
app.js will receive a visible console error instead of silently
calculating with malformed tax brackets.
*/

(function validateFederalDataset() {

const dataset =
window.WEALTHSCOPE_FEDERAL_2026;

if (!dataset) {

```
throw new Error(
  "Federal 2026 dataset failed to initialize."
);
```

}

const requiredStatuses = [
"single",
"marriedJoint",
"marriedSeparate",
"headOfHousehold"
];

for (
const statusId
of requiredStatuses
) {

```
const status =
  dataset.filingStatuses[statusId];

if (!status) {

  throw new Error(
    `Missing federal filing status: ${statusId}`
  );

}

if (
  !Number.isFinite(
    status.standardDeduction
  )
) {

  throw new Error(
    `Invalid standard deduction for ${statusId}`
  );

}

if (
  !Array.isArray(
    status.ordinaryIncomeBrackets
  )
  ||
  status.ordinaryIncomeBrackets.length !== 7
) {

  throw new Error(
    `Invalid ordinary-income brackets for ${statusId}`
  );

}

if (
  !Array.isArray(
    status.longTermCapitalGainBrackets
  )
  ||
  status.longTermCapitalGainBrackets.length !== 3
) {

  throw new Error(
    `Invalid capital-gain brackets for ${statusId}`
  );

}
```

}

console.info(
"WealthScope federal 2026 tax data loaded successfully."
);

})();
