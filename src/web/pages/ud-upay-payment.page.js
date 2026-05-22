// === FILE: src/pages/ud-upay-payment.page.js ===
/**
 * Page object for the UPAY Loan Payment landing page.
 * Target URL: https://loans.uniondigitalbank.io/LoanPayment
 *
 * ED-78: Initiate UPAY Payment
 *   AC1: Given user is on Loan Payment page,
 *        When user clicks on "PAY VIA UPAY NOW" button,
 *        Then "UD Loans by UnionDigital Bank Payment Page" is displayed.
 *
 * ED-79: Validate Payment Page Fields
 *   AC1: Given user is on "UD Loans by UnionDigital Bank Payment Page",
 *        Then "Loan Number" and "Payment Amount" text boxes are displayed.
 *   AC2: Given user is on "UD Loans by UnionDigital Bank Payment Page",
 *        Then "UD Loans by UnionDigital Bank Payment Page" text is displayed.
 */

const BasePage = require('./base.page');
const loc = require('../locators/ud-upay-payment.locators');

const PAGE_URL = 'https://loans.uniondigitalbank.io/LoanPayment';
const UPAY_FORM_URL = 'https://loans.uniondigitalbank.io/LoanPayment/UPay';

class UdUpayPaymentPage extends BasePage {
  /**
   * Navigate directly to the UPAY Loan Payment landing page.
   */
  async goto() {
    await super.goto(PAGE_URL);
  }

  /**
   * Clicks the "PAY VIA UPAY NOW" button on the Loan Payment landing page.
   * Waits for the button to be visible before clicking.
   * After clicking, the page navigates to /LoanPayment/UPay.
   */
  async clickPayViaUpayNow() {
    await loc.payViaUpayNowButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.payViaUpayNowButton(this.page).click();
  }

  /**
   * Returns the "UD Loans by UnionDigital Bank Payment Page" heading element.
   * Only visible after clicking "PAY VIA UPAY NOW" (on the /LoanPayment/UPay page).
   * Waits for it to be visible before returning.
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async getUdLoansPaymentPageHeading() {
    await loc.udLoansPaymentPageHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.udLoansPaymentPageHeading(this.page);
  }

  /**
   * Navigates directly to the UPay form page (/LoanPayment/UPay).
   * Used when the test precondition is already being on the payment form.
   *
   * ED-79: Validate Payment Page Fields
   */
  async gotoUpayForm() {
    await super.goto(UPAY_FORM_URL);
  }

  /**
   * Waits for the "Loan Number" text box and returns it.
   *
   * ED-79: Validate Payment Page Fields
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async getLoanNumberInput() {
    await loc.loanNumberInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.loanNumberInput(this.page);
  }

  /**
   * Waits for the "Payment Amount" text box and returns it.
   *
   * ED-79: Validate Payment Page Fields
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async getPaymentAmountInput() {
    await loc.paymentAmountInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.paymentAmountInput(this.page);
  }
}

module.exports = UdUpayPaymentPage;
