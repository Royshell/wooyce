const appDefaultSate = {
  personal: {},
  income: {},
  assets: {},
  debts: {}
}; 

export default (state = appDefaultSate, action) => {
  switch (action.type) {
    case 'ADD_PERSONAL_DATA': 
      return {
        ...state, 
        personal: action.personal
      };
    case 'ADD_INCOME_DATA': 
      return {
        ...state, 
        income: action.income
      }; 
    case 'ADD_ASSETS_DATA': 
      return {
        ...state, 
        assets: action.assets
      }; 
    case 'ADD_DEBTS_DATA': 
      return {
        ...state, 
        debts: action.debts
      };       
    default: 
      return state;
  }
};