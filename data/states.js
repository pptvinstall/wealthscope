"use strict";

/*
WealthScope State Tax Dataset
Tax year: 2026

## Purpose

This file describes the general individual-income-tax
structure for all 50 states and the District of Columbia.

## Important modeling policy

State taxation is too complex to reduce every jurisdiction
to one universal rate.

Each state includes:

* Ordinary-income tax structure
* A planning rate or rate range
* Capital-gain treatment
* Treasury-interest treatment
* Municipal-interest treatment
* Local-income-tax warning
* Retirement-income notes
* Confidence / model status
* User-facing explanation

Exact progressive state bracket calculations can be added
gradually without changing the rest of the application.

Users may always use the state-rate override in Advanced Mode.
*/

window.WEALTHSCOPE_STATES_2026 = Object.freeze({

taxYear: 2026,

defaultStateCode: "GA",

modelStatuses: Object.freeze({

```
verified: Object.freeze({
  id: "verified",
  name: "Verified core rule",
  description:
    "The core tax method and headline rate have been specifically reviewed for the 2026 WealthScope model."
}),

structuredEstimate: Object.freeze({
  id: "structuredEstimate",
  name: "Structured planning estimate",
  description:
    "The state tax structure is represented, but the result is still a simplified planning estimate rather than a complete state return."
}),

manualReview: Object.freeze({
  id: "manualReview",
  name: "Manual review recommended",
  description:
    "The state has rules requiring additional confirmation, user overrides, or a future expanded calculation module."
})
```

}),

taxMethods: Object.freeze({

```
none: Object.freeze({
  id: "none",
  name: "No broad individual income tax"
}),

flat: Object.freeze({
  id: "flat",
  name: "Flat individual income tax"
}),

progressive: Object.freeze({
  id: "progressive",
  name: "Progressive individual income tax"
}),

limited: Object.freeze({
  id: "limited",
  name: "Limited or special income tax"
})
```

}),

capitalGainTreatments: Object.freeze({

```
ordinary: Object.freeze({
  id: "ordinary",
  name: "Generally taxed as ordinary state income"
}),

exempt: Object.freeze({
  id: "exempt",
  name: "No broad state individual income tax"
}),

separate: Object.freeze({
  id: "separate",
  name: "Separate capital-gain tax or special calculation"
}),

deductionOrPreference: Object.freeze({
  id: "deductionOrPreference",
  name: "Potential state deduction, exclusion or preference"
}),

manualReview: Object.freeze({
  id: "manualReview",
  name: "Special treatment requires review"
})
```

}),

states: Object.freeze({

```
AL: Object.freeze({
  code: "AL",
  name: "Alabama",
  taxMethod: "progressive",
  planningRate: 0.05,
  minimumRate: 0.02,
  maximumRate: 0.05,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Alabama-issued obligations may receive preferential treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Certain retirement benefits may qualify for Alabama exclusions.",
  modelStatus: "structuredEstimate",
  explanation:
    "Alabama uses progressive individual income-tax rates. WealthScope currently uses the top-rate planning estimate unless the user enters a state override."
}),

AK: Object.freeze({
  code: "AK",
  name: "Alaska",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Alaska does not impose a broad state individual income tax.",
  modelStatus: "verified",
  explanation:
    "Alaska is modeled with no broad state individual income tax."
}),

AZ: Object.freeze({
  code: "AZ",
  name: "Arizona",
  taxMethod: "flat",
  planningRate: 0.025,
  minimumRate: 0.025,
  maximumRate: 0.025,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Arizona municipal-bond treatment can depend on the issuing jurisdiction.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain government retirement benefits may qualify for exclusions.",
  modelStatus: "structuredEstimate",
  explanation:
    "Arizona is modeled using a 2.5% flat planning rate before state-specific deductions and credits."
}),

AR: Object.freeze({
  code: "AR",
  name: "Arkansas",
  taxMethod: "progressive",
  planningRate: 0.039,
  minimumRate: 0,
  maximumRate: 0.039,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Arkansas-issued obligations may receive state-tax preference.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Some retirement income may qualify for exclusions.",
  modelStatus: "manualReview",
  explanation:
    "Arkansas uses progressive taxation and may provide special treatment for portions of capital gains. WealthScope uses a planning rate unless overridden."
}),

CA: Object.freeze({
  code: "CA",
  name: "California",
  taxMethod: "progressive",
  planningRate: 0.093,
  minimumRate: 0.01,
  maximumRate: 0.133,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "California-issued municipal interest is generally favored; out-of-state municipal interest may be taxable.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement distributions are generally included in California taxable income, subject to state rules.",
  modelStatus: "structuredEstimate",
  explanation:
    "California uses progressive rates and generally taxes capital gains as ordinary income. The planning rate is not the maximum 13.3% rate."
}),

CO: Object.freeze({
  code: "CO",
  name: "Colorado",
  taxMethod: "flat",
  planningRate: 0.044,
  minimumRate: 0.044,
  maximumRate: 0.044,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Colorado municipal-interest rules depend on the issuing jurisdiction.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Age-based pension and annuity subtractions may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "Colorado is modeled with a 4.4% flat planning rate before state modifications and local occupational taxes."
}),

CT: Object.freeze({
  code: "CT",
  name: "Connecticut",
  taxMethod: "progressive",
  planningRate: 0.0699,
  minimumRate: 0.02,
  maximumRate: 0.0699,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Connecticut-issued obligations may receive preferential treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain pension and annuity deductions may phase in based on income.",
  modelStatus: "structuredEstimate",
  explanation:
    "Connecticut uses progressive rates. WealthScope uses a high-bracket planning rate unless overridden."
}),

DE: Object.freeze({
  code: "DE",
  name: "Delaware",
  taxMethod: "progressive",
  planningRate: 0.066,
  minimumRate: 0,
  maximumRate: 0.066,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Delaware-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Age-based pension exclusions may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "Delaware uses progressive rates and may also have local wage-tax considerations in Wilmington."
}),

DC: Object.freeze({
  code: "DC",
  name: "District of Columbia",
  taxMethod: "progressive",
  planningRate: 0.085,
  minimumRate: 0.04,
  maximumRate: 0.1075,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "District-issued obligation treatment may differ from out-of-state municipal interest.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "District retirement-income rules should be reviewed for the taxpayer’s specific income source.",
  modelStatus: "structuredEstimate",
  explanation:
    "The District of Columbia uses progressive rates reaching above 10% for high taxable income."
}),

FL: Object.freeze({
  code: "FL",
  name: "Florida",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Florida does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "Florida is modeled with no broad state individual income tax."
}),

GA: Object.freeze({
  code: "GA",
  name: "Georgia",
  taxMethod: "flat",
  planningRate: 0.0499,
  minimumRate: 0.0499,
  maximumRate: 0.0499,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Georgia-issued municipal obligations may receive state-tax preference.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Georgia offers age-based retirement-income exclusions, subject to eligibility and annual limits.",
  modelStatus: "verified",
  explanation:
    "Georgia is modeled using its 4.99% flat individual income-tax rate for 2026. State deductions, exemptions and retirement exclusions can reduce the effective rate."
}),

HI: Object.freeze({
  code: "HI",
  name: "Hawaii",
  taxMethod: "progressive",
  planningRate: 0.09,
  minimumRate: 0.014,
  maximumRate: 0.11,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "manualReview",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Hawaii-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain employer-funded retirement benefits may qualify for exclusions.",
  modelStatus: "manualReview",
  explanation:
    "Hawaii uses many progressive brackets and may apply specific capital-gain rules. WealthScope uses a planning estimate unless overridden."
}),

ID: Object.freeze({
  code: "ID",
  name: "Idaho",
  taxMethod: "flat",
  planningRate: 0.053,
  minimumRate: 0.053,
  maximumRate: 0.053,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Idaho-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Limited public-retirement deductions may apply.",
  modelStatus: "manualReview",
  explanation:
    "Idaho is modeled with a flat planning rate, but qualifying Idaho capital gains may receive a deduction."
}),

IL: Object.freeze({
  code: "IL",
  name: "Illinois",
  taxMethod: "flat",
  planningRate: 0.0495,
  minimumRate: 0.0495,
  maximumRate: 0.0495,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Illinois treatment of municipal obligations depends on the issuer and state rules.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Many qualified retirement distributions are excluded from Illinois income tax.",
  modelStatus: "structuredEstimate",
  explanation:
    "Illinois is modeled with a 4.95% flat rate before personal exemptions and retirement-income exclusions."
}),

IN: Object.freeze({
  code: "IN",
  name: "Indiana",
  taxMethod: "flat",
  planningRate: 0.0295,
  minimumRate: 0.0295,
  maximumRate: 0.0295,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Indiana municipal-interest treatment depends on the obligation.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Certain military and government benefits may qualify for deductions.",
  modelStatus: "structuredEstimate",
  explanation:
    "Indiana uses a flat state rate, but county income taxes can materially increase the total."
}),

IA: Object.freeze({
  code: "IA",
  name: "Iowa",
  taxMethod: "flat",
  planningRate: 0.038,
  minimumRate: 0.038,
  maximumRate: 0.038,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "manualReview",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Iowa-issued obligation treatment may differ from out-of-state municipal interest.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Qualifying retirement income may receive significant exclusions.",
  modelStatus: "manualReview",
  explanation:
    "Iowa is modeled with its flat-rate structure, but retirement and capital-gain provisions require additional review."
}),

KS: Object.freeze({
  code: "KS",
  name: "Kansas",
  taxMethod: "progressive",
  planningRate: 0.0558,
  minimumRate: 0.031,
  maximumRate: 0.0558,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Kansas-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain public pensions and Social Security benefits may receive exclusions based on state rules.",
  modelStatus: "structuredEstimate",
  explanation:
    "Kansas uses progressive rates. WealthScope currently applies a top-rate planning estimate."
}),

KY: Object.freeze({
  code: "KY",
  name: "Kentucky",
  taxMethod: "flat",
  planningRate: 0.04,
  minimumRate: 0.04,
  maximumRate: 0.04,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Kentucky-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Kentucky provides a retirement-income exclusion subject to state limits.",
  modelStatus: "structuredEstimate",
  explanation:
    "Kentucky is modeled with a 4% flat planning rate. Local occupational taxes may apply."
}),

LA: Object.freeze({
  code: "LA",
  name: "Louisiana",
  taxMethod: "flat",
  planningRate: 0.03,
  minimumRate: 0.03,
  maximumRate: 0.03,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Louisiana-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain federal, state and military retirement benefits may be excluded.",
  modelStatus: "structuredEstimate",
  explanation:
    "Louisiana is modeled with a 3% flat planning rate before state deductions and exclusions."
}),

ME: Object.freeze({
  code: "ME",
  name: "Maine",
  taxMethod: "progressive",
  planningRate: 0.0715,
  minimumRate: 0.058,
  maximumRate: 0.0715,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Maine-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Maine allows certain pension deductions subject to annual rules.",
  modelStatus: "structuredEstimate",
  explanation:
    "Maine uses progressive rates. WealthScope currently uses the top-rate planning estimate."
}),

MD: Object.freeze({
  code: "MD",
  name: "Maryland",
  taxMethod: "progressive",
  planningRate: 0.0575,
  minimumRate: 0.02,
  maximumRate: 0.0575,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Maryland-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Pension exclusions may apply based on age and income type.",
  modelStatus: "structuredEstimate",
  explanation:
    "Maryland combines progressive state tax with county-level income taxes, so the local-tax field is especially important."
}),

MA: Object.freeze({
  code: "MA",
  name: "Massachusetts",
  taxMethod: "flat",
  planningRate: 0.05,
  minimumRate: 0.05,
  maximumRate: 0.09,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "manualReview",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Massachusetts-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain government retirement benefits may be excluded.",
  modelStatus: "manualReview",
  explanation:
    "Massachusetts generally uses a 5% base rate, with an additional high-income surtax and special short-term capital-gain rules requiring separate review."
}),

MI: Object.freeze({
  code: "MI",
  name: "Michigan",
  taxMethod: "flat",
  planningRate: 0.0425,
  minimumRate: 0.0425,
  maximumRate: 0.0425,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Michigan-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Retirement-income deductions vary by birth year and benefit type.",
  modelStatus: "structuredEstimate",
  explanation:
    "Michigan uses a flat state rate, and several cities impose local income taxes."
}),

MN: Object.freeze({
  code: "MN",
  name: "Minnesota",
  taxMethod: "progressive",
  planningRate: 0.0785,
  minimumRate: 0.0535,
  maximumRate: 0.0985,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Minnesota-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Social Security and pension treatment depends on income and state deductions.",
  modelStatus: "structuredEstimate",
  explanation:
    "Minnesota uses progressive rates. WealthScope uses a mid-to-high-bracket planning rate by default."
}),

MS: Object.freeze({
  code: "MS",
  name: "Mississippi",
  taxMethod: "flat",
  planningRate: 0.04,
  minimumRate: 0.04,
  maximumRate: 0.04,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Mississippi-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Qualified retirement income is generally treated favorably.",
  modelStatus: "structuredEstimate",
  explanation:
    "Mississippi is modeled with a flat planning rate before state exemptions and deductions."
}),

MO: Object.freeze({
  code: "MO",
  name: "Missouri",
  taxMethod: "progressive",
  planningRate: 0.047,
  minimumRate: 0,
  maximumRate: 0.047,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Missouri-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Public pension and Social Security deductions may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "Missouri uses progressive rates, and Kansas City or St. Louis earnings taxes may apply."
}),

MT: Object.freeze({
  code: "MT",
  name: "Montana",
  taxMethod: "progressive",
  planningRate: 0.059,
  minimumRate: 0.047,
  maximumRate: 0.059,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Montana-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement-income treatment depends on income and state rules.",
  modelStatus: "manualReview",
  explanation:
    "Montana uses progressive rates and may allow a capital-gain tax credit or preference requiring separate modeling."
}),

NE: Object.freeze({
  code: "NE",
  name: "Nebraska",
  taxMethod: "progressive",
  planningRate: 0.0455,
  minimumRate: 0.0246,
  maximumRate: 0.0455,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Nebraska-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Military retirement and Social Security exclusions may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "Nebraska uses progressive rates. WealthScope currently applies the top-rate planning estimate."
}),

NV: Object.freeze({
  code: "NV",
  name: "Nevada",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Nevada does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "Nevada is modeled with no broad state individual income tax."
}),

NH: Object.freeze({
  code: "NH",
  name: "New Hampshire",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "New Hampshire does not impose a broad individual earned-income tax.",
  modelStatus: "verified",
  explanation:
    "New Hampshire is modeled with no broad state individual income tax."
}),

NJ: Object.freeze({
  code: "NJ",
  name: "New Jersey",
  taxMethod: "progressive",
  planningRate: 0.0897,
  minimumRate: 0.014,
  maximumRate: 0.1075,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "New Jersey-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement-income exclusions depend on age and gross-income limits.",
  modelStatus: "structuredEstimate",
  explanation:
    "New Jersey uses progressive rates and generally taxes capital gains as ordinary state income."
}),

NM: Object.freeze({
  code: "NM",
  name: "New Mexico",
  taxMethod: "progressive",
  planningRate: 0.059,
  minimumRate: 0.017,
  maximumRate: 0.059,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "New Mexico-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement and Social Security deductions may depend on income.",
  modelStatus: "manualReview",
  explanation:
    "New Mexico uses progressive rates and may allow a partial capital-gain deduction."
}),

NY: Object.freeze({
  code: "NY",
  name: "New York",
  taxMethod: "progressive",
  planningRate: 0.0685,
  minimumRate: 0.04,
  maximumRate: 0.109,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "New York-issued obligations generally receive favorable treatment; out-of-state municipal interest may be taxable.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Certain government pensions and age-qualified retirement distributions may be excluded.",
  modelStatus: "structuredEstimate",
  explanation:
    "New York uses progressive rates. New York City and Yonkers can impose additional local income taxes."
}),

NC: Object.freeze({
  code: "NC",
  name: "North Carolina",
  taxMethod: "flat",
  planningRate: 0.0399,
  minimumRate: 0.0399,
  maximumRate: 0.0399,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "North Carolina-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain government retirement benefits may qualify for exclusions under protected rules.",
  modelStatus: "structuredEstimate",
  explanation:
    "North Carolina is modeled using a 3.99% flat planning rate before state deductions."
}),

ND: Object.freeze({
  code: "ND",
  name: "North Dakota",
  taxMethod: "progressive",
  planningRate: 0.025,
  minimumRate: 0,
  maximumRate: 0.025,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "North Dakota-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Military retirement and Social Security exclusions may apply.",
  modelStatus: "manualReview",
  explanation:
    "North Dakota uses low progressive rates and may provide a capital-gain exclusion."
}),

OH: Object.freeze({
  code: "OH",
  name: "Ohio",
  taxMethod: "progressive",
  planningRate: 0.0275,
  minimumRate: 0,
  maximumRate: 0.0275,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Ohio-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Retirement-income credits may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "Ohio’s state rate is relatively low, but municipal income taxes are widespread and can materially affect the result."
}),

OK: Object.freeze({
  code: "OK",
  name: "Oklahoma",
  taxMethod: "progressive",
  planningRate: 0.045,
  minimumRate: 0,
  maximumRate: 0.045,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Oklahoma-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain retirement-income exclusions apply.",
  modelStatus: "manualReview",
  explanation:
    "Oklahoma uses progressive rates and may provide deductions for qualifying Oklahoma-source capital gains."
}),

OR: Object.freeze({
  code: "OR",
  name: "Oregon",
  taxMethod: "progressive",
  planningRate: 0.0875,
  minimumRate: 0.0475,
  maximumRate: 0.099,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Oregon-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Federal pension and Social Security treatment varies by source and state rule.",
  modelStatus: "structuredEstimate",
  explanation:
    "Oregon uses progressive rates, and some Portland-area taxpayers face additional local income taxes."
}),

PA: Object.freeze({
  code: "PA",
  name: "Pennsylvania",
  taxMethod: "flat",
  planningRate: 0.0307,
  minimumRate: 0.0307,
  maximumRate: 0.0307,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Pennsylvania-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: true,
  retirementIncomeNote:
    "Qualified retirement income is generally excluded from Pennsylvania personal income tax.",
  modelStatus: "structuredEstimate",
  explanation:
    "Pennsylvania uses a 3.07% flat state rate, but local earned-income and wage taxes may also apply."
}),

RI: Object.freeze({
  code: "RI",
  name: "Rhode Island",
  taxMethod: "progressive",
  planningRate: 0.0599,
  minimumRate: 0.0375,
  maximumRate: 0.0599,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Rhode Island-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement-income modifications may depend on age and income.",
  modelStatus: "structuredEstimate",
  explanation:
    "Rhode Island uses progressive rates. WealthScope currently applies the top-rate planning estimate."
}),

SC: Object.freeze({
  code: "SC",
  name: "South Carolina",
  taxMethod: "progressive",
  planningRate: 0.062,
  minimumRate: 0,
  maximumRate: 0.062,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "South Carolina-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Age-based retirement deductions may apply.",
  modelStatus: "manualReview",
  explanation:
    "South Carolina uses progressive rates and may allow a substantial net capital-gain deduction."
}),

SD: Object.freeze({
  code: "SD",
  name: "South Dakota",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "South Dakota does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "South Dakota is modeled with no broad state individual income tax."
}),

TN: Object.freeze({
  code: "TN",
  name: "Tennessee",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Tennessee does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "Tennessee is modeled with no broad state individual income tax."
}),

TX: Object.freeze({
  code: "TX",
  name: "Texas",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Texas does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "Texas is modeled with no broad state individual income tax."
}),

UT: Object.freeze({
  code: "UT",
  name: "Utah",
  taxMethod: "flat",
  planningRate: 0.045,
  minimumRate: 0.045,
  maximumRate: 0.045,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Utah-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Retirement-income credits may phase out based on income.",
  modelStatus: "structuredEstimate",
  explanation:
    "Utah is modeled using a flat planning rate before state credits."
}),

VT: Object.freeze({
  code: "VT",
  name: "Vermont",
  taxMethod: "progressive",
  planningRate: 0.0875,
  minimumRate: 0.0335,
  maximumRate: 0.0875,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Vermont-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Social Security and retirement-income exemptions may depend on income.",
  modelStatus: "manualReview",
  explanation:
    "Vermont uses progressive rates and may allow a limited capital-gain exclusion."
}),

VA: Object.freeze({
  code: "VA",
  name: "Virginia",
  taxMethod: "progressive",
  planningRate: 0.0575,
  minimumRate: 0.02,
  maximumRate: 0.0575,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Virginia-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Age deductions may apply subject to income limitations.",
  modelStatus: "structuredEstimate",
  explanation:
    "Virginia uses progressive rates that reach 5.75% at relatively modest taxable-income levels."
}),

WA: Object.freeze({
  code: "WA",
  name: "Washington",
  taxMethod: "limited",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "separate",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Washington does not impose a broad wage-income tax.",
  modelStatus: "manualReview",
  explanation:
    "Washington is modeled with no broad ordinary-income tax. Its separate capital-gains excise-tax rules must be calculated independently and are not represented by the ordinary-income planning rate."
}),

WV: Object.freeze({
  code: "WV",
  name: "West Virginia",
  taxMethod: "progressive",
  planningRate: 0.0482,
  minimumRate: 0.0236,
  maximumRate: 0.0482,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "ordinary",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "West Virginia-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Social Security and certain retirement-income exclusions may apply.",
  modelStatus: "structuredEstimate",
  explanation:
    "West Virginia uses progressive rates. WealthScope currently applies a top-rate planning estimate."
}),

WI: Object.freeze({
  code: "WI",
  name: "Wisconsin",
  taxMethod: "progressive",
  planningRate: 0.0765,
  minimumRate: 0.035,
  maximumRate: 0.0765,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "deductionOrPreference",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt:
    "Wisconsin-issued obligations may receive favorable treatment.",
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Certain government retirement benefits may be excluded.",
  modelStatus: "manualReview",
  explanation:
    "Wisconsin uses progressive rates and generally allows a partial exclusion for qualifying long-term capital gains."
}),

WY: Object.freeze({
  code: "WY",
  name: "Wyoming",
  taxMethod: "none",
  planningRate: 0,
  minimumRate: 0,
  maximumRate: 0,
  standardDeductionEstimate: 0,
  capitalGainTreatment: "exempt",
  treasuryInterestStateExempt: true,
  municipalInterestStateExempt: true,
  localIncomeTaxPossible: false,
  retirementIncomeNote:
    "Wyoming does not impose a broad individual income tax.",
  modelStatus: "verified",
  explanation:
    "Wyoming is modeled with no broad state individual income tax."
})
```

}),

sourceMetadata: Object.freeze({

```
datasetName:
  "WealthScope 2026 State Tax Structure Dataset",

lastReviewed:
  "2026-06-15",

status:
  "Planning model with state-specific structure",

defaultCalculationPolicy:
  "Use the state planning rate when an exact state bracket engine is not available. Allow the user to override the rate.",

warnings: Object.freeze([

  "A planning rate is not necessarily the taxpayer’s marginal or effective state rate.",

  "State deductions, exemptions, credits, filing-status rules, recapture provisions and phaseouts are not fully modeled for every jurisdiction.",

  "Local wage, occupational and income taxes must be entered separately unless a future locality module supports them.",

  "Capital-gain treatment can differ substantially from ordinary-income treatment.",

  "Treasury and municipal-bond interest may have special state sourcing rules.",

  "The state dataset should be re-reviewed each tax year."

])
```

})

});

