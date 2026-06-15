"use strict";

/*
WealthScope Asset Dataset
-------------------------

This file provides:

* Investment bucket assumptions
* Risk-profile allocations
* Income classifications
* Expected total return
* Expected cash yield
* Expense ratios
* Tax characteristics
* Liquidity and risk labels
* Pie-chart colors

All rates are planning assumptions, not guarantees or live quotes.

## Important distinction

totalReturn:
The modeled combination of price appreciation and distributed
income before taxes and fees.

incomeYield:
The portion expected to be distributed as cash interest,
dividends, or other income.

appreciationReturn:
The portion expected to remain as price appreciation.

totalReturn should normally be approximately:

```
incomeYield + appreciationReturn
```

The application may treat distributed income and unrealized
appreciation differently for tax purposes.
*/

window.WEALTHSCOPE_ASSETS = Object.freeze({

version: "2026.1",

assumptionType: "Long-term planning assumptions",

taxTypes: Object.freeze({

```
ordinary: Object.freeze({
  id: "ordinary",
  name: "Ordinary income",
  federalTreatment: "ordinaryIncome",
  stateTreatment: "ordinary",
  description:
    "Generally taxed using ordinary federal and state income-tax rules."
}),

qualifiedDividend: Object.freeze({
  id: "qualifiedDividend",
  name: "Qualified dividends",
  federalTreatment: "longTermCapitalGain",
  stateTreatment: "ordinary",
  description:
    "Modeled using preferential federal capital-gain rates and ordinary state treatment."
}),

mixedDividend: Object.freeze({
  id: "mixedDividend",
  name: "Mixed dividends",
  federalTreatment: "mixedDividend",
  stateTreatment: "ordinary",
  qualifiedShare: 0.8,
  ordinaryShare: 0.2,
  description:
    "Modeled as a mixture of qualified and ordinary dividends."
}),

capitalGain: Object.freeze({
  id: "capitalGain",
  name: "Long-term capital gain",
  federalTreatment: "longTermCapitalGain",
  stateTreatment: "stateCapitalGainRule",
  description:
    "Modeled using federal long-term capital-gain rules and the selected state’s capital-gain treatment."
}),

treasuryInterest: Object.freeze({
  id: "treasuryInterest",
  name: "U.S. Treasury interest",
  federalTreatment: "ordinaryIncome",
  stateTreatment: "stateExempt",
  description:
    "Modeled as federally taxable interest that is generally exempt from state and local income tax."
}),

municipalInterest: Object.freeze({
  id: "municipalInterest",
  name: "Municipal-bond interest",
  federalTreatment: "federalExempt",
  stateTreatment: "municipalRule",
  description:
    "Modeled as federally exempt interest. State treatment can depend on the issuer."
}),

reitDistribution: Object.freeze({
  id: "reitDistribution",
  name: "REIT distribution",
  federalTreatment: "ordinaryIncome",
  stateTreatment: "ordinary",
  description:
    "Modeled primarily as ordinary income. Actual REIT distributions may contain multiple tax components."
}),

taxDeferred: Object.freeze({
  id: "taxDeferred",
  name: "Tax-deferred",
  federalTreatment: "deferred",
  stateTreatment: "deferred",
  description:
    "No annual tax drag is modeled; withdrawals are taxed later."
}),

rothTaxFree: Object.freeze({
  id: "rothTaxFree",
  name: "Qualified Roth treatment",
  federalTreatment: "taxFree",
  stateTreatment: "taxFree",
  description:
    "Qualified growth and withdrawals are modeled as tax-free."
}),

custom: Object.freeze({
  id: "custom",
  name: "Custom treatment",
  federalTreatment: "custom",
  stateTreatment: "custom",
  description:
    "Tax treatment is supplied by the custom asset settings."
})
```

}),

riskLevels: Object.freeze({

```
veryLow: Object.freeze({
  id: "veryLow",
  name: "Very low"
}),

low: Object.freeze({
  id: "low",
  name: "Low"
}),

moderate: Object.freeze({
  id: "moderate",
  name: "Moderate"
}),

high: Object.freeze({
  id: "high",
  name: "High"
}),

veryHigh: Object.freeze({
  id: "veryHigh",
  name: "Very high"
})
```

}),

liquidityLevels: Object.freeze({

```
immediate: Object.freeze({
  id: "immediate",
  name: "Immediate"
}),

high: Object.freeze({
  id: "high",
  name: "High"
}),

moderate: Object.freeze({
  id: "moderate",
  name: "Moderate"
}),

low: Object.freeze({
  id: "low",
  name: "Low"
})
```

}),

catalog: Object.freeze({

```
cashReserve: Object.freeze({
  id: "cashReserve",
  name: "Cash reserve",
  shortName: "Cash",
  category: "Cash",
  description:
    "Highly liquid money reserved for near-term spending, emergencies, or opportunities.",
  totalReturn: 0.025,
  incomeYield: 0.025,
  appreciationReturn: 0,
  expenseRatio: 0,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0,
  riskLevel: "veryLow",
  liquidity: "immediate",
  color: "#8FA7B8",
  enabledByDefault: true
}),

highYieldSavings: Object.freeze({
  id: "highYieldSavings",
  name: "High-yield savings",
  shortName: "HYSA",
  category: "Cash",
  description:
    "Interest-bearing bank savings used for liquidity and principal stability.",
  totalReturn: 0.04,
  incomeYield: 0.04,
  appreciationReturn: 0,
  expenseRatio: 0,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0,
  riskLevel: "veryLow",
  liquidity: "immediate",
  color: "#65D8EF",
  enabledByDefault: true
}),

moneyMarket: Object.freeze({
  id: "moneyMarket",
  name: "Money-market fund",
  shortName: "Money market",
  category: "Cash",
  description:
    "Short-term high-quality securities modeled as a cash-management investment.",
  totalReturn: 0.038,
  incomeYield: 0.038,
  appreciationReturn: 0,
  expenseRatio: 0.0012,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 1,
  riskLevel: "veryLow",
  liquidity: "immediate",
  color: "#47B9D1",
  enabledByDefault: false
}),

treasuryBills: Object.freeze({
  id: "treasuryBills",
  name: "Treasury bills",
  shortName: "T-bills",
  category: "Government bonds",
  description:
    "Short-term U.S. Treasury securities modeled with federal ordinary-income taxation and state-tax exemption.",
  totalReturn: 0.04,
  incomeYield: 0.04,
  appreciationReturn: 0,
  expenseRatio: 0.0007,
  taxType: "treasuryInterest",
  qualifiedDividendShare: 0,
  turnoverRate: 1,
  riskLevel: "veryLow",
  liquidity: "high",
  color: "#5BC09A",
  enabledByDefault: true
}),

shortTreasuryBonds: Object.freeze({
  id: "shortTreasuryBonds",
  name: "Short-term Treasury bonds",
  shortName: "Short Treasuries",
  category: "Government bonds",
  description:
    "Short-duration U.S. government bonds with limited interest-rate sensitivity.",
  totalReturn: 0.043,
  incomeYield: 0.038,
  appreciationReturn: 0.005,
  expenseRatio: 0.0008,
  taxType: "treasuryInterest",
  qualifiedDividendShare: 0,
  turnoverRate: 0.35,
  riskLevel: "low",
  liquidity: "high",
  color: "#4AAE86",
  enabledByDefault: false
}),

aggregateBonds: Object.freeze({
  id: "aggregateBonds",
  name: "U.S. aggregate bonds",
  shortName: "Core bonds",
  category: "Bonds",
  description:
    "Diversified investment-grade government and corporate bonds.",
  totalReturn: 0.045,
  incomeYield: 0.038,
  appreciationReturn: 0.007,
  expenseRatio: 0.0005,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0.3,
  riskLevel: "low",
  liquidity: "high",
  color: "#67C587",
  enabledByDefault: true
}),

municipalBonds: Object.freeze({
  id: "municipalBonds",
  name: "Municipal bonds",
  shortName: "Municipals",
  category: "Bonds",
  description:
    "State and local government bonds modeled with federally tax-exempt interest.",
  totalReturn: 0.037,
  incomeYield: 0.032,
  appreciationReturn: 0.005,
  expenseRatio: 0.001,
  taxType: "municipalInterest",
  qualifiedDividendShare: 0,
  turnoverRate: 0.25,
  riskLevel: "low",
  liquidity: "high",
  color: "#92D36E",
  enabledByDefault: false
}),

corporateBonds: Object.freeze({
  id: "corporateBonds",
  name: "Investment-grade corporate bonds",
  shortName: "Corporate bonds",
  category: "Bonds",
  description:
    "Higher-yielding corporate debt with more credit risk than Treasury securities.",
  totalReturn: 0.052,
  incomeYield: 0.046,
  appreciationReturn: 0.006,
  expenseRatio: 0.001,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0.3,
  riskLevel: "low",
  liquidity: "high",
  color: "#B0D56B",
  enabledByDefault: false
}),

highYieldBonds: Object.freeze({
  id: "highYieldBonds",
  name: "High-yield corporate bonds",
  shortName: "High-yield bonds",
  category: "Bonds",
  description:
    "Below-investment-grade corporate debt with higher income and default risk.",
  totalReturn: 0.065,
  incomeYield: 0.062,
  appreciationReturn: 0.003,
  expenseRatio: 0.0035,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0.45,
  riskLevel: "moderate",
  liquidity: "high",
  color: "#D4D66C",
  enabledByDefault: false
}),

tips: Object.freeze({
  id: "tips",
  name: "Treasury inflation-protected securities",
  shortName: "TIPS",
  category: "Government bonds",
  description:
    "Treasury securities with principal adjustments tied to inflation.",
  totalReturn: 0.043,
  incomeYield: 0.025,
  appreciationReturn: 0.018,
  expenseRatio: 0.001,
  taxType: "treasuryInterest",
  qualifiedDividendShare: 0,
  turnoverRate: 0.25,
  riskLevel: "low",
  liquidity: "high",
  color: "#6FC7B3",
  enabledByDefault: false
}),

sp500Fund: Object.freeze({
  id: "sp500Fund",
  name: "S&P 500 index fund",
  shortName: "S&P 500",
  category: "U.S. stocks",
  description:
    "Large-cap U.S. equity exposure modeled with dividend income and long-term appreciation.",
  totalReturn: 0.08,
  incomeYield: 0.014,
  appreciationReturn: 0.066,
  expenseRatio: 0.0003,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.92,
  turnoverRate: 0.03,
  riskLevel: "high",
  liquidity: "high",
  color: "#79AAFF",
  enabledByDefault: true
}),

totalUSStockMarket: Object.freeze({
  id: "totalUSStockMarket",
  name: "Total U.S. stock market",
  shortName: "U.S. market",
  category: "U.S. stocks",
  description:
    "Broad U.S. equity exposure across large-, mid-, and small-cap companies.",
  totalReturn: 0.08,
  incomeYield: 0.014,
  appreciationReturn: 0.066,
  expenseRatio: 0.0003,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.9,
  turnoverRate: 0.04,
  riskLevel: "high",
  liquidity: "high",
  color: "#5F91F5",
  enabledByDefault: false
}),

dividendStocks: Object.freeze({
  id: "dividendStocks",
  name: "Dividend-focused stocks",
  shortName: "Dividend stocks",
  category: "U.S. stocks",
  description:
    "Equity portfolio emphasizing companies with established dividend payments.",
  totalReturn: 0.072,
  incomeYield: 0.035,
  appreciationReturn: 0.037,
  expenseRatio: 0.0008,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.9,
  turnoverRate: 0.12,
  riskLevel: "high",
  liquidity: "high",
  color: "#65E4B1",
  enabledByDefault: true
}),

growthStocks: Object.freeze({
  id: "growthStocks",
  name: "Growth stocks",
  shortName: "Growth stocks",
  category: "U.S. stocks",
  description:
    "Equity exposure emphasizing companies expected to reinvest profits and grow rapidly.",
  totalReturn: 0.09,
  incomeYield: 0.006,
  appreciationReturn: 0.084,
  expenseRatio: 0.001,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.85,
  turnoverRate: 0.15,
  riskLevel: "veryHigh",
  liquidity: "high",
  color: "#9B82FF",
  enabledByDefault: false
}),

smallCapStocks: Object.freeze({
  id: "smallCapStocks",
  name: "Small-cap stocks",
  shortName: "Small cap",
  category: "U.S. stocks",
  description:
    "Smaller-company equity exposure with higher expected volatility.",
  totalReturn: 0.085,
  incomeYield: 0.014,
  appreciationReturn: 0.071,
  expenseRatio: 0.0007,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.82,
  turnoverRate: 0.18,
  riskLevel: "veryHigh",
  liquidity: "high",
  color: "#B56DE8",
  enabledByDefault: false
}),

internationalStocks: Object.freeze({
  id: "internationalStocks",
  name: "International developed stocks",
  shortName: "International",
  category: "International stocks",
  description:
    "Developed-market companies outside the United States.",
  totalReturn: 0.07,
  incomeYield: 0.03,
  appreciationReturn: 0.04,
  expenseRatio: 0.0008,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.65,
  turnoverRate: 0.08,
  riskLevel: "high",
  liquidity: "high",
  color: "#F091C7",
  enabledByDefault: true
}),

emergingMarketStocks: Object.freeze({
  id: "emergingMarketStocks",
  name: "Emerging-market stocks",
  shortName: "Emerging markets",
  category: "International stocks",
  description:
    "Higher-risk equity exposure to developing economies.",
  totalReturn: 0.08,
  incomeYield: 0.025,
  appreciationReturn: 0.055,
  expenseRatio: 0.001,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.5,
  turnoverRate: 0.18,
  riskLevel: "veryHigh",
  liquidity: "high",
  color: "#F07FB0",
  enabledByDefault: false
}),

reits: Object.freeze({
  id: "reits",
  name: "Real estate investment trusts",
  shortName: "REITs",
  category: "Real estate",
  description:
    "Publicly traded real-estate companies emphasizing property income distributions.",
  totalReturn: 0.07,
  incomeYield: 0.042,
  appreciationReturn: 0.028,
  expenseRatio: 0.0012,
  taxType: "reitDistribution",
  qualifiedDividendShare: 0,
  turnoverRate: 0.12,
  riskLevel: "high",
  liquidity: "high",
  color: "#FFB36D",
  enabledByDefault: true
}),

infrastructure: Object.freeze({
  id: "infrastructure",
  name: "Infrastructure equities",
  shortName: "Infrastructure",
  category: "Real assets",
  description:
    "Public companies involved in utilities, transportation, energy, and communications infrastructure.",
  totalReturn: 0.07,
  incomeYield: 0.032,
  appreciationReturn: 0.038,
  expenseRatio: 0.0035,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.75,
  turnoverRate: 0.15,
  riskLevel: "high",
  liquidity: "high",
  color: "#E4A15B",
  enabledByDefault: false
}),

preferredStocks: Object.freeze({
  id: "preferredStocks",
  name: "Preferred stocks",
  shortName: "Preferreds",
  category: "Income securities",
  description:
    "Hybrid securities with characteristics of both stocks and bonds.",
  totalReturn: 0.058,
  incomeYield: 0.055,
  appreciationReturn: 0.003,
  expenseRatio: 0.0045,
  taxType: "mixedDividend",
  qualifiedDividendShare: 0.55,
  turnoverRate: 0.2,
  riskLevel: "moderate",
  liquidity: "high",
  color: "#F3C45E",
  enabledByDefault: false
}),

coveredCallFund: Object.freeze({
  id: "coveredCallFund",
  name: "Covered-call income fund",
  shortName: "Covered calls",
  category: "Income securities",
  description:
    "Equity strategy that sells options to generate higher cash distributions while limiting some upside.",
  totalReturn: 0.065,
  incomeYield: 0.08,
  appreciationReturn: -0.015,
  expenseRatio: 0.006,
  taxType: "ordinary",
  qualifiedDividendShare: 0.3,
  turnoverRate: 0.75,
  riskLevel: "high",
  liquidity: "high",
  color: "#FFCB65",
  enabledByDefault: false
}),

gold: Object.freeze({
  id: "gold",
  name: "Gold",
  shortName: "Gold",
  category: "Real assets",
  description:
    "Precious-metal exposure modeled primarily through price appreciation rather than cash income.",
  totalReturn: 0.045,
  incomeYield: 0,
  appreciationReturn: 0.045,
  expenseRatio: 0.0025,
  taxType: "capitalGain",
  qualifiedDividendShare: 0,
  turnoverRate: 0,
  riskLevel: "high",
  liquidity: "high",
  color: "#E8C14F",
  enabledByDefault: false
}),

privateRealEstate: Object.freeze({
  id: "privateRealEstate",
  name: "Private real estate",
  shortName: "Private real estate",
  category: "Real estate",
  description:
    "Illiquid real-estate exposure with modeled rental income and appreciation.",
  totalReturn: 0.075,
  incomeYield: 0.045,
  appreciationReturn: 0.03,
  expenseRatio: 0.0125,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0,
  riskLevel: "high",
  liquidity: "low",
  color: "#D48550",
  enabledByDefault: false
}),

privateCredit: Object.freeze({
  id: "privateCredit",
  name: "Private credit",
  shortName: "Private credit",
  category: "Alternative income",
  description:
    "Illiquid private lending modeled with high interest income and elevated credit risk.",
  totalReturn: 0.085,
  incomeYield: 0.085,
  appreciationReturn: 0,
  expenseRatio: 0.015,
  taxType: "ordinary",
  qualifiedDividendShare: 0,
  turnoverRate: 0,
  riskLevel: "high",
  liquidity: "low",
  color: "#CD765C",
  enabledByDefault: false
}),

crypto: Object.freeze({
  id: "crypto",
  name: "Cryptocurrency",
  shortName: "Crypto",
  category: "Alternative growth",
  description:
    "Highly volatile digital-asset exposure modeled entirely as appreciation.",
  totalReturn: 0.12,
  incomeYield: 0,
  appreciationReturn: 0.12,
  expenseRatio: 0.01,
  taxType: "capitalGain",
  qualifiedDividendShare: 0,
  turnoverRate: 0.2,
  riskLevel: "veryHigh",
  liquidity: "high",
  color: "#FF8293",
  enabledByDefault: false
})
```

}),

riskProfiles: Object.freeze({

```
capitalPreservation: Object.freeze({
  id: "capitalPreservation",
  name: "Capital preservation",
  description:
    "Emphasizes liquidity and principal stability.",
  allocations: Object.freeze({
    cashReserve: 20,
    highYieldSavings: 25,
    treasuryBills: 30,
    shortTreasuryBonds: 15,
    aggregateBonds: 10
  })
}),

conservative: Object.freeze({
  id: "conservative",
  name: "Conservative",
  description:
    "Prioritizes income and stability with limited equity exposure.",
  allocations: Object.freeze({
    cashReserve: 8,
    highYieldSavings: 10,
    treasuryBills: 17,
    aggregateBonds: 30,
    sp500Fund: 15,
    dividendStocks: 10,
    internationalStocks: 5,
    reits: 5
  })
}),

balanced: Object.freeze({
  id: "balanced",
  name: "Balanced",
  description:
    "Blends diversified growth, income, and liquidity.",
  allocations: Object.freeze({
    cashReserve: 5,
    highYieldSavings: 5,
    treasuryBills: 8,
    aggregateBonds: 17,
    sp500Fund: 30,
    dividendStocks: 12,
    internationalStocks: 10,
    reits: 8,
    growthStocks: 5
  })
}),

growth: Object.freeze({
  id: "growth",
  name: "Growth",
  description:
    "Emphasizes long-term appreciation with a smaller stability allocation.",
  allocations: Object.freeze({
    cashReserve: 3,
    treasuryBills: 4,
    aggregateBonds: 8,
    sp500Fund: 38,
    growthStocks: 17,
    smallCapStocks: 8,
    internationalStocks: 12,
    emergingMarketStocks: 5,
    reits: 5
  })
}),

aggressive: Object.freeze({
  id: "aggressive",
  name: "Aggressive",
  description:
    "Seeks maximum long-term growth and accepts substantial volatility.",
  allocations: Object.freeze({
    cashReserve: 2,
    treasuryBills: 2,
    sp500Fund: 35,
    growthStocks: 25,
    smallCapStocks: 12,
    internationalStocks: 10,
    emergingMarketStocks: 8,
    reits: 3,
    crypto: 3
  })
}),

custom: Object.freeze({
  id: "custom",
  name: "Custom",
  description:
    "Uses the allocations entered directly by the user.",
  allocations: Object.freeze({
    cashReserve: 5,
    highYieldSavings: 5,
    treasuryBills: 10,
    aggregateBonds: 15,
    sp500Fund: 35,
    dividendStocks: 10,
    internationalStocks: 10,
    reits: 10
  })
})
```

}),

accountTypes: Object.freeze({

```
taxable: Object.freeze({
  id: "taxable",
  name: "Taxable brokerage",
  annualTaxDrag: true,
  liquidationTax: true,
  withdrawalTax: false,
  description:
    "Income and realized gains may be taxed annually. Unrealized gains may be taxed when sold."
}),

traditional: Object.freeze({
  id: "traditional",
  name: "Traditional tax-deferred",
  annualTaxDrag: false,
  liquidationTax: false,
  withdrawalTax: true,
  description:
    "Growth is modeled as tax-deferred, with ordinary income tax applied to withdrawals."
}),

roth: Object.freeze({
  id: "roth",
  name: "Roth / qualified tax-free",
  annualTaxDrag: false,
  liquidationTax: false,
  withdrawalTax: false,
  description:
    "Qualified growth and withdrawals are modeled as tax-free."
}),

cash: Object.freeze({
  id: "cash",
  name: "Cash account",
  annualTaxDrag: true,
  liquidationTax: false,
  withdrawalTax: false,
  description:
    "Interest is generally modeled as taxable ordinary income."
})
```

}),

sourceMetadata: Object.freeze({

```
datasetName:
  "WealthScope Investment Assumption Dataset",

lastReviewed:
  "2026-06-15",

methodology:
  "Illustrative long-term nominal return, income-yield, expense-ratio, and tax-classification assumptions.",

warnings: Object.freeze([

  "These figures are not live yields, market forecasts, investment recommendations, or guarantees.",

  "Actual returns can be negative and may differ materially from the modeled assumptions.",

  "Expense ratios vary by fund, account, manager, and investment vehicle.",

  "Income classifications can vary by security and tax year.",

  "REIT, option-income, municipal-bond, commodity, crypto, private-credit, and private-real-estate tax treatment can be more complex than the simplified model.",

  "Users should edit assumptions when analyzing a specific product or portfolio."

])
```

})

});

