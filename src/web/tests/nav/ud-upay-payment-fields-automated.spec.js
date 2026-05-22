// === FILE: src/tests/nav/ud-upay-payment-fields-automated.spec.js ===
/**
 * Automated spec for ED-79: Validate Payment Page Fields
 *
 * AC1 (parsed from description):
 *   Given user is on "UD Loans by UnionDigital Bank Payment Page"
 *   (https://loans.uniondigitalbank.io/LoanPayment/UPay)
 *   Then "Loan Number" and "Payment Amount" text boxes are displayed
 *
 * AC2 (parsed from description):
 *   Given user is on "UD Loans by UnionDigital Bank Payment Page"
 *   Then "UD Loans by UnionDigital Bank Payment Page" text should be displayed
 *
 * TestRail: C286, C331
 */

const { test, expect } = require('../../../shared/fixtures');
const UdUpayPaymentPage = require('../../pages/ud-upay-payment.page');
const TD = require('../../../shared/data/test-data');

test.describe('[UI] ED-79: Validate Payment Page Fields', { tag: ['@smoke', '@regression'] }, () => {
  let paymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new UdUpayPaymentPage(page);
    await paymentPage.gotoUpayForm();
  });

  test('[C286] Test Case 1: Verify Loan Number and Payment Amount text boxes are displayed on UD Loans Payment Page', async ({ page }) => {
    // Assert — on the correct UPay form URL
    await expect(page).toHaveURL(TD.urlPatterns.loanPaymentUPay, { timeout: 15000 });

    // Assert — "Loan Number" text box is visible
    const loanNumberInput = await paymentPage.getLoanNumberInput();
    await expect(loanNumberInput).toBeVisible();

    // Assert — "Payment Amount" text box is visible
    const paymentAmountInput = await paymentPage.getPaymentAmountInput();
    await expect(paymentAmountInput).toBeVisible();
  });

  test('[C331] Test Case 2: Verify UD Loans by UnionDigital Bank Payment Page heading text is displayed', async ({ page }) => {
    // Assert — on the correct UPay form URL
    await expect(page).toHaveURL(TD.urlPatterns.loanPaymentUPay, { timeout: 15000 });

    // Assert — page heading text is visible
    const heading = await paymentPage.getUdLoansPaymentPageHeading();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(TD.upayPaymentPage.pageHeading);
  });
});

