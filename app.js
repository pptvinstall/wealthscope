"use strict";

/*
WealthScope Application Engine
------------------------------

This file connects:

* index.html
* styles.css
* data/federal-2026.js
* data/states.js
* data/assets.js

Major responsibilities:

1. Read and validate user inputs
2. Estimate federal and state taxes
3. Build and edit the asset allocation
4. Estimate gross and net income by allocation
5. Project portfolio growth month by month
6. Track contributions, fees, tax drag, and cost basis
7. Compare return scenarios
8. Model withdrawals and installment payments
9. Render tables and Chart.js visualizations
10. Save and load scenarios locally
11. Export annual schedules as CSV
    */

/* =========================================================
GLOBAL APPLICATION STATE
========================================================= */

const WealthScopeApp = {

mode: "simple",

allocationRows: [],

latestCalculation: null,

latestSchedule: [],

charts: {
overview: null,
allocation: null,
income: null,
scenario: null,
annuity: null
},

colors: [
"#65E4B1",
"#79AAFF",
"#FFCA70",
"#B295FF",
"#65D8EF",
"#FF8293",
"#92D36E",
"#FFB36D",
"#5F91F5",
"#F091C7",
"#8FA7B8",
"#CD765C"
]

};

/* =========================================================
DATASET REFERENCES
========================================================= */

const FederalData =
window.WEALTHSCOPE_FEDERAL_2026;

const StateData =
window.WEALTHSCOPE_STATES_2026;

const StateHelpers =
window.WEALTHSCOPE_STATE_HELPERS;

const AssetData =
window.WEALTHSCOPE_ASSETS;

const AssetHelpers =
window.WEALTHSCOPE_ASSET_HELPERS;

/* =========================================================
DOM HELPERS
========================================================= */

function getElement(id) {

return document.getElementById(id);

}

function getNumber(id, fallback = 0) {

const element =
getElement(id);

if (!element) {
return fallback;
}

const value =
Number(element.value);

return Number.isFinite(value)
? value
: fallback;

}

function getString(id, fallback = "") {

const element =
getElement(id);

if (!element) {
return fallback;
}

return String(
element.value ?? fallback
);

}

function setText(id, value) {

const element =
getElement(id);

if (element) {
element.textContent = value;
}

}

function clamp(
value,
minimum,
maximum
) {

return Math.min(
maximum,
Math.max(
minimum,
value
)
);

}

function roundCurrency(value) {

if (!Number.isFinite(value)) {
return 0;
}

return Math.round(value);

}

function formatCurrency(
value,
maximumFractionDigits = 0
) {

const safeValue =
Number.isFinite(value)
? value
: 0;

return new Intl.NumberFormat(
"en-US",
{
style: "currency",
currency: "USD",
maximumFractionDigits
}
).format(safeValue);

}

function formatPercent(
decimalValue,
fractionDigits = 1
) {

const safeValue =
Number.isFinite(decimalValue)
? decimalValue
: 0;

return new Intl.NumberFormat(
"en-US",
{
style: "percent",
minimumFractionDigits: fractionDigits,
maximumFractionDigits: fractionDigits
}
).format(safeValue);

}

function formatCompactCurrency(value) {

const safeValue =
Number.isFinite(value)
? value
: 0;

return new Intl.NumberFormat(
"en-US",
{
style: "currency",
currency: "USD",
notation: "compact",
maximumFractionDigits: 1
}
).format(safeValue);

}