/*
Asset helper functions
----------------------

These helpers return mutable copies so app.js can safely edit
allocations without changing the frozen source dataset.
*/

window.WEALTHSCOPE_ASSET_HELPERS = Object.freeze({

getAsset(assetId) {

```
const asset =
  window
  .WEALTHSCOPE_ASSETS
  .catalog[assetId];

return asset || null;
```

},

getAssetList() {

```
return Object
  .values(
    window
    .WEALTHSCOPE_ASSETS
    .catalog
  )
  .slice();
```

},

getEnabledDefaultAssets() {

```
return this
  .getAssetList()
  .filter(
    asset =>
      asset.enabledByDefault
  );
```

},

getRiskProfile(profileId) {

```
return (
  window
  .WEALTHSCOPE_ASSETS
  .riskProfiles[profileId]
  ||
  null
);
```

},

createAllocationFromProfile(profileId) {

```
const profile =
  this.getRiskProfile(
    profileId
  );

if (!profile) {

  throw new Error(
    `Unknown risk profile: ${profileId}`
  );

}

return Object
  .entries(
    profile.allocations
  )
  .map(
    ([assetId, allocation]) => {

      const asset =
        this.getAsset(
          assetId
        );

      if (!asset) {

        throw new Error(
          `Risk profile references unknown asset: ${assetId}`
        );

      }

      return {
        ...asset,
        allocation,
        isCustom: false
      };

    }
  );
```

},

cloneAssetForAllocation(
assetId,
allocation = 0
) {

```
const asset =
  this.getAsset(
    assetId
  );

if (!asset) {

  return null;

}

return {
  ...asset,
  allocation:
    Number(allocation) || 0,
  isCustom: false
};
```

},

createCustomAsset({
id,
name,
allocation = 0,
totalReturn = 0,
incomeYield = 0,
expenseRatio = 0,
taxType = "ordinary",
color = "#B295FF"
}) {

```
const safeId =
  String(
    id
    ||
    `custom-${Date.now()}`
  );

const safeName =
  String(
    name
    ||
    "Custom asset"
  );

const safeReturn =
  Number(totalReturn) || 0;

const safeYield =
  Number(incomeYield) || 0;

const safeFee =
  Math.max(
    0,
    Number(expenseRatio) || 0
  );

return {

  id: safeId,

  name: safeName,

  shortName: safeName,

  category: "Custom",

  description:
    "User-defined investment assumption.",

  totalReturn:
    safeReturn,

  incomeYield:
    safeYield,

  appreciationReturn:
    safeReturn - safeYield,

  expenseRatio:
    safeFee,

  taxType:
    window
    .WEALTHSCOPE_ASSETS
    .taxTypes[taxType]
      ? taxType
      : "ordinary",

  qualifiedDividendShare:
    taxType === "qualifiedDividend"
      ? 1
      : 0,

  turnoverRate: 0,

  riskLevel: "moderate",

  liquidity: "moderate",

  color,

  enabledByDefault: false,

  allocation:
    Number(allocation) || 0,

  isCustom: true

};
```

},

getAllocationTotal(allocationRows) {

```
if (!Array.isArray(allocationRows)) {
  return 0;
}

return allocationRows.reduce(
  (
    total,
    row
  ) =>
    total
    +
    (
      Number(
        row.allocation
      )
      ||
      0
    ),
  0
);
```

},

normalizeAllocation(allocationRows) {

```
if (!Array.isArray(allocationRows)) {
  return [];
}

const total =
  this.getAllocationTotal(
    allocationRows
  );

if (total <= 0) {

  return allocationRows.map(
    row => ({
      ...row,
      allocation: 0
    })
  );

}

return allocationRows.map(
  row => ({
    ...row,
    allocation:
      (
        (
          Number(
            row.allocation
          )
          ||
          0
        )
        /
        total
      )
      *
      100
  })
);
```

},

calculateBlendedAssumptions(allocationRows) {

```
const normalized =
  this.normalizeAllocation(
    allocationRows
  );

const result = normalized.reduce(
  (
    totals,
    asset
  ) => {

    const weight =
      (
        Number(
          asset.allocation
        )
        ||
        0
      )
      /
      100;

    totals.totalReturn +=
      weight
      *
      (
        Number(
          asset.totalReturn
        )
        ||
        0
      );

    totals.incomeYield +=
      weight
      *
      (
        Number(
          asset.incomeYield
        )
        ||
        0
      );

    totals.appreciationReturn +=
      weight
      *
      (
        Number(
          asset.appreciationReturn
        )
        ||
        0
      );

    totals.expenseRatio +=
      weight
      *
      (
        Number(
          asset.expenseRatio
        )
        ||
        0
      );

    totals.turnoverRate +=
      weight
      *
      (
        Number(
          asset.turnoverRate
        )
        ||
        0
      );

    return totals;

  },
  {
    totalReturn: 0,
    incomeYield: 0,
    appreciationReturn: 0,
    expenseRatio: 0,
    turnoverRate: 0
  }
);

return result;
```

}

});