/*
Utility helpers
---------------

These helpers are intentionally lightweight. The full state
calculation functions will be implemented in app.js.
*/

window.WEALTHSCOPE_STATE_HELPERS = Object.freeze({

getStateByCode(stateCode) {

```
const normalizedCode =
  String(stateCode || "")
  .trim()
  .toUpperCase();

return (
  window
  .WEALTHSCOPE_STATES_2026
  .states[normalizedCode]
  ||
  null
);
```

},

getSortedStateList() {

```
return Object
  .values(
    window
    .WEALTHSCOPE_STATES_2026
    .states
  )
  .slice()
  .sort(
    (stateA, stateB) =>
      stateA
      .name
      .localeCompare(
        stateB.name
      )
  );
```

},

stateHasBroadIncomeTax(stateCode) {

```
const state =
  this.getStateByCode(
    stateCode
  );

if (!state) {
  return false;
}

return ![
  "none",
  "limited"
].includes(
  state.taxMethod
);
```

},

stateRequiresLocalTaxReview(stateCode) {

```
const state =
  this.getStateByCode(
    stateCode
  );

return Boolean(
  state
  &&
  state.localIncomeTaxPossible
);
```

},

stateUsesSeparateCapitalGainRule(stateCode) {

```
const state =
  this.getStateByCode(
    stateCode
  );

return Boolean(
  state
  &&
  state.capitalGainTreatment ===
    "separate"
);
```

}

});

