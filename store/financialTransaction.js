export const actions = {
  getFinancialTransactions (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('front/get_financial_transactions', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getFinancialTransaction (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('front/get_financial_transaction', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getEUPaymentFinancialTransaction (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('front/get_eupayment_financial_transaction', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  cancelWithdrawalRequest (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('front/cancel_withdrawal_request', params)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }
}
