// === FILE: src/pages/locators/ud-upay-payment.locators.js ===
/**
 * Locators for the UPAY Loan Payment pages on loans.uniondigitalbank.io.
 *
 * ED-78: Initiate UPAY Payment
 *
 * Pages covered:
 *   Landing:  https://loans.uniondigitalbank.io/LoanPayment
 *   UPay form: https://loans.uniondigitalbank.io/LoanPayment/UPay
 *
 * Selector strategy:
 *   1. Role + accessible name (button)
 *   2. Visible text (heading rendered as generic/div element)
 */

const locators = {
  /**
   * "PAY VIA UPAY NOW" button on the Loan Payment landing page.
   * Located inside the UPAY payment option section.
   */
  payViaUpayNowButton: (page) =>
    page.getByRole('button', { name: 'PAY VIA UPAY NOW' }).first(),

  /**
   * "UD Loans by UnionDigital Bank Payment Page" heading on the UPay form page.
   * Rendered as a generic/div element (not a semantic heading).
   */
  udLoansPaymentPageHeading: (page) =>
    page.getByText('UD Loans by UnionDigital Bank Payment Page', { exact: true }).first(),

  /**
   * "Loan Number" text box on the UPay form page.
   * ID ends with "Input_LoanNumber" — OutSystems-generated prefix may vary.
   *
   * ED-79: Validate Payment Page Fields
   */
  loanNumberInput: (page) =>
    page.locator('[id$="Input_LoanNumber"]').first(),

  /**
   * "Payment Amount" text box on the UPay form page.
   * ID ends with "Input_PaymentAmount" — OutSystems-generated prefix may vary.
   *
   * ED-79: Validate Payment Page Fields
   */
  paymentAmountInput: (page) =>
    page.locator('[id$="Input_PaymentAmount"]').first(),
};

module.exports = locators;
