import { dispatch } from 'redux-thunk';
export const addPersonalData = (
  {
    age = 0,
    education = '',
  } = {}
) => ({
  type: 'ADD_PERSONAL_DATA',
  personal: {
    age,
    education
  }
});

export const addIcomeData = (
  {
    income = 0, 
    credit = 0
  } = {}
) => ({
  type: 'ADD_INCOME_DATA',
  income: {
    income,
    credit
  }
});

export const addAssetsData = (
  {
    assetsMoney = 0,
    homeOwn = false,
    homeValue = 0,
    carOwn = false,
    carValue = 0
  } = {}
) => ({
  type: 'ADD_ASSETS_DATA',
  assets: {
    assetsMoney,
    homeOwn,
    homeValue,
    carOwn,
    carValue
  }
});

export const addDebtsData = (
  { 
   mortgage,
    autoLoan,
    studentLoan,
    creditCardBalance,
    other
  } = {}
) => ({
  type: 'ADD_DEBTS_DATA',
  debts: {
    mortgage,
    autoLoan,
    studentLoan,
    creditCardBalance,
    other
  }
});