function escapeHtml(value) {

return String(value)
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """)
.replaceAll("'", "'");

}

/* =========================================================
STATUS AND ERROR HANDLING
========================================================= */

function showStatus(
message,
type = "info"
) {

const banner =
getElement("appStatus");

const text =
getElement("appStatusText");

if (!banner || !text) {
return;
}

text.textContent = message;

banner.hidden = false;

banner.classList.remove(
"is-error",
"is-success"
);

if (type === "error") {
banner.classList.add("is-error");
}

if (type === "success") {
banner.classList.add("is-success");
}

}

function hideStatus() {

const banner =
getElement("appStatus");

if (banner) {
banner.hidden = true;
}

}

function handleApplicationError(error) {

console.error(
"WealthScope calculation error:",
error
);

showStatus(
`Calculator error: ${error.message}`,
"error"
);

}

/* =========================================================
DATASET VALIDATION
========================================================= */

function validateDatasets() {

const missing = [];

if (!FederalData) {
missing.push(
"Federal tax dataset"
);
}

if (!StateData) {
missing.push(
"State tax dataset"
);
}

if (!StateHelpers) {
missing.push(
"State helper functions"
);
}

if (!AssetData) {
missing.push(
"Asset dataset"
);
}

if (!AssetHelpers) {
missing.push(
"Asset helper functions"
);
}

if (missing.length > 0) {

```
throw new Error(
  `Missing required data: ${missing.join(", ")}`
);
```

}

}

/* =========================================================
FORM INPUT COLLECTION
========================================================= */

function collectInputs() {

const deductionMethod =
getString(
"deductionMethod",
"standard"
);

const itemizedDeduction =
Math.max(
0,
getNumber(
"itemizedDeduction",
0
)
);

const stateOverrideElement =
getElement(
"stateRateOverride"
);

const stateRateOverride =
stateOverrideElement
&&
stateOverrideElement.value !== ""
? Math.max(
0,
Number(
stateOverrideElement.value
)
||
0
)
/
100
: null;

return {

```
startingAmount:
  Math.max(
    0,
    getNumber(
      "startingAmount",
      500000
    )
  ),

moneySource:
  getString(
    "moneySource",
    "afterTaxCash"
  ),

filingStatus:
  getString(
    "filingStatus",
    "single"
  ),

stateCode:
  getString(
    "stateCode",
    "GA"
  ),

otherIncome:
  Math.max(
    0,
    getNumber(
      "otherIncome",
      0
    )
  ),

deductionMethod,

itemizedDeduction,

stateRateOverride,

localTaxRate:
  Math.max(
    0,
    getNumber(
      "localTaxRate",
      0
    )
  )
  /
  100,

niitMode:
  getString(
    "niItEnabled",
    "auto"
  ),

customUpfrontTaxRate:
  Math.max(
    0,
    getNumber(
      "customUpfrontTaxRate",
      0
    )
  )
  /
  100,

investmentYears:
  clamp(
    Math.round(
      getNumber(
        "investmentYears",
        30
      )
    ),
    1,
    100
  ),

inflationRate:
  clamp(
    getNumber(
      "inflationRate",
      3
    )
    /
    100,
    -0.05,
    0.25
  ),

riskProfile:
  getString(
    "riskProfile",
    "balanced"
  ),

monthlyContribution:
  Math.max(
    0,
    getNumber(
      "monthlyContribution",
      0
    )
  ),

contributionGrowthRate:
  Math.max(
    0,
    getNumber(
      "contributionGrowthRate",
      0
    )
  )
  /
  100,

rebalanceFrequency:
  getString(
    "rebalanceFrequency",
    "annual"
  ),

advisorFeeRate:
  Math.max(
    0,
    getNumber(
      "advisorFeeRate",
      0
    )
  )
  /
  100,

additionalAnnualFee:
  Math.max(
    0,
    getNumber(
      "additionalAnnualFee",
      0
    )
  ),

incomeStrategy:
  getString(
    "incomeStrategy",
    "safeWithdrawal"
  ),

withdrawalRate:
  Math.max(
    0,
    getNumber(
      "withdrawalRate",
      4
    )
  )
  /
  100,

desiredMonthlyIncome:
  Math.max(
    0,
    getNumber(
      "desiredMonthlyIncome",
      0
    )
  ),

payoutYears:
  clamp(
    Math.round(
      getNumber(
        "payoutYears",
        30
      )
    ),
    1,
    100
  ),

payoutReturnRate:
  clamp(
    getNumber(
      "payoutReturnRate",
      4
    )
    /
    100,
    -0.10,
    0.25
  ),

payoutTaxRate:
  clamp(
    getNumber(
      "payoutTaxRate",
      22
    )
    /
    100,
    0,
    0.60
  ),

installmentGrowthRate:
  clamp(
    getNumber(
      "installmentGrowthRate",
      5
    )
    /
    100,
    0,
    0.20
  )
```

};

}

/* =========================================================
FEDERAL TAX ENGINE
========================================================= */

function getFederalStatus(
filingStatus
) {

const status =
FederalData
.filingStatuses[
filingStatus
];

if (!status) {

```
throw new Error(
  `Unsupported filing status: ${filingStatus}`
);
```

}

return status;

}

function determineFederalDeduction(
inputs
) {

const status =
getFederalStatus(
inputs.filingStatus
);

if (
inputs.deductionMethod ===
"none"
) {

```
return 0;
```

}

if (
inputs.deductionMethod ===
"itemized"
) {

```
return inputs.itemizedDeduction;
```

}

return status.standardDeduction;

}

function calculateProgressiveTax(
taxableIncome,
brackets
) {

const safeIncome =
Math.max(
0,
taxableIncome
);

let totalTax = 0;

let marginalRate = 0;

const rows = [];

for (
const bracket
of brackets
) {

```
const minimum =
  bracket.minimum;

const maximum =
  bracket.maximum === null
    ? Infinity
    : bracket.maximum;

if (
  safeIncome <= minimum
) {

  rows.push({

    minimum,

    maximum:
      bracket.maximum,

    rate:
      bracket.rate,

    taxableAmount: 0,

    tax: 0

  });

  continue;

}

const taxableAmount =
  Math.max(
    0,
    Math.min(
      safeIncome,
      maximum
    )
    -
    minimum
  );

const bracketTax =
  taxableAmount
  *
  bracket.rate;

if (taxableAmount > 0) {
  marginalRate =
    bracket.rate;
}

totalTax +=
  bracketTax;

rows.push({

  minimum,

  maximum:
    bracket.maximum,

  rate:
    bracket.rate,

  taxableAmount,

  tax:
    bracketTax

});
```

}

return {

```
taxableIncome:
  safeIncome,

totalTax,

marginalRate,

effectiveRate:
  safeIncome > 0
    ? totalTax
      /
      safeIncome
    : 0,

rows
```

};

}

function calculateLongTermCapitalGainTax(
gainAmount,
ordinaryTaxableIncome,
filingStatus
) {

const status =
getFederalStatus(
filingStatus
);

const gain =
Math.max(
0,
gainAmount
);

const ordinaryIncome =
Math.max(
0,
ordinaryTaxableIncome
);

let remainingGain =
gain;

let totalTax = 0;

const rows = [];

for (
const bracket
of status
.longTermCapitalGainBrackets
) {

```
const minimum =
  bracket.minimum;

const maximum =
  bracket.maximum === null
    ? Infinity
    : bracket.maximum;

const stackedMinimum =
  Math.max(
    ordinaryIncome,
    minimum
  );

const availableSpace =
  Math.max(
    0,
    maximum
    -
    stackedMinimum
  );

const taxableAmount =
  Math.min(
    remainingGain,
    availableSpace
  );

const bracketTax =
  taxableAmount
  *
  bracket.rate;

rows.push({

  minimum,

  maximum:
    bracket.maximum,

  rate:
    bracket.rate,

  taxableAmount,

  tax:
    bracketTax

});

totalTax +=
  bracketTax;

remainingGain -=
  taxableAmount;

if (
  remainingGain <= 0
) {
  break;
}
```

}

if (
remainingGain > 0
) {

```
const overflowTax =
  remainingGain
  *
  0.20;

totalTax +=
  overflowTax;

rows.push({

  minimum:
    ordinaryIncome
    +
    gain
    -
    remainingGain,

  maximum: null,

  rate: 0.20,

  taxableAmount:
    remainingGain,

  tax:
    overflowTax

});
```

}

return {

```
gain,

ordinaryTaxableIncome:
  ordinaryIncome,

totalTax,

effectiveRate:
  gain > 0
    ? totalTax
      /
      gain
    : 0,

rows
```

};

}

function calculateNIIT({
investmentIncome,
modifiedAdjustedGrossIncome,
filingStatus,
mode
}) {

const status =
getFederalStatus(
filingStatus
);

if (mode === "no") {
return 0;
}

const threshold =
status
.netInvestmentIncomeTaxThreshold;

const excessIncome =
Math.max(
0,
modifiedAdjustedGrossIncome
-
threshold
);

const taxableNIITBase =
Math.min(
Math.max(
0,
investmentIncome
),
excessIncome
);

if (mode === "yes") {

```
return (
  Math.max(
    0,
    investmentIncome
  )
  *
  FederalData
  .netInvestmentIncomeTax
  .rate
);
```

}

return (
taxableNIITBase
*
FederalData
.netInvestmentIncomeTax
.rate
);

}

/* =========================================================
UPFRONT MONEY-SOURCE TAX
========================================================= */

function calculateUpfrontFederalTax(
inputs
) {

const amount =
inputs.startingAmount;

const status =
getFederalStatus(
inputs.filingStatus
);

const deduction =
determineFederalDeduction(
inputs
);

const baseTaxableIncome =
Math.max(
0,
inputs.otherIncome
-
deduction
);

const baseOrdinaryTax =
calculateProgressiveTax(
baseTaxableIncome,
status
.ordinaryIncomeBrackets
);

let federalTax = 0;

let niitTax = 0;

let taxType =
"none";

let windfallTaxableIncome = 0;

let capitalGainResult = null;

const ordinaryIncomeSources = [
"salary",
"bonus",
"lottery",
"shortTermGain"
];

if (
ordinaryIncomeSources.includes(
inputs.moneySource
)
) {

```
taxType =
  "ordinaryIncome";

const combinedTaxableIncome =
  Math.max(
    0,
    inputs.otherIncome
    +
    amount
    -
    deduction
  );

const combinedTax =
  calculateProgressiveTax(
    combinedTaxableIncome,
    status
      .ordinaryIncomeBrackets
  );

federalTax =
  Math.max(
    0,
    combinedTax.totalTax
    -
    baseOrdinaryTax.totalTax
  );

windfallTaxableIncome =
  amount;
```

}

if (
inputs.moneySource ===
"longTermGain"
) {

```
taxType =
  "longTermCapitalGain";

capitalGainResult =
  calculateLongTermCapitalGainTax(
    amount,
    baseTaxableIncome,
    inputs.filingStatus
  );

federalTax =
  capitalGainResult
  .totalTax;

niitTax =
  calculateNIIT({

    investmentIncome:
      amount,

    modifiedAdjustedGrossIncome:
      inputs.otherIncome
      +
      amount,

    filingStatus:
      inputs.filingStatus,

    mode:
      inputs.niitMode

  });

windfallTaxableIncome =
  amount;
```

}

if (
inputs.moneySource ===
"businessSale"
) {

```
taxType =
  "mixedBusinessSale";

/*
  Business sales can include ordinary income,
  depreciation recapture, goodwill, inventory,
  and long-term capital gains.

  WealthScope uses a planning assumption:
  80% long-term gain and 20% ordinary income.
*/

const longTermPortion =
  amount
  *
  0.80;

const ordinaryPortion =
  amount
  *
  0.20;

const ordinaryCombined =
  calculateProgressiveTax(

    Math.max(
      0,
      inputs.otherIncome
      +
      ordinaryPortion
      -
      deduction
    ),

    status
      .ordinaryIncomeBrackets

  );

const ordinaryIncrement =
  Math.max(
    0,
    ordinaryCombined.totalTax
    -
    baseOrdinaryTax.totalTax
  );

capitalGainResult =
  calculateLongTermCapitalGainTax(
    longTermPortion,
    baseTaxableIncome
    +
    ordinaryPortion,
    inputs.filingStatus
  );

federalTax =
  ordinaryIncrement
  +
  capitalGainResult
  .totalTax;

niitTax =
  calculateNIIT({

    investmentIncome:
      longTermPortion,

    modifiedAdjustedGrossIncome:
      inputs.otherIncome
      +
      amount,

    filingStatus:
      inputs.filingStatus,

    mode:
      inputs.niitMode

  });

windfallTaxableIncome =
  amount;
```

}

if (
inputs.moneySource ===
"custom"
) {

```
taxType =
  "custom";

federalTax =
  amount
  *
  inputs
  .customUpfrontTaxRate;

windfallTaxableIncome =
  amount;
```

}

if (
[
"afterTaxCash",
"inheritance",
"retirementBalance"
].includes(
inputs.moneySource
)
) {

```
taxType =
  "notTaxedUpfront";

federalTax = 0;

niitTax = 0;

windfallTaxableIncome = 0;
```

}

return {

```
deduction,

baseTaxableIncome,

baseOrdinaryTax,

windfallTaxableIncome,

federalTax,

niitTax,

totalFederalTax:
  federalTax
  +
  niitTax,

taxType,

capitalGainResult
```

};

}

/* =========================================================
STATE TAX ENGINE
========================================================= */

function getSelectedState(
stateCode
) {

const state =
StateHelpers
.getStateByCode(
stateCode
);

if (!state) {

```
throw new Error(
  `Unknown state code: ${stateCode}`
);
```

}

return state;

}

function determineStateTaxableAmount(
inputs
) {

if (
[
"afterTaxCash",
"inheritance",
"retirementBalance"
].includes(
inputs.moneySource
)
) {

```
return 0;
```

}

return inputs.startingAmount;

}

function calculateStateUpfrontTax(
inputs,
federalResult
) {

const state =
getSelectedState(
inputs.stateCode
);

const taxableAmount =
determineStateTaxableAmount(
inputs
);

const rate =
inputs.stateRateOverride !== null
? inputs.stateRateOverride
: state.planningRate;

let stateTax = 0;

let explanation =
state.explanation;

if (
state.taxMethod ===
"none"
) {

```
stateTax = 0;
```

} else if (
state.taxMethod ===
"limited"
) {

```
/*
  Washington-style special capital gain treatment
  is intentionally not guessed here.
*/

if (
  [
    "longTermGain",
    "businessSale"
  ].includes(
    inputs.moneySource
  )
) {

  stateTax =
    inputs.stateRateOverride !== null
      ? taxableAmount
        *
        rate
      : 0;

  explanation +=
    " A manual state-rate override is recommended for this transaction.";

}
```

} else {

```
stateTax =
  taxableAmount
  *
  rate;
```

}

const localTax =
taxableAmount
*
inputs.localTaxRate;

return {

```
state,

taxableAmount,

rate,

stateTax,

localTax,

totalStateAndLocalTax:
  stateTax
  +
  localTax,

explanation,

modelStatus:
  state.modelStatus
```

};

}

/* =========================================================
ALLOCATION MANAGEMENT
========================================================= */

function loadRiskProfileAllocation(
profileId
) {

WealthScopeApp
.allocationRows =
AssetHelpers
.createAllocationFromProfile(
profileId
);

}

function normalizeCurrentAllocation() {

WealthScopeApp
.allocationRows =
AssetHelpers
.normalizeAllocation(
WealthScopeApp
.allocationRows
);

}

function getAllocationTotal() {

return AssetHelpers
.getAllocationTotal(
WealthScopeApp
.allocationRows
);

}

function getNormalizedAllocation() {

return AssetHelpers
.normalizeAllocation(
WealthScopeApp
.allocationRows
);

}

function calculateBlendedPortfolioAssumptions() {

return AssetHelpers
.calculateBlendedAssumptions(
WealthScopeApp
.allocationRows
);

}

/* =========================================================
MARGINAL TAX RATE HELPERS
========================================================= */

function getOrdinaryMarginalRate(
inputs,
additionalIncome = 0
) {

const status =
getFederalStatus(
inputs.filingStatus
);

const deduction =
determineFederalDeduction(
inputs
);

const taxableIncome =
Math.max(
0,
inputs.otherIncome
+
additionalIncome
-
deduction
);

const result =
calculateProgressiveTax(
taxableIncome,
status
.ordinaryIncomeBrackets
);

return result.marginalRate;

}

function getCapitalGainMarginalRate(
inputs,
additionalGain = 1
) {

const status =
getFederalStatus(
inputs.filingStatus
);

const deduction =
determineFederalDeduction(
inputs
);

const ordinaryTaxableIncome =
Math.max(
0,
inputs.otherIncome
-
deduction
);

const result =
calculateLongTermCapitalGainTax(
Math.max(
1,
additionalGain
),
ordinaryTaxableIncome,
inputs.filingStatus
);

if (
result.totalTax === 0
) {
return 0;
}

return (
result.totalTax
/
Math.max(
1,
additionalGain
)
);

}

/* =========================================================
ASSET INCOME TAX ESTIMATION
========================================================= */

function estimateAssetIncomeTaxes({
asset,
grossIncome,
inputs,
state
}) {

const ordinaryFederalRate =
getOrdinaryMarginalRate(
inputs,
grossIncome
);

const capitalGainRate =
getCapitalGainMarginalRate(
inputs,
grossIncome
);

const stateRate =
inputs.stateRateOverride !== null
? inputs.stateRateOverride
: state.planningRate;

let federalTax = 0;

let stateTax = 0;

const taxType =
asset.taxType;

if (
taxType ===
"ordinary"
) {

```
federalTax =
  grossIncome
  *
  ordinaryFederalRate;

stateTax =
  grossIncome
  *
  stateRate;
```

}

if (
taxType ===
"qualifiedDividend"
) {

```
federalTax =
  grossIncome
  *
  capitalGainRate;

stateTax =
  grossIncome
  *
  stateRate;
```

}

if (
taxType ===
"mixedDividend"
) {

```
const qualifiedShare =
  Number.isFinite(
    asset
    .qualifiedDividendShare
  )
    ? asset
      .qualifiedDividendShare
    : 0.8;

const qualifiedIncome =
  grossIncome
  *
  qualifiedShare;

const ordinaryIncome =
  grossIncome
  -
  qualifiedIncome;

federalTax =
  qualifiedIncome
  *
  capitalGainRate
  +
  ordinaryIncome
  *
  ordinaryFederalRate;

stateTax =
  grossIncome
  *
  stateRate;
```

}

if (
taxType ===
"capitalGain"
) {

```
federalTax =
  grossIncome
  *
  capitalGainRate;

stateTax =
  state
  .capitalGainTreatment ===
  "exempt"
    ? 0
    : grossIncome
      *
      stateRate;
```

}

if (
taxType ===
"treasuryInterest"
) {

```
federalTax =
  grossIncome
  *
  ordinaryFederalRate;

stateTax = 0;
```

}

if (
taxType ===
"municipalInterest"
) {

```
federalTax = 0;

/*
  State exemption depends on issuer.
  WealthScope assumes in-state municipal treatment
  for planning purposes.
*/

stateTax = 0;
```

}

if (
taxType ===
"reitDistribution"
) {

```
federalTax =
  grossIncome
  *
  ordinaryFederalRate;

stateTax =
  grossIncome
  *
  stateRate;
```

}

if (
taxType ===
"taxDeferred"
) {

```
federalTax = 0;

stateTax = 0;
```

}

if (
taxType ===
"rothTaxFree"
) {

```
federalTax = 0;

stateTax = 0;
```

}

const localTax =
grossIncome
*
inputs.localTaxRate;

const niitTax =
calculateNIIT({

```
  investmentIncome:
    grossIncome,

  modifiedAdjustedGrossIncome:
    inputs.otherIncome
    +
    grossIncome,

  filingStatus:
    inputs.filingStatus,

  mode:
    inputs.niitMode

});
```

return {

```
federalTax,

stateTax,

localTax,

niitTax,

totalTax:
  federalTax
  +
  stateTax
  +
  localTax
  +
  niitTax
```

};

}

/* =========================================================
ALLOCATION INCOME CALCULATION
========================================================= */

function calculateAllocationIncome(
netInvestableAmount,
inputs
) {

const state =
getSelectedState(
inputs.stateCode
);

const normalizedAllocation =
getNormalizedAllocation();

const rows =
normalizedAllocation.map(
asset => {

```
    const allocationFraction =
      asset.allocation
      /
      100;

    const allocatedAmount =
      netInvestableAmount
      *
      allocationFraction;

    const grossIncome =
      allocatedAmount
      *
      asset.incomeYield;

    const assetFees =
      allocatedAmount
      *
      asset.expenseRatio;

    const taxes =
      estimateAssetIncomeTaxes({

        asset,

        grossIncome,

        inputs,

        state

      });

    const netIncome =
      Math.max(
        0,
        grossIncome
        -
        taxes.totalTax
        -
        assetFees
      );


    return {

      ...asset,

      allocationFraction,

      allocatedAmount,

      grossIncome,

      federalTax:
        taxes.federalTax,

      stateTax:
        taxes.stateTax,

      localTax:
        taxes.localTax,

      niitTax:
        taxes.niitTax,

      totalTax:
        taxes.totalTax,

      assetFees,

      netIncome,

      netMonthlyIncome:
        netIncome
        /
        12

    };

  }
);
```

const totals =
rows.reduce(
(
total,
row
) => {

```
    total.allocatedAmount +=
      row.allocatedAmount;

    total.grossIncome +=
      row.grossIncome;

    total.totalTax +=
      row.totalTax;

    total.assetFees +=
      row.assetFees;

    total.netIncome +=
      row.netIncome;

    return total;

  },
  {
    allocatedAmount: 0,
    grossIncome: 0,
    totalTax: 0,
    assetFees: 0,
    netIncome: 0
  }
);
```

return {

```
rows,

totals,

netMonthlyIncome:
  totals.netIncome
  /
  12,

grossMonthlyIncome:
  totals.grossIncome
  /
  12,

portfolioYield:
  netInvestableAmount > 0
    ? totals.grossIncome
      /
      netInvestableAmount
    : 0
```

};

}

/* =========================================================
MONTHLY PORTFOLIO PROJECTION
========================================================= */

function calculateMonthlyProjection({
initialBalance,
inputs,
overrideReturn = null
}) {

const blended =
calculateBlendedPortfolioAssumptions();

const annualReturn =
overrideReturn !== null
? overrideReturn
: blended.totalReturn;

const annualIncomeYield =
blended.incomeYield;

const annualExpenseRatio =
blended.expenseRatio;

const annualAdvisorFee =
inputs.advisorFeeRate;

const totalAnnualPercentageFee =
annualExpenseRatio
+
annualAdvisorFee;

const monthlyReturn =
Math.pow(
Math.max(
0.000001,
1
+
annualReturn
),
1
/
12
)
-
1;

const monthlyIncomeYield =
annualIncomeYield
/
12;

const monthlyFeeRate =
totalAnnualPercentageFee
/
12;

const months =
inputs.investmentYears
*
12;

const ordinaryTaxRate =
getOrdinaryMarginalRate(
inputs
);

const capitalGainRate =
getCapitalGainMarginalRate(
inputs,
10000
);

const state =
getSelectedState(
inputs.stateCode
);

const stateRate =
inputs.stateRateOverride !== null
? inputs.stateRateOverride
: state.planningRate;

const blendedIncomeTaxRate =
ordinaryTaxRate
*
0.55
+
capitalGainRate
*
0.45
+
stateRate
+
inputs.localTaxRate;

let balance =
Math.max(
0,
initialBalance
);

let costBasis =
Math.max(
0,
initialBalance
);

let totalContributions = 0;

let totalGrossGrowth = 0;

let totalIncome = 0;

let totalFees = 0;

let totalTaxDrag = 0;

let currentMonthlyContribution =
inputs.monthlyContribution;

let yearStartingBalance =
balance;

let yearContributions = 0;

let yearGrowth = 0;

let yearIncome = 0;

let yearFees = 0;

let yearTaxDrag = 0;

const schedule = [];

for (
let month = 1;
month <= months;
month++
) {

```
balance +=
  currentMonthlyContribution;

costBasis +=
  currentMonthlyContribution;

totalContributions +=
  currentMonthlyContribution;

yearContributions +=
  currentMonthlyContribution;


const monthlyGrossReturn =
  balance
  *
  monthlyReturn;

const monthlyIncome =
  balance
  *
  monthlyIncomeYield;

/*
  The total return already includes the income yield.
  Monthly income is tracked for reporting but is not
  added a second time.
*/

const monthlyFee =
  balance
  *
  monthlyFeeRate
  +
  inputs.additionalAnnualFee
  /
  12;

const monthlyTaxDrag =
  Math.max(
    0,
    monthlyIncome
    *
    Math.max(
      0,
      blendedIncomeTaxRate
    )
  );

balance =
  Math.max(
    0,
    balance
    +
    monthlyGrossReturn
    -
    monthlyFee
    -
    monthlyTaxDrag
  );

/*
  Reinvested after-tax distributions increase basis.
*/

costBasis +=
  Math.max(
    0,
    monthlyIncome
    -
    monthlyTaxDrag
  );


totalGrossGrowth +=
  monthlyGrossReturn;

totalIncome +=
  monthlyIncome;

totalFees +=
  monthlyFee;

totalTaxDrag +=
  monthlyTaxDrag;

yearGrowth +=
  monthlyGrossReturn;

yearIncome +=
  monthlyIncome;

yearFees +=
  monthlyFee;

yearTaxDrag +=
  monthlyTaxDrag;


if (
  month % 12 === 0
) {

  const year =
    month
    /
    12;

  const unrealizedGain =
    Math.max(
      0,
      balance
      -
      costBasis
    );

  const liquidationFederalTax =
    calculateLongTermCapitalGainTax(
      unrealizedGain,
      Math.max(
        0,
        inputs.otherIncome
        -
        determineFederalDeduction(
          inputs
        )
      ),
      inputs.filingStatus
    )
    .totalTax;

  const liquidationStateTax =
    state.taxMethod ===
    "none"
      ? 0
      : unrealizedGain
        *
        stateRate;

  const liquidationNIIT =
    calculateNIIT({

      investmentIncome:
        unrealizedGain,

      modifiedAdjustedGrossIncome:
        inputs.otherIncome
        +
        unrealizedGain,

      filingStatus:
        inputs.filingStatus,

      mode:
        inputs.niitMode

    });

  const liquidationTax =
    liquidationFederalTax
    +
    liquidationStateTax
    +
    liquidationNIIT;

  const netLiquidationValue =
    Math.max(
      0,
      balance
      -
      liquidationTax
    );

  const inflationAdjustedValue =
    netLiquidationValue
    /
    Math.pow(
      1
      +
      inputs.inflationRate,
      year
    );


  schedule.push({

    year,

    startingBalance:
      yearStartingBalance,

    contributions:
      yearContributions,

    grossGrowth:
      yearGrowth,

    income:
      yearIncome,

    fees:
      yearFees,

    taxDrag:
      yearTaxDrag,

    endingBalance:
      balance,

    costBasis,

    unrealizedGain,

    liquidationFederalTax,

    liquidationStateTax,

    liquidationNIIT,

    liquidationTax,

    netLiquidationValue,

    inflationAdjustedValue

  });


  yearStartingBalance =
    balance;

  yearContributions = 0;

  yearGrowth = 0;

  yearIncome = 0;

  yearFees = 0;

  yearTaxDrag = 0;


  currentMonthlyContribution *=
    1
    +
    inputs
    .contributionGrowthRate;

}
```

}

return {

```
blended,

annualReturn,

annualIncomeYield,

annualExpenseRatio,

balance,

costBasis,

totalContributions,

totalGrossGrowth,

totalIncome,

totalFees,

totalTaxDrag,

schedule,

finalYear:
  schedule.at(-1)
```

};

}

/* =========================================================
INCOME STRATEGY
========================================================= */

function calculateIncomeStrategy(
principal,
allocationIncome,
inputs
) {

const strategy =
inputs.incomeStrategy;

const payoutTaxRate =
inputs.payoutTaxRate;

let grossAnnualIncome = 0;

let totalGrossPayout = 0;

let firstAnnualPayment = 0;

let finalAnnualPayment = 0;

let note = "";

const paymentSeries = [];

const balanceSeries = [];

let balance =
principal;

if (
strategy ===
"none"
) {

```
grossAnnualIncome = 0;

totalGrossPayout = 0;

note =
  "The portfolio is modeled for growth without planned withdrawals.";
```

}

if (
strategy ===
"yieldOnly"
) {

```
grossAnnualIncome =
  allocationIncome
  .totals
  .grossIncome;

firstAnnualPayment =
  grossAnnualIncome;

finalAnnualPayment =
  grossAnnualIncome;

totalGrossPayout =
  grossAnnualIncome
  *
  inputs.payoutYears;

for (
  let year = 1;
  year <= inputs.payoutYears;
  year++
) {

  paymentSeries.push(
    grossAnnualIncome
  );

  balanceSeries.push(
    principal
  );

}

note =
  "This strategy spends the estimated portfolio distributions while attempting to preserve nominal principal.";
```

}

if (
strategy ===
"safeWithdrawal"
) {

```
grossAnnualIncome =
  principal
  *
  inputs.withdrawalRate;

firstAnnualPayment =
  grossAnnualIncome;

let annualPayment =
  grossAnnualIncome;

for (
  let year = 1;
  year <= inputs.payoutYears;
  year++
) {

  balance =
    Math.max(
      0,
      balance
      *
      (
        1
        +
        inputs.payoutReturnRate
      )
      -
      annualPayment
    );

  paymentSeries.push(
    annualPayment
  );

  balanceSeries.push(
    balance
  );

  totalGrossPayout +=
    annualPayment;

}

finalAnnualPayment =
  paymentSeries.at(-1)
  ||
  0;

note =
  `Withdraws ${formatPercent(inputs.withdrawalRate)} of the starting portfolio annually while the remaining balance earns an assumed ${formatPercent(inputs.payoutReturnRate)}.`;
```

}

if (
strategy ===
"fixedDollar"
) {

```
grossAnnualIncome =
  inputs.desiredMonthlyIncome
  *
  12;

firstAnnualPayment =
  grossAnnualIncome;

for (
  let year = 1;
  year <= inputs.payoutYears;
  year++
) {

  balance =
    Math.max(
      0,
      balance
      *
      (
        1
        +
        inputs.payoutReturnRate
      )
      -
      grossAnnualIncome
    );

  paymentSeries.push(
    grossAnnualIncome
  );

  balanceSeries.push(
    balance
  );

  totalGrossPayout +=
    grossAnnualIncome;

}

finalAnnualPayment =
  grossAnnualIncome;

note =
  `Targets ${formatCurrency(inputs.desiredMonthlyIncome)} per month before payout taxes.`;
```

}

if (
strategy ===
"fixedPeriodAnnuity"
) {

```
const annualRate =
  inputs.payoutReturnRate;

const years =
  inputs.payoutYears;

if (
  annualRate === 0
) {

  grossAnnualIncome =
    principal
    /
    years;

} else {

  const factor =
    Math.pow(
      1
      +
      annualRate,
      years
    );

  grossAnnualIncome =
    principal
    *
    (
      annualRate
      *
      factor
    )
    /
    (
      factor
      -
      1
    );

}

firstAnnualPayment =
  grossAnnualIncome;

finalAnnualPayment =
  grossAnnualIncome;

for (
  let year = 1;
  year <= years;
  year++
) {

  balance =
    Math.max(
      0,
      balance
      *
      (
        1
        +
        annualRate
      )
      -
      grossAnnualIncome
    );

  paymentSeries.push(
    grossAnnualIncome
  );

  balanceSeries.push(
    balance
  );

  totalGrossPayout +=
    grossAnnualIncome;

}

note =
  "The payment is calculated to spend principal and assumed investment earnings over the selected payout period.";
```

}

if (
strategy ===
"lotteryInstallments"
) {

```
const years =
  inputs.payoutYears;

const growthRate =
  inputs.installmentGrowthRate;

const weights =
  Array.from(
    {
      length: years
    },
    (
      unused,
      index
    ) =>
      Math.pow(
        1
        +
        growthRate,
        index
      )
  );

const totalWeight =
  weights.reduce(
    (
      total,
      weight
    ) =>
      total
      +
      weight,
    0
  );

firstAnnualPayment =
  principal
  /
  totalWeight;

grossAnnualIncome =
  firstAnnualPayment;

weights.forEach(
  weight => {

    const payment =
      firstAnnualPayment
      *
      weight;

    paymentSeries.push(
      payment
    );

    balanceSeries.push(
      0
    );

    totalGrossPayout +=
      payment;

  }
);

finalAnnualPayment =
  paymentSeries.at(-1)
  ||
  0;

note =
  `Payments begin at ${formatCurrency(firstAnnualPayment)} and increase ${formatPercent(growthRate)} annually.`;
```

}

const netAnnualIncome =
grossAnnualIncome
*
(
1
-
payoutTaxRate
);

const grossMonthlyIncome =
grossAnnualIncome
/
12;

const netMonthlyIncome =
netAnnualIncome
/
12;

const totalNetPayout =
totalGrossPayout
*
(
1
-
payoutTaxRate
);

return {

```
strategy,

grossAnnualIncome,

netAnnualIncome,

grossMonthlyIncome,

netMonthlyIncome,

firstAnnualPayment,

finalAnnualPayment,

totalGrossPayout,

totalNetPayout,

paymentSeries,

balanceSeries,

note
```

};

}

/* =========================================================
COMPLETE CALCULATION
========================================================= */

function calculateWealthScope() {

try {

```
hideStatus();

const inputs =
  collectInputs();

const upfrontFederal =
  calculateUpfrontFederalTax(
    inputs
  );

const upfrontState =
  calculateStateUpfrontTax(
    inputs,
    upfrontFederal
  );

const totalUpfrontTax =
  upfrontFederal
  .totalFederalTax
  +
  upfrontState
  .totalStateAndLocalTax;

const netInvestableAmount =
  Math.max(
    0,
    inputs.startingAmount
    -
    totalUpfrontTax
  );

const allocationIncome =
  calculateAllocationIncome(
    netInvestableAmount,
    inputs
  );

const projection =
  calculateMonthlyProjection({

    initialBalance:
      netInvestableAmount,

    inputs

  });

const finalYear =
  projection.finalYear;

if (!finalYear) {

  throw new Error(
    "Projection did not produce an ending year."
  );

}

const incomeStrategy =
  calculateIncomeStrategy(
    finalYear
    .netLiquidationValue,
    allocationIncome,
    inputs
  );

const scenarios = {

  conservative:
    calculateMonthlyProjection({

      initialBalance:
        netInvestableAmount,

      inputs,

      overrideReturn:
        0.045

    }),

  planning:
    calculateMonthlyProjection({

      initialBalance:
        netInvestableAmount,

      inputs,

      overrideReturn:
        0.08

    }),

  speculative:
    calculateMonthlyProjection({

      initialBalance:
        netInvestableAmount,

      inputs,

      overrideReturn:
        0.15

    })

};


WealthScopeApp
.latestCalculation = {

  inputs,

  upfrontFederal,

  upfrontState,

  totalUpfrontTax,

  netInvestableAmount,

  allocationIncome,

  projection,

  incomeStrategy,

  scenarios

};


WealthScopeApp
.latestSchedule =
  projection.schedule;


renderCalculation(
  WealthScopeApp
  .latestCalculation
);


return (
  WealthScopeApp
  .latestCalculation
);
```

} catch (error) {

```
handleApplicationError(
  error
);

return null;
```

}

}

/* =========================================================
PRIMARY KPI RENDERING
========================================================= */

function renderPrimaryKPIs(
calculation
) {

const finalYear =
calculation
.projection
.finalYear;

setText(
"netInvestableValue",
formatCurrency(
calculation
.netInvestableAmount
)
);

setText(
"endingPortfolioValue",
formatCurrency(
finalYear
.endingBalance
)
);

setText(
"netLiquidationValue",
formatCurrency(
finalYear
.netLiquidationValue
)
);

setText(
"realValue",
formatCurrency(
finalYear
.inflationAdjustedValue
)
);

}

/* =========================================================
OVERVIEW RENDERING
========================================================= */

function renderOverview(
calculation
) {

const income =
calculation
.incomeStrategy;

const projection =
calculation
.projection;

const finalYear =
projection
.finalYear;

setText(
"firstYearNetIncome",
formatCurrency(
income
.netAnnualIncome
)
);

setText(
"grossMonthlyIncome",
formatCurrency(
income
.grossMonthlyIncome
)
);

setText(
"netMonthlyIncome",
formatCurrency(
income
.netMonthlyIncome
)
);

setText(
"portfolioYield",
formatPercent(
calculation
.allocationIncome
.portfolioYield
)
);

setText(
"annualIncomeTax",
formatCurrency(
Math.max(
0,
income
.grossAnnualIncome
-
income
.netAnnualIncome
)
)
);

setText(
"overviewUpfrontTaxes",
formatCurrency(
calculation
.totalUpfrontTax
)
);

setText(
"overviewFees",
formatCurrency(
projection
.totalFees
)
);

setText(
"overviewTaxDrag",
formatCurrency(
projection
.totalTaxDrag
)
);

setText(
"overviewLiquidationTax",
formatCurrency(
finalYear
.liquidationTax
)
);

const inflationLoss =
Math.max(
0,
finalYear
.netLiquidationValue
-
finalYear
.inflationAdjustedValue
);

setText(
"overviewInflationLoss",
formatCurrency(
inflationLoss
)
);

renderOverviewGrowthChart(
calculation
);

}

/* =========================================================
ALLOCATION TABLE AND SUMMARY
========================================================= */

function renderAllocationSummary(
calculation
) {

const blended =
calculation
.projection
.blended;

const allocationIncome =
calculation
.allocationIncome;

const allocationTotal =
getAllocationTotal();

setText(
"allocationPercentTotal",
`${allocationTotal.toFixed(1)}%`
);

const totalLine =
getElement(
"allocationPercentTotal"
)
?.parentElement;

if (totalLine) {

```
totalLine.classList.toggle(
  "is-invalid",
  Math.abs(
    allocationTotal
    -
    100
  )
  >
  0.05
);
```

}

setText(
"blendedReturn",
formatPercent(
blended
.totalReturn
)
);

setText(
"blendedYield",
formatPercent(
blended
.incomeYield
)
);

setText(
"blendedExpenseRatio",
formatPercent(
blended
.expenseRatio,
2
)
);

const taxEfficiency =
allocationIncome
.totals
.grossIncome > 0
? 1
-
(
allocationIncome
.totals
.totalTax
/
allocationIncome
.totals
.grossIncome
)
: 1;

let efficiencyLabel =
"High";

if (taxEfficiency < 0.65) {
efficiencyLabel = "Low";
} else if (
taxEfficiency < 0.82
) {
efficiencyLabel = "Moderate";
}

setText(
"taxEfficiencyScore",
efficiencyLabel
);

setText(
"allocationGrossIncome",
formatCurrency(
allocationIncome
.totals
.grossIncome
)
);

setText(
"allocationIncomeTax",
formatCurrency(
allocationIncome
.totals
.totalTax
)
);

setText(
"allocationFees",
formatCurrency(
allocationIncome
.totals
.assetFees
)
);

setText(
"allocationNetIncome",
formatCurrency(
allocationIncome
.totals
.netIncome
)
);

renderAllocationTable(
calculation
);

renderAllocationPieChart(
calculation
);

}

function renderAllocationTable(
calculation
) {

const body =
getElement(
"allocationTableBody"
);

if (!body) {
return;
}

const normalized =
getNormalizedAllocation();

const incomeById =
new Map(
calculation
.allocationIncome
.rows
.map(
row => [
row.id,
row
]
)
);

body.innerHTML =
normalized
.map(
asset => {

```
    const income =
      incomeById.get(
        asset.id
      );

    const removable =
      asset.isCustom;

    return `
      <tr data-asset-id="${escapeHtml(asset.id)}">

        <td class="asset-name-cell">

          <strong>
            ${escapeHtml(asset.name)}
          </strong>

          <small>
            ${escapeHtml(asset.category)}
          </small>

        </td>

        <td>

          <input
            class="allocation-input"
            data-asset-id="${escapeHtml(asset.id)}"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value="${asset.allocation.toFixed(1)}"
            aria-label="${escapeHtml(asset.name)} allocation percentage"
          >

        </td>

        <td>
          ${formatCurrency(
            income
            ?.allocatedAmount
            ||
            0
          )}
        </td>

        <td>
          ${formatPercent(
            asset.totalReturn
          )}
        </td>

        <td>
          ${formatPercent(
            asset.incomeYield
          )}
        </td>

        <td>
          ${formatPercent(
            asset.expenseRatio,
            2
          )}
        </td>

        <td>
          ${formatCurrency(
            income
            ?.grossIncome
            ||
            0
          )}
        </td>

        <td class="negative">
          ${formatCurrency(
            income
            ?.totalTax
            ||
            0
          )}
        </td>

        <td class="positive">
          ${formatCurrency(
            income
            ?.netIncome
            ||
            0
          )}
        </td>

        <td>

          ${
            removable
              ? `
                <button
                  type="button"
                  class="remove-asset-button"
                  data-remove-asset="${escapeHtml(asset.id)}"
                  aria-label="Remove ${escapeHtml(asset.name)}"
                >
                  ×
                </button>
              `
              : ""
          }

        </td>

      </tr>
    `;

  }
)
.join("");
```

body
.querySelectorAll(
".allocation-input"
)
.forEach(
input => {

```
  input.addEventListener(
    "change",
    event => {

      updateAllocationValue(
        event
        .currentTarget
        .dataset
        .assetId,

        Number(
          event
          .currentTarget
          .value
        )
        ||
        0
      );

    }
  );

}
```

);

body
.querySelectorAll(
"[data-remove-asset]"
)
.forEach(
button => {

```
  button.addEventListener(
    "click",
    event => {

      removeCustomAsset(
        event
        .currentTarget
        .dataset
        .removeAsset
      );

    }
  );

}
```

);

}

function updateAllocationValue(
assetId,
allocation
) {

WealthScopeApp
.allocationRows =
WealthScopeApp
.allocationRows
.map(
row =>
row.id === assetId
? {
...row,
allocation:
clamp(
allocation,
0,
100
)
}
: row
);

setRiskProfileToCustom();

calculateWealthScope();

}

function removeCustomAsset(
assetId
) {

WealthScopeApp
.allocationRows =
WealthScopeApp
.allocationRows
.filter(
row =>
row.id !== assetId
);

normalizeCurrentAllocation();

setRiskProfileToCustom();

calculateWealthScope();

}

function setRiskProfileToCustom() {

const selector =
getElement(
"riskProfile"
);

if (selector) {
selector.value = "custom";
}

}

/* =========================================================
TAX VIEW RENDERING
========================================================= */

function renderTaxView(
calculation
) {

const inputs =
calculation.inputs;

const federal =
calculation
.upfrontFederal;

const stateResult =
calculation
.upfrontState;

const state =
stateResult.state;

setText(
"federalUpfrontTax",
formatCurrency(
federal.federalTax
)
);

setText(
"stateUpfrontTax",
formatCurrency(
stateResult
.stateTax
)
);

setText(
"localUpfrontTax",
formatCurrency(
stateResult
.localTax
)
);

setText(
"niitTax",
formatCurrency(
federal.niitTax
)
);

setText(
"totalUpfrontTax",
formatCurrency(
calculation
.totalUpfrontTax
)
);

const amount =
inputs.startingAmount;

setText(
"federalEffectiveRate",
`${
      formatPercent(
        amount > 0
          ? federal.federalTax
            /
            amount
          : 0
      )
    } effective`
);

setText(
"stateEffectiveRate",
`${
      formatPercent(
        amount > 0
          ? stateResult.stateTax
            /
            amount
          : 0
      )
    } effective`
);

setText(
"localEffectiveRate",
`${
      formatPercent(
        amount > 0
          ? stateResult.localTax
            /
            amount
          : 0
      )
    } effective`
);

setText(
"totalEffectiveTaxRate",
`${
      formatPercent(
        amount > 0
          ? calculation
            .totalUpfrontTax
            /
            amount
          : 0
      )
    } effective`
);

setText(
"federalGrossIncome",
formatCurrency(
inputs.otherIncome
+
inputs.startingAmount
)
);

setText(
"federalDeductionUsed",
formatCurrency(
federal.deduction
)
);

const federalTaxableIncome =
Math.max(
0,
inputs.otherIncome
+
federal
.windfallTaxableIncome
-
federal
.deduction
);

setText(
"federalTaxableIncome",
formatCurrency(
federalTaxableIncome
)
);

const status =
getFederalStatus(
inputs.filingStatus
);

const bracketResult =
calculateProgressiveTax(
federalTaxableIncome,
status
.ordinaryIncomeBrackets
);

setText(
"federalMarginalRate",
formatPercent(
bracketResult
.marginalRate
)
);

setText(
"federalAverageRate",
formatPercent(
bracketResult
.effectiveRate
)
);

renderFederalBracketTable(
bracketResult
);

setText(
"stateTaxHeading",
`${state.name} tax details`
);

setText(
"stateTaxMethod",
StateData
.taxMethods[
state.taxMethod
]
?.name
||
state.taxMethod
);

setText(
"stateDeduction",
formatCurrency(
state
.standardDeductionEstimate
||
0
)
);

setText(
"stateTaxableIncome",
formatCurrency(
stateResult
.taxableAmount
)
);

setText(
"stateCapitalGainTreatment",
StateData
.capitalGainTreatments[
state
.capitalGainTreatment
]
?.name
||
state
.capitalGainTreatment
);

setText(
"stateTaxTotal",
formatCurrency(
stateResult
.stateTax
)
);

setText(
"stateExplanation",
stateResult
.explanation
);

renderStateBadges(
state
);

}

function renderFederalBracketTable(
bracketResult
) {

const body =
getElement(
"federalBracketTableBody"
);

if (!body) {
return;
}

body.innerHTML =
bracketResult
.rows
.filter(
row =>
row.taxableAmount > 0
)
.map(
row => {

```
    const maximumText =
      row.maximum === null
        ? "and above"
        : formatCurrency(
            row.maximum
          );

    return `
      <tr>

        <td>
          ${formatCurrency(row.minimum)}
          –
          ${maximumText}
        </td>

        <td>
          ${formatCurrency(row.taxableAmount)}
        </td>

        <td>
          ${formatPercent(row.rate, 0)}
        </td>

        <td>
          ${formatCurrency(row.tax)}
        </td>

      </tr>
    `;

  }
)
.join("");
```

}

function renderStateBadges(
state
) {

const container =
getElement(
"stateRuleBadges"
);

if (!container) {
return;
}

const badges = [

```
StateData
.taxMethods[
  state.taxMethod
]
?.name,

StateData
.modelStatuses[
  state.modelStatus
]
?.name,

state.localIncomeTaxPossible
  ? "Local tax may apply"
  : "No modeled local tax",

state.treasuryInterestStateExempt
  ? "Treasury interest state-exempt"
  : "Treasury treatment review"
```

].filter(Boolean);

container.innerHTML =
badges
.map(
badge => `         <span class="state-rule-badge">
          ${escapeHtml(badge)}         </span>
      `
)
.join("");

}

/* =========================================================
INCOME VIEW RENDERING
========================================================= */

function renderIncomeView(
calculation
) {

const allocationIncome =
calculation
.allocationIncome;

setText(
"annualInterestIncome",
formatCurrency(
sumIncomeByTaxTypes(
allocationIncome.rows,
[
"ordinary",
"treasuryInterest",
"municipalInterest"
]
)
)
);

setText(
"annualQualifiedDividends",
formatCurrency(
sumQualifiedDividendIncome(
allocationIncome.rows
)
)
);

setText(
"annualOrdinaryDividends",
formatCurrency(
sumOrdinaryDividendIncome(
allocationIncome.rows
)
)
);

setText(
"annualReitIncome",
formatCurrency(
sumIncomeByTaxTypes(
allocationIncome.rows,
[
"reitDistribution"
]
)
)
);

setText(
"annualGrossPortfolioIncome",
formatCurrency(
allocationIncome
.totals
.grossIncome
)
);

setText(
"annualNetPortfolioIncome",
formatCurrency(
allocationIncome
.totals
.netIncome
)
);

setText(
"incomeViewNetMonthly",
formatCurrency(
allocationIncome
.netMonthlyIncome
)
);

setText(
"incomeViewGrossMonthly",
formatCurrency(
allocationIncome
.grossMonthlyIncome
)
);

setText(
"incomeViewMonthlyTax",
formatCurrency(
allocationIncome
.totals
.totalTax
/
12
)
);

setText(
"incomeViewMonthlyFees",
formatCurrency(
allocationIncome
.totals
.assetFees
/
12
)
);

const monthlyGoal =
calculation
.inputs
.desiredMonthlyIncome;

const coverage =
monthlyGoal > 0
? allocationIncome
.netMonthlyIncome
/
monthlyGoal
: 0;

setText(
"monthlyGoalCoverage",
monthlyGoal > 0
? formatPercent(
coverage
)
: "No goal set"
);

const progressBar =
getElement(
"monthlyGoalProgressBar"
);

if (progressBar) {

```
progressBar.style.width =
  `${clamp(
    coverage
    *
    100,
    0,
    100
  )}%`;
```

}

renderIncomeByAssetTable(
allocationIncome
);

renderIncomeChart(
calculation
);

}

function sumIncomeByTaxTypes(
rows,
taxTypes
) {

return rows
.filter(
row =>
taxTypes.includes(
row.taxType
)
)
.reduce(
(
total,
row
) =>
total
+
row.grossIncome,
0
);

}

function sumQualifiedDividendIncome(
rows
) {

return rows.reduce(
(
total,
row
) => {

```
  if (
    row.taxType ===
    "qualifiedDividend"
  ) {

    return (
      total
      +
      row.grossIncome
    );

  }

  if (
    row.taxType ===
    "mixedDividend"
  ) {

    return (
      total
      +
      row.grossIncome
      *
      (
        row
        .qualifiedDividendShare
        ||
        0.8
      )
    );

  }

  return total;

},
0
```

);

}

function sumOrdinaryDividendIncome(
rows
) {

return rows.reduce(
(
total,
row
) => {

```
  if (
    row.taxType ===
    "mixedDividend"
  ) {

    return (
      total
      +
      row.grossIncome
      *
      (
        1
        -
        (
          row
          .qualifiedDividendShare
          ||
          0.8
        )
      )
    );

  }

  return total;

},
0
```

);

}

function renderIncomeByAssetTable(
allocationIncome
) {

const body =
getElement(
"incomeByAssetTableBody"
);

if (!body) {
return;
}

body.innerHTML =
allocationIncome
.rows
.filter(
row =>
row.allocatedAmount > 0
)
.map(
row => ` <tr>

```
      <td>
        ${escapeHtml(row.name)}
      </td>

      <td>
        ${formatCurrency(row.allocatedAmount)}
      </td>

      <td>
        ${formatCurrency(row.grossIncome)}
      </td>

      <td class="negative">
        ${formatCurrency(row.totalTax)}
      </td>

      <td class="negative">
        ${formatCurrency(row.assetFees)}
      </td>

      <td class="positive">
        ${formatCurrency(row.netIncome)}
      </td>

      <td class="positive">
        ${formatCurrency(row.netMonthlyIncome)}
      </td>

    </tr>
  `
)
.join("");
```

}

/* =========================================================
GROWTH SCENARIO RENDERING
========================================================= */

function renderGrowthScenarios(
calculation
) {

const conservative =
calculation
.scenarios
.conservative
.finalYear;

const planning =
calculation
.scenarios
.planning
.finalYear;

const speculative =
calculation
.scenarios
.speculative
.finalYear;

setText(
"conservativeEndingValue",
formatCurrency(
conservative
.netLiquidationValue
)
);

setText(
"conservativeRealValue",
`${
      formatCurrency(
        conservative
        .inflationAdjustedValue
      )
    } in today’s dollars`
);

setText(
"planningEndingValue",
formatCurrency(
planning
.netLiquidationValue
)
);

setText(
"planningRealValue",
`${
      formatCurrency(
        planning
        .inflationAdjustedValue
      )
    } in today’s dollars`
);

setText(
"speculativeEndingValue",
formatCurrency(
speculative
.netLiquidationValue
)
);

setText(
"speculativeRealValue",
`${
      formatCurrency(
        speculative
        .inflationAdjustedValue
      )
    } in today’s dollars`
);

renderScenarioGrowthChart(
calculation
);

}

/* =========================================================
ANNUITY RENDERING
========================================================= */

function renderAnnuityView(
calculation
) {

const income =
calculation
.incomeStrategy;

const finalValue =
calculation
.projection
.finalYear
.netLiquidationValue;

setText(
"lumpSumNetStart",
formatCurrency(
calculation
.netInvestableAmount
)
);

setText(
"lumpSumInvested",
formatCurrency(
calculation
.netInvestableAmount
)
);

setText(
"lumpSumEndingValue",
formatCurrency(
finalValue
)
);

setText(
"lumpSumAnnualIncome",
formatCurrency(
calculation
.allocationIncome
.totals
.netIncome
)
);

setText(
"lumpSumMonthlyIncome",
formatCurrency(
calculation
.allocationIncome
.netMonthlyIncome
)
);

setText(
"annuityFirstPayment",
formatCurrency(
income
.firstAnnualPayment
)
);

setText(
"annuityFirstAnnualPayment",
formatCurrency(
income
.firstAnnualPayment
)
);

setText(
"annuityFirstMonthlyPayment",
formatCurrency(
income
.firstAnnualPayment
*
(
1
-
calculation
.inputs
.payoutTaxRate
)
/
12
)
);

setText(
"annuityFinalAnnualPayment",
formatCurrency(
income
.finalAnnualPayment
)
);

setText(
"annuityTotalNetPayout",
formatCurrency(
income
.totalNetPayout
)
);

renderAnnuityChart(
calculation
);

}

/* =========================================================
SCHEDULE TABLE
========================================================= */

function renderAnnualSchedule(
calculation
) {

const body =
getElement(
"annualScheduleTableBody"
);

if (!body) {
return;
}

body.innerHTML =
calculation
.projection
.schedule
.map(
row => ` <tr>

```
      <td>
        ${row.year}
      </td>

      <td>
        ${formatCurrency(row.startingBalance)}
      </td>

      <td>
        ${formatCurrency(row.contributions)}
      </td>

      <td>
        ${formatCurrency(row.grossGrowth)}
      </td>

      <td>
        ${formatCurrency(row.income)}
      </td>

      <td class="negative">
        ${formatCurrency(row.fees)}
      </td>

      <td class="negative">
        ${formatCurrency(row.taxDrag)}
      </td>

      <td>
        ${formatCurrency(row.endingBalance)}
      </td>

      <td>
        ${formatCurrency(row.costBasis)}
      </td>

      <td class="negative">
        ${formatCurrency(row.liquidationTax)}
      </td>

      <td class="positive">
        ${formatCurrency(row.netLiquidationValue)}
      </td>

      <td class="warning">
        ${formatCurrency(row.inflationAdjustedValue)}
      </td>

    </tr>
  `
)
.join("");
```

}

/* =========================================================
CHART HELPERS
========================================================= */

function destroyChart(
chartName
) {

const chart =
WealthScopeApp
.charts[
chartName
];

if (chart) {

```
chart.destroy();

WealthScopeApp
.charts[
  chartName
] = null;
```

}

}

function getChartOptions({
currencyAxis = true,
stacked = false
} = {}) {

return {

```
responsive: true,

maintainAspectRatio: false,

interaction: {
  mode: "index",
  intersect: false
},

plugins: {

  legend: {

    labels: {
      color: "#D4E2ED",
      usePointStyle: true,
      boxWidth: 8
    }

  },

  tooltip: {

    callbacks: {

      label(context) {

        const label =
          context.dataset.label
          ?
          `${context.dataset.label}: `
          :
          "";

        const value =
          context.parsed.y
          ??
          context.parsed
          ??
          0;

        return (
          label
          +
          (
            currencyAxis
              ? formatCurrency(
                  value
                )
              : value
          )
        );

      }

    }

  }

},

scales: {

  x: {

    stacked,

    ticks: {
      color: "#9EB3C5"
    },

    grid: {
      color: "rgba(41, 74, 100, 0.25)"
    }

  },

  y: {

    stacked,

    ticks: {

      color: "#9EB3C5",

      callback(value) {

        return currencyAxis
          ? formatCompactCurrency(
              value
            )
          : value;

      }

    },

    grid: {
      color: "rgba(41, 74, 100, 0.35)"
    }

  }

}
```

};

}

/* =========================================================
OVERVIEW CHART
========================================================= */

function renderOverviewGrowthChart(
calculation
) {

const canvas =
getElement(
"overviewGrowthChart"
);

if (
!canvas
||
typeof Chart ===
"undefined"
) {

```
return;
```

}

destroyChart(
"overview"
);

const schedule =
calculation
.projection
.schedule;

WealthScopeApp
.charts
.overview =
new Chart(
canvas,
{

```
    type: "line",

    data: {

      labels:
        [
          0,
          ...schedule.map(
            row =>
              row.year
          )
        ],

      datasets: [

        {

          label:
            "Gross portfolio",

          data:
            [
              calculation
              .netInvestableAmount,

              ...schedule.map(
                row =>
                  row.endingBalance
              )
            ],

          borderColor:
            "#79AAFF",

          backgroundColor:
            "rgba(121,170,255,0.10)",

          borderWidth: 2.5,

          tension: 0.22,

          pointRadius: 0,

          fill: false

        },

        {

          label:
            "Net liquidation",

          data:
            [
              calculation
              .netInvestableAmount,

              ...schedule.map(
                row =>
                  row.netLiquidationValue
              )
            ],

          borderColor:
            "#65E4B1",

          backgroundColor:
            "rgba(101,228,177,0.08)",

          borderWidth: 2.5,

          tension: 0.22,

          pointRadius: 0,

          fill: false

        },

        {

          label:
            "Today’s dollars",

          data:
            [
              calculation
              .netInvestableAmount,

              ...schedule.map(
                row =>
                  row.inflationAdjustedValue
              )
            ],

          borderColor:
            "#FFCA70",

          borderWidth: 2,

          tension: 0.22,

          pointRadius: 0,

          borderDash: [
            7,
            5
          ],

          fill: false

        }

      ]

    },

    options:
      getChartOptions()

  }
);
```

}

/* =========================================================
ALLOCATION PIE CHART
========================================================= */

function renderAllocationPieChart(
calculation
) {

const canvas =
getElement(
"allocationPieChart"
);

if (
!canvas
||
typeof Chart ===
"undefined"
) {

```
return;
```

}

destroyChart(
"allocation"
);

const rows =
calculation
.allocationIncome
.rows
.filter(
row =>
row.allocation > 0
);

WealthScopeApp
.charts
.allocation =
new Chart(
canvas,
{

```
    type: "doughnut",

    data: {

      labels:
        rows.map(
          row =>
            row.shortName
            ||
            row.name
        ),

      datasets: [

        {

          data:
            rows.map(
              row =>
                row.allocatedAmount
            ),

          backgroundColor:
            rows.map(
              (
                row,
                index
              ) =>
                row.color
                ||
                WealthScopeApp
                .colors[
                  index
                  %
                  WealthScopeApp
                  .colors
                  .length
                ]
            ),

          borderColor:
            "#0D2134",

          borderWidth: 3,

          hoverOffset: 8

        }

      ]

    },

    options: {

      responsive: true,

      maintainAspectRatio: false,

      cutout: "58%",

      plugins: {

        legend: {

          position:
            "bottom",

          labels: {

            color:
              "#D4E2ED",

            usePointStyle:
              true,

            boxWidth:
              8,

            padding:
              13

          }

        },

        tooltip: {

          callbacks: {

            label(context) {

              const row =
                rows[
                  context
                  .dataIndex
                ];

              return (
                `${row.name}: `
                +
                formatCurrency(
                  row.allocatedAmount
                )
                +
                ` (${row.allocation.toFixed(1)}%)`
              );

            }

          }

        }

      }

    }

  }
);
```

}

/* =========================================================
INCOME CHART
========================================================= */

function renderIncomeChart(
calculation
) {

const canvas =
getElement(
"incomeChart"
);

if (
!canvas
||
typeof Chart ===
"undefined"
) {

```
return;
```

}

destroyChart(
"income"
);

const rows =
calculation
.allocationIncome
.rows
.filter(
row =>
row.allocatedAmount > 0
);

WealthScopeApp
.charts
.income =
new Chart(
canvas,
{

```
    type: "bar",

    data: {

      labels:
        rows.map(
          row =>
            row.shortName
            ||
            row.name
        ),

      datasets: [

        {

          label:
            "Gross annual income",

          data:
            rows.map(
              row =>
                row.grossIncome
            ),

          backgroundColor:
            "rgba(121,170,255,0.72)",

          borderColor:
            "#79AAFF",

          borderWidth: 1

        },

        {

          label:
            "Net annual income",

          data:
            rows.map(
              row =>
                row.netIncome
            ),

          backgroundColor:
            "rgba(101,228,177,0.72)",

          borderColor:
            "#65E4B1",

          borderWidth: 1

        }

      ]

    },

    options:
      getChartOptions()

  }
);
```

}

/* =========================================================
SCENARIO CHART
========================================================= */

function renderScenarioGrowthChart(
calculation
) {

const canvas =
getElement(
"scenarioGrowthChart"
);

if (
!canvas
||
typeof Chart ===
"undefined"
) {

```
return;
```

}

destroyChart(
"scenario"
);

const scenarioEntries = [

```
{
  label:
    "Conservative 4.5%",

  projection:
    calculation
    .scenarios
    .conservative,

  color:
    "#FFCA70"
},

{
  label:
    "Planning 8%",

  projection:
    calculation
    .scenarios
    .planning,

  color:
    "#65E4B1"
},

{
  label:
    "Speculative 15%",

  projection:
    calculation
    .scenarios
    .speculative,

  color:
    "#FF8293"
}
```

];

const maximumYears =
calculation
.inputs
.investmentYears;

const labels =
Array.from(
{
length:
maximumYears
+
1
},
(
unused,
index
) =>
index
);

WealthScopeApp
.charts
.scenario =
new Chart(
canvas,
{

```
    type: "line",

    data: {

      labels,

      datasets:
        scenarioEntries
        .map(
          entry => ({

            label:
              entry.label,

            data: [
              calculation
              .netInvestableAmount,

              ...entry
              .projection
              .schedule
              .map(
                row =>
                  row.netLiquidationValue
              )
            ],

            borderColor:
              entry.color,

            borderWidth: 2.5,

            pointRadius: 0,

            tension: 0.2

          })
        )

    },

    options:
      getChartOptions()

  }
);
```

}

/* =========================================================
ANNUITY CHART
========================================================= */

function renderAnnuityChart(
calculation
) {

const canvas =
getElement(
"annuityComparisonChart"
);

if (
!canvas
||
typeof Chart ===
"undefined"
) {

```
return;
```

}

destroyChart(
"annuity"
);

const income =
calculation
.incomeStrategy;

const years =
income
.paymentSeries
.length;

const labels =
Array.from(
{
length: years
},
(
unused,
index
) =>
index
+
1
);

WealthScopeApp
.charts
.annuity =
new Chart(
canvas,
{

```
    type: "line",

    data: {

      labels,

      datasets: [

        {

          label:
            "Annual payment",

          data:
            income
            .paymentSeries,

          borderColor:
            "#65E4B1",

          backgroundColor:
            "rgba(101,228,177,0.12)",

          borderWidth: 2.5,

          pointRadius: 1,

          tension: 0.18,

          fill: true

        },

        {

          label:
            "Remaining balance",

          data:
            income
            .balanceSeries,

          borderColor:
            "#79AAFF",

          borderWidth: 2,

          pointRadius: 0,

          tension: 0.18,

          fill: false

        }

      ]

    },

    options:
      getChartOptions()

  }
);
```

}

/* =========================================================
FULL RENDER
========================================================= */

function renderCalculation(
calculation
) {

renderPrimaryKPIs(
calculation
);

renderOverview(
calculation
);

renderAllocationSummary(
calculation
);

renderTaxView(
calculation
);

renderIncomeView(
calculation
);

renderGrowthScenarios(
calculation
);

renderAnnuityView(
calculation
);

renderAnnualSchedule(
calculation
);

}

/* =========================================================
STATE SELECTOR
========================================================= */

function populateStateSelector() {

const selector =
getElement(
"stateCode"
);

if (!selector) {
return;
}

const currentValue =
selector.value
||
StateData
.defaultStateCode;

selector.innerHTML =
StateHelpers
.getSortedStateList()
.map(
state => `         <option value="${state.code}">
          ${escapeHtml(state.name)}         </option>
      `
)
.join("");

selector.value =
StateHelpers
.getStateByCode(
currentValue
)
? currentValue
: StateData
.defaultStateCode;

}

/* =========================================================
SIMPLE / ADVANCED MODE
========================================================= */

function setApplicationMode(
mode
) {

WealthScopeApp.mode =
mode === "advanced"
? "advanced"
: "simple";

document
.querySelectorAll(
".advanced-only"
)
.forEach(
element => {

```
  element.hidden =
    WealthScopeApp.mode !==
    "advanced";

}
```

);

const simpleButton =
getElement(
"simpleModeButton"
);

const advancedButton =
getElement(
"advancedModeButton"
);

if (
simpleButton
&&
advancedButton
) {

```
const simpleActive =
  WealthScopeApp.mode ===
  "simple";

simpleButton
.classList
.toggle(
  "active",
  simpleActive
);

advancedButton
.classList
.toggle(
  "active",
  !simpleActive
);

simpleButton.setAttribute(
  "aria-pressed",
  String(
    simpleActive
  )
);

advancedButton.setAttribute(
  "aria-pressed",
  String(
    !simpleActive
  )
);
```

}

}

/* =========================================================
RESULT TABS
========================================================= */

function activateResultView(
viewId
) {

document
.querySelectorAll(
".result-tab"
)
.forEach(
button => {

```
  const active =
    button
    .dataset
    .view ===
    viewId;

  button
  .classList
  .toggle(
    "active",
    active
  );

  button.setAttribute(
    "aria-selected",
    String(active)
  );

}
```

);

document
.querySelectorAll(
".result-view"
)
.forEach(
view => {

```
  const active =
    view.id ===
    viewId;

  view.hidden =
    !active;

  view
  .classList
  .toggle(
    "active",
    active
  );

}
```

);

/*
Chart.js may need a resize after a hidden tab becomes visible.
*/

window.setTimeout(
() => {

```
  Object
  .values(
    WealthScopeApp
    .charts
  )
  .forEach(
    chart => {

      if (chart) {
        chart.resize();
      }

    }
  );

},
50
```

);

}

/* =========================================================
CUSTOM ASSET
========================================================= */

function openCustomAssetDialog() {

const dialog =
getElement(
"customAssetDialog"
);

if (
dialog
&&
typeof dialog.showModal ===
"function"
) {

```
dialog.showModal();
```

}

}

function addCustomAssetFromDialog() {

const name =
getString(
"customAssetName",
""
)
.trim();

if (!name) {

```
showStatus(
  "Enter a name for the custom asset.",
  "error"
);

return;
```

}

const allocation =
clamp(
getNumber(
"customAssetAllocation",
0
),
0,
100
);

const totalReturn =
getNumber(
"customAssetReturn",
6
)
/
100;

const incomeYield =
Math.max(
0,
getNumber(
"customAssetYield",
4
)
)
/
100;

const expenseRatio =
Math.max(
0,
getNumber(
"customAssetFee",
0
)
)
/
100;

const selectedTaxType =
getString(
"customAssetTaxType",
"ordinary"
);

const mappedTaxType = {

```
ordinary:
  "ordinary",

qualifiedDividend:
  "qualifiedDividend",

capitalGain:
  "capitalGain",

stateExemptInterest:
  "treasuryInterest",

federalExemptInterest:
  "municipalInterest",

taxFree:
  "rothTaxFree"
```

}[
selectedTaxType
]
||
"ordinary";

const customAsset =
AssetHelpers
.createCustomAsset({

```
  id:
    `custom-${Date.now()}`,

  name,

  allocation,

  totalReturn,

  incomeYield,

  expenseRatio,

  taxType:
    mappedTaxType,

  color:
    WealthScopeApp
    .colors[
      WealthScopeApp
      .allocationRows
      .length
      %
      WealthScopeApp
      .colors
      .length
    ]

});
```

WealthScopeApp
.allocationRows
.push(
customAsset
);

setRiskProfileToCustom();

const dialog =
getElement(
"customAssetDialog"
);

if (dialog) {
dialog.close();
}

calculateWealthScope();

}

/* =========================================================
SAVED SCENARIOS
========================================================= */

const SCENARIO_STORAGE_KEY =
"wealthscope-scenarios-v1";

function getSavedScenarios() {

try {

```
const raw =
  localStorage
  .getItem(
    SCENARIO_STORAGE_KEY
  );

if (!raw) {
  return [];
}

const parsed =
  JSON.parse(raw);

return Array.isArray(parsed)
  ? parsed
  : [];
```

} catch (error) {

```
console.warn(
  "Could not read saved scenarios.",
  error
);

return [];
```

}

}

function saveScenarios(
scenarios
) {

localStorage
.setItem(
SCENARIO_STORAGE_KEY,
JSON.stringify(
scenarios
)
);

}

function captureFormState() {

const values = {};

document
.querySelectorAll(
"input, select"
)
.forEach(
element => {

```
  if (!element.id) {
    return;
  }

  values[
    element.id
  ] =
    element.value;

}
```

);

return {

```
mode:
  WealthScopeApp.mode,

values,

allocationRows:
  WealthScopeApp
  .allocationRows
  .map(
    row => ({
      ...row
    })
  )
```

};

}

function applyFormState(
state
) {

if (!state) {
return;
}

if (state.mode) {

```
setApplicationMode(
  state.mode
);
```

}

if (
state.values
&&
typeof state.values ===
"object"
) {

```
Object
.entries(
  state.values
)
.forEach(
  (
    [
      id,
      value
    ]
  ) => {

    const element =
      getElement(id);

    if (element) {
      element.value = value;
    }

  }
);
```

}

if (
Array.isArray(
state
.allocationRows
)
&&
state
.allocationRows
.length > 0
) {

```
WealthScopeApp
.allocationRows =
  state
  .allocationRows
  .map(
    row => ({
      ...row
    })
  );
```

}

calculateWealthScope();

}

function openSaveScenarioDialog() {

const dialog =
getElement(
"saveScenarioDialog"
);

if (
dialog
&&
typeof dialog.showModal ===
"function"
) {

```
dialog.showModal();
```

}

}

function confirmSaveScenario() {

const name =
getString(
"scenarioName",
""
)
.trim();

if (!name) {

```
showStatus(
  "Enter a scenario name.",
  "error"
);

return;
```

}

const scenarios =
getSavedScenarios();

scenarios.push({

```
id:
  `scenario-${Date.now()}`,

name,

savedAt:
  new Date()
  .toISOString(),

state:
  captureFormState()
```

});

saveScenarios(
scenarios
);

const dialog =
getElement(
"saveScenarioDialog"
);

if (dialog) {
dialog.close();
}

const input =
getElement(
"scenarioName"
);

if (input) {
input.value = "";
}

showStatus(
`Saved scenario: ${name}`,
"success"
);

}

function openLoadScenarioDialog() {

renderSavedScenarioList();

const dialog =
getElement(
"loadScenarioDialog"
);

if (
dialog
&&
typeof dialog.showModal ===
"function"
) {

```
dialog.showModal();
```

}

}

function renderSavedScenarioList() {

const container =
getElement(
"savedScenarioList"
);

if (!container) {
return;
}

const scenarios =
getSavedScenarios();

if (
scenarios.length === 0
) {

```
container.innerHTML = `
  <div class="saved-scenario-empty">
    No scenarios have been saved yet.
  </div>
`;

return;
```

}

container.innerHTML =
scenarios
.map(
scenario => {

```
    const savedDate =
      new Date(
        scenario.savedAt
      )
      .toLocaleString();

    return `
      <div class="saved-scenario-item">

        <div class="saved-scenario-details">

          <strong>
            ${escapeHtml(scenario.name)}
          </strong>

          <span>
            ${escapeHtml(savedDate)}
          </span>

        </div>

        <div class="saved-scenario-actions">

          <button
            type="button"
            data-load-scenario="${escapeHtml(scenario.id)}"
          >
            Load
          </button>

          <button
            type="button"
            data-delete-scenario="${escapeHtml(scenario.id)}"
          >
            Delete
          </button>

        </div>

      </div>
    `;

  }
)
.join("");
```

container
.querySelectorAll(
"[data-load-scenario]"
)
.forEach(
button => {

```
  button.addEventListener(
    "click",
    event => {

      loadScenario(
        event
        .currentTarget
        .dataset
        .loadScenario
      );

    }
  );

}
```

);

container
.querySelectorAll(
"[data-delete-scenario]"
)
.forEach(
button => {

```
  button.addEventListener(
    "click",
    event => {

      deleteScenario(
        event
        .currentTarget
        .dataset
        .deleteScenario
      );

    }
  );

}
```

);

}

function loadScenario(
scenarioId
) {

const scenario =
getSavedScenarios()
.find(
item =>
item.id ===
scenarioId
);

if (!scenario) {
return;
}

applyFormState(
scenario.state
);

const dialog =
getElement(
"loadScenarioDialog"
);

if (dialog) {
dialog.close();
}

showStatus(
`Loaded scenario: ${scenario.name}`,
"success"
);

}

function deleteScenario(
scenarioId
) {

const scenarios =
getSavedScenarios()
.filter(
item =>
item.id !==
scenarioId
);

saveScenarios(
scenarios
);

renderSavedScenarioList();

}

/* =========================================================
EXPORTS
========================================================= */

function downloadScheduleCsv() {

const rows =
WealthScopeApp
.latestSchedule;

if (
!Array.isArray(rows)
||
rows.length === 0
) {

```
showStatus(
  "There is no annual schedule to export.",
  "error"
);

return;
```

}

const header = [

```
"Year",

"Starting Balance",

"Contributions",

"Gross Growth",

"Income",

"Fees",

"Tax Drag",

"Ending Balance",

"Cost Basis",

"Liquidation Tax",

"Net Liquidation Value",

"Inflation Adjusted Value"
```

];

const dataRows =
rows.map(
row => [

```
    row.year,

    row.startingBalance,

    row.contributions,

    row.grossGrowth,

    row.income,

    row.fees,

    row.taxDrag,

    row.endingBalance,

    row.costBasis,

    row.liquidationTax,

    row.netLiquidationValue,

    row.inflationAdjustedValue

  ]
);
```

const csv =
[
header,
...dataRows
]
.map(
row =>
row
.map(
value => {

```
        const text =
          String(value);

        return (
          `"${text.replaceAll('"', '""')}"`
        );

      }
    )
    .join(",")
)
.join("\n");
```

const blob =
new Blob(
[
csv
],
{
type:
"text/csv;charset=utf-8"
}
);

const url =
URL.createObjectURL(
blob
);

const link =
document.createElement(
"a"
);

link.href = url;

link.download =
"wealthscope-annual-schedule.csv";

document.body
.appendChild(
link
);

link.click();

link.remove();

URL.revokeObjectURL(
url
);

}

function exportPrintableReport() {

if (
!WealthScopeApp
.latestCalculation
) {

```
calculateWealthScope();
```

}

window.print();

}

/* =========================================================
EVENT BINDING
========================================================= */

function debounce(
callback,
delay = 180
) {

let timeoutId = null;

return function debounced(
...argumentsList
) {

```
window.clearTimeout(
  timeoutId
);

timeoutId =
  window.setTimeout(
    () =>
      callback(
        ...argumentsList
      ),
    delay
  );
```

};

}

function bindEvents() {

const debouncedCalculate =
debounce(
calculateWealthScope,
160
);

document
.querySelectorAll(
".control-panel input, .control-panel select"
)
.forEach(
element => {

```
  element.addEventListener(
    "input",
    debouncedCalculate
  );

  element.addEventListener(
    "change",
    debouncedCalculate
  );

}
```

);

getElement(
"calculateButton"
)
?.addEventListener(
"click",
calculateWealthScope
);

getElement(
"simpleModeButton"
)
?.addEventListener(
"click",
() => {

```
  setApplicationMode(
    "simple"
  );

  calculateWealthScope();

}
```

);

getElement(
"advancedModeButton"
)
?.addEventListener(
"click",
() => {

```
  setApplicationMode(
    "advanced"
  );

  calculateWealthScope();

}
```

);

getElement(
"riskProfile"
)
?.addEventListener(
"change",
event => {

```
  const profileId =
    event
    .currentTarget
    .value;

  loadRiskProfileAllocation(
    profileId
  );

  calculateWealthScope();

}
```

);

document
.querySelectorAll(
".result-tab"
)
.forEach(
button => {

```
  button.addEventListener(
    "click",
    event => {

      activateResultView(
        event
        .currentTarget
        .dataset
        .view
      );

    }
  );

}
```

);

getElement(
"normalizeAllocationButton"
)
?.addEventListener(
"click",
() => {

```
  normalizeCurrentAllocation();

  setRiskProfileToCustom();

  calculateWealthScope();

}
```

);

getElement(
"addCustomAssetButton"
)
?.addEventListener(
"click",
openCustomAssetDialog
);

getElement(
"confirmAddCustomAssetButton"
)
?.addEventListener(
"click",
addCustomAssetFromDialog
);

getElement(
"saveScenarioButton"
)
?.addEventListener(
"click",
openSaveScenarioDialog
);

getElement(
"confirmSaveScenarioButton"
)
?.addEventListener(
"click",
confirmSaveScenario
);

getElement(
"loadScenarioButton"
)
?.addEventListener(
"click",
openLoadScenarioDialog
);

getElement(
"closeLoadScenarioDialogButton"
)
?.addEventListener(
"click",
() => {

```
  getElement(
    "loadScenarioDialog"
  )
  ?.close();

}
```

);

getElement(
"downloadCsvButton"
)
?.addEventListener(
"click",
downloadScheduleCsv
);

getElement(
"exportReportButton"
)
?.addEventListener(
"click",
exportPrintableReport
);

getElement(
"closeStatusButton"
)
?.addEventListener(
"click",
hideStatus
);

window.addEventListener(
"resize",
debounce(
() => {

```
    Object
    .values(
      WealthScopeApp
      .charts
    )
    .forEach(
      chart => {

        if (chart) {
          chart.resize();
        }

      }
    );

  },
  120
)
```

);

}

/* =========================================================
INITIALIZATION
========================================================= */

function initializeWealthScope() {

try {

```
validateDatasets();

populateStateSelector();

setApplicationMode(
  "simple"
);

loadRiskProfileAllocation(
  getString(
    "riskProfile",
    "balanced"
  )
);

bindEvents();

activateResultView(
  "overviewView"
);

calculateWealthScope();

console.info(
  "WealthScope initialized successfully."
);
```

} catch (error) {

```
handleApplicationError(
  error
);
```

}

}

if (
document.readyState ===
"loading"
) {

document.addEventListener(
"DOMContentLoaded",
initializeWealthScope
);

} else {

initializeWealthScope();

}
