"use strict";

/*
 * State rates are editable planning estimates, not tax-return calculations.
 * They intentionally trade jurisdiction-specific deductions and brackets for
 * a transparent single-rate estimate. Users can override the rate in
 * Advanced mode.
 */
const stateRows = [
  ["AL", "Alabama", 0.050], ["AK", "Alaska", 0], ["AZ", "Arizona", 0.025],
  ["AR", "Arkansas", 0.039], ["CA", "California", 0.093], ["CO", "Colorado", 0.044],
  ["CT", "Connecticut", 0.060], ["DE", "Delaware", 0.066], ["DC", "District of Columbia", 0.085],
  ["FL", "Florida", 0], ["GA", "Georgia", 0.0499], ["HI", "Hawaii", 0.0825],
  ["ID", "Idaho", 0.053], ["IL", "Illinois", 0.0495], ["IN", "Indiana", 0.0295],
  ["IA", "Iowa", 0.038], ["KS", "Kansas", 0.057], ["KY", "Kentucky", 0.035],
  ["LA", "Louisiana", 0.030], ["ME", "Maine", 0.0715], ["MD", "Maryland", 0.0575],
  ["MA", "Massachusetts", 0.050], ["MI", "Michigan", 0.0425], ["MN", "Minnesota", 0.0785],
  ["MS", "Mississippi", 0.040], ["MO", "Missouri", 0.047], ["MT", "Montana", 0.059],
  ["NE", "Nebraska", 0.052], ["NV", "Nevada", 0], ["NH", "New Hampshire", 0],
  ["NJ", "New Jersey", 0.0637], ["NM", "New Mexico", 0.049], ["NY", "New York", 0.0685],
  ["NC", "North Carolina", 0.0399], ["ND", "North Dakota", 0.0195], ["OH", "Ohio", 0.035],
  ["OK", "Oklahoma", 0.0475], ["OR", "Oregon", 0.0875], ["PA", "Pennsylvania", 0.0307],
  ["RI", "Rhode Island", 0.0599], ["SC", "South Carolina", 0.064], ["SD", "South Dakota", 0],
  ["TN", "Tennessee", 0], ["TX", "Texas", 0], ["UT", "Utah", 0.0455],
  ["VT", "Vermont", 0.066], ["VA", "Virginia", 0.0575], ["WA", "Washington", 0],
  ["WV", "West Virginia", 0.0482], ["WI", "Wisconsin", 0.053], ["WY", "Wyoming", 0]
];

const noIndividualIncomeTax = new Set(["AK", "FL", "NV", "NH", "SD", "TN", "TX", "WA", "WY"]);

const states = Object.fromEntries(stateRows.map(([code, name, planningRate]) => {
  const noTax = noIndividualIncomeTax.has(code);
  return [code, {
    code,
    name,
    taxMethod: noTax ? "none" : "estimated",
    planningRate,
    capitalGainTreatment: noTax ? "exempt" : "taxed",
    modelStatus: "estimated",
    localIncomeTaxPossible: ["AL", "CO", "DC", "DE", "IN", "IA", "KY", "MD", "MI", "MO", "NY", "OH", "OR", "PA"].includes(code),
    treasuryInterestStateExempt: !noTax,
    standardDeductionEstimate: 0,
    explanation: noTax
      ? `${name} is modeled with no broad individual state income tax. Special taxes may still apply.`
      : `${name} uses an editable ${formatRate(planningRate)} planning rate. Actual brackets, deductions, credits, and local rules vary.`
  }];
}));

states.WA = {
  ...states.WA,
  taxMethod: "limited",
  capitalGainTreatment: "special",
  treasuryInterestStateExempt: true,
  standardDeductionEstimate: 278000,
  specialTax: {
    type: "washingtonCapitalGains",
    effectiveTaxYear: 2025,
    annualDeduction: 278000,
    rateStructure: [
      { minimum: 0, maximum: 1000000, rate: 0.07 },
      { minimum: 1000000, maximum: null, rate: 0.099 }
    ],
    source: "https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax",
    rateSource: "https://dor.wa.gov/forms-publications/publications-subject/special-notices/new-tiered-rates-washingtons-capital-gains-tax",
    lastReviewed: "2026-06-15",
    simplifiedEstimateWarning: "Simplified estimate using Washington's latest published 2025 deduction. It assumes the entered long-term gain is Washington-allocated and non-exempt, and does not model credits or additional deductions for charitable contributions or qualifying family-owned businesses."
  },
  explanation: "Washington does not impose a broad individual income tax on wages or ordinary income. It does impose a separate excise tax on certain Washington-allocated long-term capital gains above an annual deduction."
};

function formatRate(rate) {
  return `${(rate * 100).toFixed(2).replace(/\.?0+$/, "")}%`;
}

window.WEALTHSCOPE_STATES_2026 = {
  defaultStateCode: "GA",
  states,
  taxMethods: {
    none: { name: "No broad state income tax estimate" },
    limited: { name: "Limited-income tax estimate" },
    estimated: { name: "Editable planning-rate estimate" }
  },
  modelStatuses: {
    estimated: { name: "Planning estimate" }
  },
  capitalGainTreatments: {
    taxed: { name: "Modeled at the planning rate" },
    special: { name: "Special long-term capital-gains tax modeled" },
    exempt: { name: "No broad state income tax estimate" }
  }
};

window.WEALTHSCOPE_STATE_HELPERS = {
  getSortedStateList() {
    return Object.values(states).sort((a, b) => a.name.localeCompare(b.name));
  },
  getStateByCode(code) {
    return states[String(code || "").toUpperCase()] || null;
  }
};