/*
Validation
*/

(function validateStateDataset() {

const dataset =
window.WEALTHSCOPE_STATES_2026;

if (!dataset) {

```
throw new Error(
  "WealthScope state dataset failed to initialize."
);
```

}

const stateEntries =
Object.values(
dataset.states
);

if (stateEntries.length !== 51) {

```
throw new Error(
  `Expected 51 state and district entries, found ${stateEntries.length}.`
);
```

}

for (
const state
of stateEntries
) {

```
if (
  !state.code
  ||
  !state.name
) {

  throw new Error(
    "A state entry is missing its code or name."
  );

}

if (
  !Number.isFinite(
    state.planningRate
  )
) {

  throw new Error(
    `Invalid planning rate for ${state.name}.`
  );

}

if (
  !dataset
  .taxMethods[
    state.taxMethod
  ]
) {

  throw new Error(
    `Invalid tax method for ${state.name}.`
  );

}

if (
  !dataset
  .capitalGainTreatments[
    state.capitalGainTreatment
  ]
) {

  throw new Error(
    `Invalid capital-gain treatment for ${state.name}.`
  );

}

if (
  !dataset
  .modelStatuses[
    state.modelStatus
  ]
) {

  throw new Error(
    `Invalid model status for ${state.name}.`
  );

}
```

}

console.info(
"WealthScope 2026 state dataset loaded successfully."
);

})();
