// @ts-check
const { expect } = require('@playwright/test');
const faker = require('faker');

exports.RegisterDevPage = class RegisterDevPage {

  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.linkRegister = page.getByRole('link', { name: 'Register' });
    this.titleRegister = page.getByRole('heading', { name: 'Register' });
    this.btnRedioMale = page.getByLabel('Male', { exact: true });
    this.inputFirstName = page.getByLabel('First name:');
    this.inputLastName = page.getByLabel('Last name:');
    this.inputBirthDay = page.locator('select[name="DateOfBirthDay"]');
    this.inputBirthMonth = page.locator('select[name="DateOfBirthMonth"]');
    this.inputBirthYear = page.locator('select[name="DateOfBirthYear"]');
    this.inputEmail = page.getByLabel('Email:');
    this.inputCompanyName = page.getByLabel('Company name:');
    this.checkBoxNewsletter = page.getByLabel('Newsletter:')
    this.inputPassowrd = page.getByLabel('Password:', { exact: true })
    this.inputConfirmPassword = page.getByLabel('Confirm password:')
    this.btnSubmitRegister = page.getByRole('button', { name: 'Register' })
    this.fieldOutPassword = page.getByText('Password: * Confirm password')
    this.fieldOutEmail = page.locator('div').filter({ hasText: 'US DollarEuroRegisterLog in' })
  }

    async goToRegistrationPage() {
        await this.linkRegister.click();
        await expect(this.titleRegister).toBeVisible();
    }

    async fillRegistrationForm(email) {
        const password = faker.internet.password();

        await this.btnRedioMale.check();
        await this.inputFirstName.fill(faker.name.firstName());
        await this.inputLastName.fill(faker.name.lastName());
        await this.inputBirthDay.selectOption('1');
        await this.inputBirthMonth.selectOption('7');
        await this.inputBirthYear.selectOption('1985');
        await expect(this.inputBirthDay).toContainText('1');
        await expect(this.inputBirthMonth).toContainText('July');
        await expect(this.inputBirthYear).toContainText('1985');
        await this.inputEmail.fill(email);
        await this.inputCompanyName.fill(faker.company.companyName());
        await this.checkBoxNewsletter.uncheck();
        await this.inputPassowrd.fill(password);
        await this.inputConfirmPassword.fill(password);
        await this.btnSubmitRegister.click();
    }
    async clickButtonSubmitRegister() {
        const element = this.btnSubmitRegister
        await element.scrollIntoViewIfNeeded();
        await element.click();
    }

    async  getErrorLocator(page, fieldId) {
        return await page.locator(`#${fieldId}-error`);
    }

    async  fillPasswordInvalid(password) {
        await this.inputPassowrd.fill(password);
        await this.fieldOutPassword.click();
    }

    async  fillEmailInvalid(email) {
        await this.inputEmail.fill(email);
        await this.fieldOutEmail.first().click();
    }
}