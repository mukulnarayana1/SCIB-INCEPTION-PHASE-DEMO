// === FILE: src/tests/nav/ud-upay-payment-automated.spec.js ===
/**
 * Automated spec for ED-78: Initiate UPAY Payment
 *
 * AC1 (parsed from description):
 *   Given user is on Loan Payment page (https://loans.uniondigitalbank.io/LoanPayment)
 *   When user clicks on "PAY VIA UPAY NOW" button
 *   Then "UD Loans by UnionDigital Bank Payment Page" is displayed
 *
 * TestRail: C254
 */

const { test, expect } = require('../../../shared/fixtures');
const UdUpayPaymentPage = require('../../pages/ud-upay-payment.page');
const TD = require('../../../shared/data/test-data');

test.describe('[UI] ED-78: Initiate UPAY Payment', { tag: ['@smoke', '@regression'] }, () => {
  let paymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new UdUpayPaymentPage(page);
    await paymentPage.goto();
  });

  test('[C254] Test Case 1: Click PAY VIA UPAY NOW and verify UD Loans payment page is displayed', async ({ page }) => {
    // Assert — on the correct Loan Payment landing page
    await expect(page).toHaveURL(TD.urlPatterns.loanPayment, { timeout: 15000 });

    // Act — click the PAY VIA UPAY NOW button
    await paymentPage.clickPayViaUpayNow();

    // Assert — URL navigates to the UPAY form page
    await expect(page).toHaveURL(TD.urlPatterns.loanPaymentUPay, { timeout: 15000 });

    // Assert — "UD Loans by UnionDigital Bank Payment Page" heading is visible
    const heading = await paymentPage.getUdLoansPaymentPageHeading();
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(TD.upayPaymentPage.pageHeading);
  });
});
