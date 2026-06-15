/**
 * State Tax Data for 2026
 * Contains state tax methods, rates, and special treatments
 */

window.WEALTHSCOPE_STATES_2026 = {
  defaultStateCode: "GA",
  
  taxMethods: {
    none: { name: "No state income tax" },
    limited: { name: "Limited income tax (capital gains only)" },
    standard: { name: "Standard income tax" }
  },
  
  modelStatuses: {
    full: { name: "Full model (all features)" },
    basic: { name: "Basic model (simplified)" },
    estimated: { name: "Estimated values" }
  },
  
  capitalGainTreatments: {
    taxed: { name: "Taxed as ordinary income" },
    preferred: { name: "Preferential rate" },
    exempt: { name: "Exempt from state tax" }
  }
};

window.WEALTHSCOPE_STATE_HELPERS = {
  getSortedStateList: function() {
    return [
      { code: "AL", name: "Alabama" },
      { code: "AK", name: "Alaska" },
      { code: "AZ", name: "Arizona" },
      { code: "AR", name: "Arkansas" },
      { code: "CA", name: "California" },
      { code: "CO", name: "Colorado" },
      { code: "CT", name: "Connecticut" },
      { code: "DE", name: "Delaware" },
      { code: "FL", name: "Florida" },
      { code: "GA", name: "Georgia" },
      { code: "HI", name: "Hawaii" },
      { code: "ID", name: "Idaho" },
      { code: "IL", name: "Illinois" },
      { code: "IN", name: "Indiana" },
      { code: "IA", name: "Iowa" },
      { code: "KS", name: "Kansas" },
      { code: "KY", name: "Kentucky" },
      { code: "LA", name: "Louisiana" },
      { code: "ME", name: "Maine" },
      { code: "MD", name: "Maryland" },
      { code: "MA", name: "Massachusetts" },
      { code: "MI", name: "Michigan" },
      { code: "MN", name: "Minnesota" },
      { code: "MS", name: "Mississippi" },
      { code: "MO", name: "Missouri" },
      { code: "MT", name: "Montana" },
      { code: "NE", name: "Nebraska" },
      { code: "NV", name: "Nevada" },
      { code: "NH", name: "New Hampshire" },
      { code: "NJ", name: "New Jersey" },
      { code: "NM", name: "New Mexico" },
      { code: "NY", name: "New York" },
      { code: "NC", name: "North Carolina" },
      { code: "ND", name: "North Dakota" },
      { code: "OH", name: "Ohio" },
      { code: "OK", name: "Oklahoma" },
      { code: "OR", name: "Oregon" },
      { code: "PA", name: "Pennsylvania" },
      { code: "RI", name: "Rhode Island" },
      { code: "SC", name: "South Carolina" },
      { code: "SD", name: "South Dakota" },
      { code: "TN", name: "Tennessee" },
      { code: "TX", name: "Texas" },
      { code: "UT", name: "Utah" },
      { code: "VT", name: "Vermont" },
      { code: "VA", name: "Virginia" },
      { code: "WA", name: "Washington" },
      { code: "WV", name: "West Virginia" },
      { code: "WI", name: "Wisconsin" },
      { code: "WY", name: "Wyoming" }
    ];
  },
  
  getStateByCode: function(code) {
    const states = this.getSortedStateList();
    return states.find(s => s.code === code) || null;
  }
};

// Extended state data with tax rates
window.WEALTHSCOPE_STATES_2026.states = {
  GA: {
    code: "GA",
    name: "Georgia",
    taxMethod: "standard",
    planningRate: 0.055,
    capitalGainTreatment: "taxed",
    modelStatus: "full",
    localIncomeTaxPossible: false,
    treasuryInterestStateExempt: false,
    standardDeductionEstimate: 4100,
    explanation: "Georgia taxes all income types at standard rates."
  },
  TX: {
    code: "TX",
    name: "Texas",
    taxMethod: "none",
    planningRate: 0.0,
    capitalGainTreatment: "exempt",
    modelStatus: "full",
    localIncomeTaxPossible: false,
    treasuryInterestStateExempt: true,
    standardDeductionEstimate: 0,
    explanation: "Texas has no state income tax."
  },
  FL: {
    code: "FL",
    name: "Florida",
    taxMethod: "none",
    planningRate: 0.0,
    capitalGainTreatment: "exempt",
    modelStatus: "full",
    localIncomeTaxPossible: false,
    treasuryInterestStateExempt: true,
    standardDeductionEstimate: 0,
    explanation: "Florida has no state income tax."
  },
  WA: {
    code: "WA",
    name: "Washington",
    taxMethod: "limited",
    planningRate: 0.07,
    capitalGainTreatment: "preferred",
    modelStatus: "basic",
    localIncomeTaxPossible: false,
    treasuryInterestStateExempt: true,
    standardDeductionEstimate: 250000,
    explanation: "Washington taxes capital gains from sales of long-term capital assets above $250k."
  },
  CA: {
    code: "CA",
    name: "California",
    taxMethod: "standard",
    planningRate: 0.093,
    capitalGainTreatment: "taxed",
    modelStatus: "full",
    localIncomeTaxPossible: true,
    treasuryInterestStateExempt: false,
    standardDeductionEstimate: 5202,
    explanation: "California has the highest state income tax rate."
  }
};