/*
Validation
*/

(function validateAssetDataset() {

const dataset =
window.WEALTHSCOPE_ASSETS;

if (!dataset) {

```
throw new Error(
  "WealthScope asset dataset failed to initialize."
);
```

}

const assets =
Object.values(
dataset.catalog
);

if (assets.length < 10) {

```
throw new Error(
  "The WealthScope asset catalog is incomplete."
);
```

}

for (
const asset
of assets
) {

```
const requiredTextFields = [
  "id",
  "name",
  "category",
  "taxType",
  "riskLevel",
  "liquidity",
  "color"
];

for (
  const field
  of requiredTextFields
) {

  if (!asset[field]) {

    throw new Error(
      `Asset ${asset.id || "unknown"} is missing ${field}.`
    );

  }

}

const requiredNumberFields = [
  "totalReturn",
  "incomeYield",
  "appreciationReturn",
  "expenseRatio",
  "turnoverRate"
];

for (
  const field
  of requiredNumberFields
) {

  if (
    !Number.isFinite(
      asset[field]
    )
  ) {

    throw new Error(
      `Asset ${asset.name} has an invalid ${field}.`
    );

  }

}

if (
  !dataset
  .taxTypes[
    asset.taxType
  ]
) {

  throw new Error(
    `Asset ${asset.name} uses an unknown tax type.`
  );

}
```

}

for (
const profile
of Object.values(
dataset.riskProfiles
)
) {

```
const total =
  Object
  .values(
    profile.allocations
  )
  .reduce(
    (
      sum,
      allocation
    ) =>
      sum + allocation,
    0
  );

if (
  Math.abs(
    total - 100
  ) > 0.001
) {

  throw new Error(
    `Risk profile ${profile.name} totals ${total}% instead of 100%.`
  );

}

for (
  const assetId
  of Object.keys(
    profile.allocations
  )
) {

  if (
    !dataset
    .catalog[
      assetId
    ]
  ) {

    throw new Error(
      `Risk profile ${profile.name} references unknown asset ${assetId}.`
    );

  }

}
```

}

console.info(
"WealthScope asset assumptions loaded successfully."
);

})();
