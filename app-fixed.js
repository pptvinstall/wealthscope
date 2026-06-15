"use strict";

/*
WealthScope Application Engine
-------------------------------

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

const FederalData = window.WEALTHSCOPE_FEDERAL_2026;
const StateData = window.WEALTHSCOPE_STATES_2026;
const StateHelpers = window.WEALTHSCOPE_STATE_HELPERS;
const AssetData = window.WEALTHSCOPE_ASSETS;
const AssetHelpers = window.WEALTHSCOPE_ASSET_HELPERS;

/* =========================================================
DOM HELPERS
========================================================= */

function getElement(id) {
  return document.getElementById(id);
}

function getNumber(id, fallback = 0) {
  const element = getElement(id);
  if (!element) return fallback;
  const value = Number(element.value);
  return Number.isFinite(value) ? value : fallback;
}

function getString(id, fallback = "") {
  const element = getElement(id);
  if (!element) return fallback;
  return String(element.value ?? fallback);
}

function setText(id, value) {
  const element = getElement(id);
  if (element) element.textContent = value;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundCurrency(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

function formatCurrency(value, maximumFractionDigits = 0) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(safeValue);
}

function formatPercent(decimalValue, fractionDigits = 1) {
  const safeValue = Number.isFinite(decimalValue) ? decimalValue : 0;
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(safeValue);
}

function formatCompactCurrency(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(safeValue);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* =========================================================
STATUS AND ERROR HANDLING
========================================================= */

function showStatus(message, type = "info") {
  const banner = getElement("appStatus");
  const text = getElement("appStatusText");
  
  if (!banner || !text) return;
  
  text.textContent = message;
  banner.hidden = false;
  banner.classList.remove("is-error", "is-success");
  
  if (type === "error") banner.classList.add("is-error");
  if (type === "success") banner.classList.add("is-success");
}

function hideStatus() {
  const banner = getElement("appStatus");
  if (banner) banner.hidden = true;
}

function handleApplicationError(error) {
  console.error("WealthScope calculation error:", error);
  showStatus(`Calculator error: ${error.message}`, "error");
}

/* =========================================================
DATASET VALIDATION
========================================================= */

function validateDatasets() {
  const missing = [];
  
  if (!FederalData) missing.push("Federal tax dataset");
  if (!StateData) missing.push("State tax dataset");
  if (!StateHelpers) missing.push("State helper functions");
  if (!AssetData) missing.push("Asset dataset");
  if (!AssetHelpers) missing.push("Asset helper functions");
  
  if (missing.length > 0) {
    throw new Error(`Missing required data: ${missing.join(", ")}`);
  }
}

/* =========================================================
FORM INPUT COLLECTION
========================================================= */

function collectInputs() {
  const deductionMethod = getString("deductionMethod", "standard");
  const itemizedDeduction = Math.max(0, getNumber("itemizedDeduction", 0));
  
  const stateOverrideElement = getElement("stateRateOverride");
  const stateRateOverride =
    stateOverrideElement && stateOverrideElement.value !== ""
      ? Math.max(0, Number(stateOverrideElement.value) || 0) / 100
      : null;
  
  return {
    startingAmount: Math.max(0, getNumber("startingAmount", 500000)),
    moneySource: getString("moneySource", "afterTaxCash"),
    filingStatus: getString("filingStatus", "single"),
    stateCode: getString("stateCode", "GA"),
    otherIncome: Math.max(0, getNumber("otherIncome", 0)),
    deductionMethod,
    itemizedDeduction,
    stateRateOverride,
    localTaxRate: Math.max(0, getNumber("localTaxRate", 0)) / 100,
    niitMode: getString("niItEnabled", "auto"),
    customUpfrontTaxRate: Math.max(0, getNumber("customUpfrontTaxRate", 0)) / 100,
    investmentYears: clamp(Math.round(getNumber("investmentYears", 30)), 1, 100),
    inflationRate: clamp(getNumber("inflationRate", 3) / 100, -0.05, 0.25),
    riskProfile: getString("riskProfile", "balanced"),
    monthlyContribution: Math.max(0, getNumber("monthlyContribution", 0)),
    contributionGrowthRate: Math.max(0, getNumber("contributionGrowthRate", 0)) / 100,
    rebalanceFrequency: getString("rebalanceFrequency", "annual"),
    advisorFeeRate: Math.max(0, getNumber("advisorFeeRate", 0)) / 100,
    additionalAnnualFee: Math.max(0, getNumber("additionalAnnualFee", 0)),
    incomeStrategy: getString("incomeStrategy", "safeWithdrawal"),
    withdrawalRate: Math.max(0, getNumber("withdrawalRate", 4)) / 100,
    desiredMonthlyIncome: Math.max(0, getNumber("desiredMonthlyIncome", 0)),
    payoutYears: clamp(Math.round(getNumber("payoutYears", 30)), 1, 100),
    payoutReturnRate: clamp(getNumber("payoutReturnRate", 4) / 100, -0.1, 0.25),
    payoutTaxRate: clamp(getNumber("payoutTaxRate", 22) / 100, 0, 0.6),
    installmentGrowthRate: clamp(getNumber("installmentGrowthRate", 5) / 100, 0, 0.2)
  };
}

/* =========================================================
FEDERAL TAX ENGINE
========================================================= */

function getFederalStatus(filingStatus) {
  const status = FederalData.filingStatuses[filingStatus];
  if (!status) {
    throw new Error(`Unsupported filing status: ${filingStatus}`);
  }
  return status;
}

function determineFederalDeduction(inputs) {
  const status = getFederalStatus(inputs.filingStatus);
  
  if (inputs.deductionMethod === "none") return 0;
  if (inputs.deductionMethod === "itemized") return inputs.itemizedDeduction;
  
  return status.standardDeduction;
}

function calculateProgressiveTax(taxableIncome, brackets) {
  const safeIncome = Math.max(0, taxableIncome);
  let totalTax = 0;
  let marginalRate = 0;
  const rows = [];
  
  for (const bracket of brackets) {
    const minimum = bracket.minimum;
    const maximum = bracket.maximum === null ? Infinity : bracket.maximum;
    
    if (safeIncome <= minimum) {
      rows.push({
        minimum,
        maximum: bracket.maximum,
        rate: bracket.rate,
        taxableAmount: 0,
        tax: 0
      });
      continue;
    }
    
    const taxableAmount = Math.max(0, Math.min(safeIncome, maximum) - minimum);
    const bracketTax = taxableAmount * bracket.rate;
    
    if (taxableAmount > 0) marginalRate = bracket.rate;
    
    totalTax += bracketTax;
    
    rows.push({
      minimum,
      maximum: bracket.maximum,
      rate: bracket.rate,
      taxableAmount,
      tax: bracketTax
    });
  }
  
  return {
    taxableIncome: safeIncome,
    totalTax,
    marginalRate,
    effectiveRate: safeIncome > 0 ? totalTax / safeIncome : 0,
    rows
  };
}

function calculateLongTermCapitalGainTax(gainAmount, ordinaryTaxableIncome, filingStatus) {
  const status = getFederalStatus(filingStatus);
  const gain = Math.max(0, gainAmount);
  const ordinaryIncome = Math.max(0, ordinaryTaxableIncome);
  
  let remainingGain = gain;
  let totalTax = 0;
  const rows = [];
  
  for (const bracket of status.longTermCapitalGainBrackets) {
    const minimum = bracket.minimum;
    const maximum = bracket.maximum === null ? Infinity : bracket.maximum;
    const stackedMinimum = Math.max(ordinaryIncome, minimum);
    const availableSpace = Math.max(0, maximum - stackedMinimum);
    const taxableAmount = Math.min(remainingGain, availableSpace);
    const bracketTax = taxableAmount * bracket.rate;
    
    rows.push({
      minimum,
      maximum: bracket.maximum,
      rate: bracket.rate,
      taxableAmount,
      tax: bracketTax
    });
    
    totalTax += bracketTax;
    remainingGain -= taxableAmount;
    
    if (remainingGain <= 0) break;
  }
  
  if (remainingGain > 0) {
    const overflowTax = remainingGain * 0.2;
    totalTax += overflowTax;
    rows.push({
      minimum: ordinaryIncome + gain - remainingGain,
      maximum: null,
      rate: 0.2,
      taxableAmount: remainingGain,
      tax: overflowTax
    });
  }
  
  return {
    gain,
    ordinaryTaxableIncome: ordinaryIncome,
    totalTax,
    effectiveRate: gain > 0 ? totalTax / gain : 0,
    rows
  };
}

function calculateNIIT({ investmentIncome, modifiedAdjustedGrossIncome, filingStatus, mode }) {
  const status = getFederalStatus(filingStatus);
  
  if (mode === "no") return 0;
  
  const threshold = status.netInvestmentIncomeTaxThreshold;
  const excessIncome = Math.max(0, modifiedAdjustedGrossIncome - threshold);
  const taxableNIITBase = Math.min(Math.max(0, investmentIncome), excessIncome);
  
  if (mode === "yes") {
    return Math.max(0, investmentIncome) * FederalData.netInvestmentIncomeTax.rate;
  }
  
  return taxableNIITBase * FederalData.netInvestmentIncomeTax.rate;
}

/* =========================================================
UPFRONT MONEY-SOURCE TAX
========================================================= */

function calculateUpfrontFederalTax(inputs) {
  const amount = inputs.startingAmount;
  const status = getFederalStatus(inputs.filingStatus);
  const deduction = determineFederalDeduction(inputs);
  const baseTaxableIncome = Math.max(0, inputs.otherIncome - deduction);
  const baseOrdinaryTax = calculateProgressiveTax(baseTaxableIncome, status.ordinaryIncomeBrackets);
  
  let federalTax = 0;
  let niitTax = 0;
  let taxType = "none";
  let windfallTaxableIncome = 0;
  let capitalGainResult = null;
  
  const ordinaryIncomeSources = ["salary", "bonus", "lottery", "shortTermGain"];
  
  if (ordinaryIncomeSources.includes(inputs.moneySource)) {
    taxType = "ordinaryIncome";
    const combinedTaxableIncome = Math.max(0, inputs.otherIncome + amount - deduction);
    const combinedTax = calculateProgressiveTax(combinedTaxableIncome, status.ordinaryIncomeBrackets);
    federalTax = Math.max(0, combinedTax.totalTax - baseOrdinaryTax.totalTax);
    windfallTaxableIncome = amount;
  }
  
  if (inputs.moneySource === "longTermGain") {
    taxType = "longTermCapitalGain";
    capitalGainResult = calculateLongTermCapitalGainTax(amount, baseTaxableIncome, inputs.filingStatus);
    federalTax = capitalGainResult.totalTax;
    niitTax = calculateNIIT({
      investmentIncome: amount,
      modifiedAdjustedGrossIncome: inputs.otherIncome + amount,
      filingStatus: inputs.filingStatus,
      mode: inputs.niitMode
    });
    windfallTaxableIncome = amount;
  }
  
  if (inputs.moneySource === "businessSale") {
    taxType = "mixedBusinessSale";
    const longTermPortion = amount * 0.8;
    const ordinaryPortion = amount * 0.2;
    const ordinaryCombined = calculateProgressiveTax(
      Math.max(0, inputs.otherIncome + ordinaryPortion - deduction),
      status.ordinaryIncomeBrackets
    );
    const ordinaryIncrement = Math.max(0, ordinaryCombined.totalTax - baseOrdinaryTax.totalTax);
    capitalGainResult = calculateLongTermCapitalGainTax(
      longTermPortion,
      baseTaxableIncome + ordinaryPortion,
      inputs.filingStatus
    );
    federalTax = ordinaryIncrement + capitalGainResult.totalTax;
    niitTax = calculateNIIT({
      investmentIncome: longTermPortion,
      modifiedAdjustedGrossIncome: inputs.otherIncome + amount,
      filingStatus: inputs.filingStatus,
      mode: inputs.niitMode
    });
    windfallTaxableIncome = amount;
  }
  
  if (inputs.moneySource === "custom") {
    taxType = "custom";
    federalTax = amount * inputs.customUpfrontTaxRate;
    windfallTaxableIncome = amount;
  }
  
  if (["afterTaxCash", "inheritance", "retirementBalance"].includes(inputs.moneySource)) {
    taxType = "notTaxedUpfront";
    federalTax = 0;
    niitTax = 0;
    windfallTaxableIncome = 0;
  }
  
  return {
    deduction,
    baseTaxableIncome,
    baseOrdinaryTax,
    windfallTaxableIncome,
    federalTax,
    niitTax,
    totalFederalTax: federalTax + niitTax,
    taxType,
    capitalGainResult
  };
}

/* =========================================================
STATE TAX ENGINE
========================================================= */

function getSelectedState(stateCode) {
  const state = StateHelpers.getStateByCode(stateCode);
  if (!state) {
    throw new Error(`Unknown state code: ${stateCode}`);
  }
  return state;
}

function determineStateTaxableAmount(inputs) {
  if (["afterTaxCash", "inheritance", "retirementBalance"].includes(inputs.moneySource)) {
    return 0;
  }
  return inputs.startingAmount;
}

function calculateStateUpfrontTax(inputs, federalResult) {
  const state = getSelectedState(inputs.stateCode);
  const taxableAmount = determineStateTaxableAmount(inputs);
  const rate = inputs.stateRateOverride !== null ? inputs.stateRateOverride : state.planningRate;
  
  let stateTax = 0;
  let explanation = state.explanation;
  
  if (state.taxMethod === "none") {
    stateTax = 0;
  } else if (state.taxMethod === "limited") {
    if (["longTermGain", "businessSale"].includes(inputs.moneySource)) {
      stateTax = inputs.stateRateOverride !== null ? taxableAmount * rate : 0;
      explanation += " A manual state-rate override is recommended for this transaction.";
    }
  } else {
    stateTax = taxableAmount * rate;
  }
  
  const localTax = taxableAmount * inputs.localTaxRate;
  
  return {
    state,
    taxableAmount,
    rate,
    stateTax,
    localTax,
    totalStateAndLocalTax: stateTax + localTax,
    explanation,
    modelStatus: state.modelStatus
  };
}

/* =========================================================
ALLOCATION MANAGEMENT
========================================================= */

function loadRiskProfileAllocation(profileId) {
  WealthScopeApp.allocationRows = AssetHelpers.createAllocationFromProfile(profileId);
}

function normalizeCurrentAllocation() {
  WealthScopeApp.allocationRows = AssetHelpers.normalizeAllocation(WealthScopeApp.allocationRows);
}

function getAllocationTotal() {
  return AssetHelpers.getAllocationTotal(WealthScopeApp.allocationRows);
}

function getNormalizedAllocation() {
  return AssetHelpers.normalizeAllocation(WealthScopeApp.allocationRows);
}

function calculateBlendedPortfolioAssumptions() {
  return AssetHelpers.calculateBlendedAssumptions(WealthScopeApp.allocationRows);
}

/* =========================================================
MARGINAL TAX RATE HELPERS
========================================================= */

function getOrdinaryMarginalRate(inputs, additionalIncome = 0) {
  const status = getFederalStatus(inputs.filingStatus);
  const deduction = determineFederalDeduction(inputs);
  const taxableIncome = Math.max(0, inputs.otherIncome + additionalIncome - deduction);
  const result = calculateProgressiveTax(taxableIncome, status.ordinaryIncomeBrackets);
  return result.marginalRate;
}

function getCapitalGainMarginalRate(inputs, additionalGain = 1) {
  const status = getFederalStatus(inputs.filingStatus);
  const deduction = determineFederalDeduction(inputs);
  const ordinaryTaxableIncome = Math.max(0, inputs.otherIncome - deduction);
  const result = calculateLongTermCapitalGainTax(
    Math.max(1, additionalGain),
    ordinaryTaxableIncome,
    inputs.filingStatus
  );
  
  if (result.totalTax === 0) return 0;
  return result.totalTax / Math.max(1, additionalGain);
}

/* =========================================================
INITIALIZATION
========================================================= */

function initializeWealthScope() {
  try {
    validateDatasets();
    console.info("WealthScope initialized successfully.");
  } catch (error) {
    handleApplicationError(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWealthScope);
} else {
  initializeWealthScope();
}