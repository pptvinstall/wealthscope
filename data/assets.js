/**
 * Asset Data and Investment Allocation Profiles
 * Contains asset definitions and allocation templates
 */

window.WEALTHSCOPE_ASSETS = {
  defaultAllocationProfile: "balanced",
  
  assets: [
    {
      id: "us-large-cap-equity",
      name: "U.S. Large Cap Stocks",
      shortName: "Large Cap",
      category: "Equities",
      totalReturn: 0.09,
      incomeYield: 0.018,
      expenseRatio: 0.005,
      taxType: "qualifiedDividend",
      isCustom: false,
      color: "#65E4B1"
    },
    {
      id: "us-mid-cap-equity",
      name: "U.S. Mid Cap Stocks",
      shortName: "Mid Cap",
      category: "Equities",
      totalReturn: 0.095,
      incomeYield: 0.015,
      expenseRatio: 0.008,
      taxType: "qualifiedDividend",
      isCustom: false,
      color: "#79AAFF"
    },
    {
      id: "us-small-cap-equity",
      name: "U.S. Small Cap Stocks",
      shortName: "Small Cap",
      category: "Equities",
      totalReturn: 0.10,
      incomeYield: 0.01,
      expenseRatio: 0.012,
      taxType: "qualifiedDividend",
      isCustom: false,
      color: "#FFCA70"
    },
    {
      id: "international-equity",
      name: "International Stocks",
      shortName: "Intl Stock",
      category: "Equities",
      totalReturn: 0.085,
      incomeYield: 0.025,
      expenseRatio: 0.010,
      taxType: "qualifiedDividend",
      isCustom: false,
      color: "#B295FF"
    },
    {
      id: "bonds-aggregate",
      name: "Investment Grade Bonds",
      shortName: "Bonds",
      category: "Fixed Income",
      totalReturn: 0.045,
      incomeYield: 0.045,
      expenseRatio: 0.003,
      taxType: "ordinary",
      isCustom: false,
      color: "#65D8EF"
    },
    {
      id: "treasury-bonds",
      name: "U.S. Treasury Bonds",
      shortName: "Treasuries",
      category: "Fixed Income",
      totalReturn: 0.040,
      incomeYield: 0.040,
      expenseRatio: 0.002,
      taxType: "treasuryInterest",
      isCustom: false,
      color: "#FF8293"
    },
    {
      id: "municipal-bonds",
      name: "Municipal Bonds",
      shortName: "Muni Bonds",
      category: "Fixed Income",
      totalReturn: 0.035,
      incomeYield: 0.035,
      expenseRatio: 0.003,
      taxType: "municipalInterest",
      isCustom: false,
      color: "#92D36E"
    },
    {
      id: "reits",
      name: "Real Estate Investment Trusts",
      shortName: "REITs",
      category: "Alternative",
      totalReturn: 0.075,
      incomeYield: 0.045,
      expenseRatio: 0.015,
      taxType: "reitDistribution",
      isCustom: false,
      color: "#FFB36D"
    },
    {
      id: "cash-equivalent",
      name: "Cash Equivalents",
      shortName: "Cash",
      category: "Cash",
      totalReturn: 0.045,
      incomeYield: 0.045,
      expenseRatio: 0.0,
      taxType: "ordinary",
      isCustom: false,
      color: "#5F91F5"
    }
  ]
};

window.WEALTHSCOPE_ASSET_HELPERS = {
  createAllocationFromProfile: function(profileId) {
    const profiles = {
      capitalPreservation: [
        { id: "cash-equivalent", allocation: 40 },
        { id: "treasury-bonds", allocation: 40 },
        { id: "bonds-aggregate", allocation: 20 }
      ],
      conservative: [
        { id: "bonds-aggregate", allocation: 50 },
        { id: "us-large-cap-equity", allocation: 30 },
        { id: "cash-equivalent", allocation: 20 }
      ],
      balanced: [
        { id: "us-large-cap-equity", allocation: 40 },
        { id: "international-equity", allocation: 15 },
        { id: "bonds-aggregate", allocation: 35 },
        { id: "cash-equivalent", allocation: 10 }
      ],
      growth: [
        { id: "us-large-cap-equity", allocation: 45 },
        { id: "international-equity", allocation: 20 },
        { id: "us-mid-cap-equity", allocation: 15 },
        { id: "bonds-aggregate", allocation: 15 },
        { id: "reits", allocation: 5 }
      ],
      aggressive: [
        { id: "us-large-cap-equity", allocation: 40 },
        { id: "international-equity", allocation: 25 },
        { id: "us-mid-cap-equity", allocation: 15 },
        { id: "us-small-cap-equity", allocation: 10 },
        { id: "reits", allocation: 10 }
      ]
    };
    
    const template = profiles[profileId] || profiles.balanced;
    return template.map(item => {
      const asset = window.WEALTHSCOPE_ASSETS.assets.find(a => a.id === item.id);
      return { ...asset, allocation: item.allocation };
    });
  },
  
  normalizeAllocation: function(rows) {
    const total = this.getAllocationTotal(rows);
    if (total === 0) return rows;
    
    return rows.map(row => ({
      ...row,
      allocation: (row.allocation / total) * 100
    }));
  },
  
  getAllocationTotal: function(rows) {
    return rows.reduce((sum, row) => sum + (row.allocation || 0), 0);
  },
  
  calculateBlendedAssumptions: function(rows) {
    const total = this.getAllocationTotal(rows);
    if (total === 0) {
      return { totalReturn: 0.07, incomeYield: 0.025, expenseRatio: 0.005 };
    }
    
    const normalized = rows.map(row => ({
      ...row,
      weight: (row.allocation || 0) / total
    }));
    
    return {
      totalReturn: normalized.reduce((sum, row) => sum + row.totalReturn * row.weight, 0),
      incomeYield: normalized.reduce((sum, row) => sum + row.incomeYield * row.weight, 0),
      expenseRatio: normalized.reduce((sum, row) => sum + row.expenseRatio * row.weight, 0)
    };
  },
  
  createCustomAsset: function(config) {
    return {
      id: config.id || `custom-${Date.now()}`,
      name: config.name || "Custom Asset",
      shortName: config.name || "Custom",
      category: "Custom",
      allocation: config.allocation || 0,
      totalReturn: config.totalReturn || 0.07,
      incomeYield: config.incomeYield || 0.025,
      expenseRatio: config.expenseRatio || 0.005,
      taxType: config.taxType || "ordinary",
      isCustom: true,
      color: config.color || "#D4E2ED"
    };
  }
};