// @ts-check
const { test, expect } = require('@playwright/test');
const { RegisterDevPage } = require('../page/registerDevPage');
const faker = require('faker');


test.beforeEach(async ({ page }) => {
  const playwrightDev = new RegisterDevPage(page);


  await test.step('Given the user is on the registration page of website nopcommerce', async () => {
    await page.goto('/');
    await playwrightDev.goToRegistrationPage()
  });
});


test.describe('Registration', async () => {
  const email = faker.internet.email();

  test('Successful registration', async ({ page }) => {
    await test.step('When the user submits the necessary information for their registration', async () => {
      const playwrightDev = new RegisterDevPage(page);

      await playwrightDev.fillRegistrationForm(email)
    });
    await test.step('Then the registration should be successfully created', async() => {
      const playwrightDev = new RegisterDevPage(page);

      await expect(page.getByText('Your registration completed')).toBeVisible();
    });
  });

  test('User attempts to register with an already registered email', async ({ page }) => {
    await test.step('When the user tries to register with an email that is already registered in the system', async () => {
      const playwrightDev = new RegisterDevPage(page);

      await playwrightDev.fillRegistrationForm('novoteste@mkdir.com');
      await playwrightDev.goToRegistrationPage()
      await playwrightDev.fillRegistrationForm('novoteste@mkdir.com');
    });
    await test.step('Then the system should prevent the creation of the registration and display a message indicating the duplicate email', async () => {
      await expect(page.getByText('The specified email already exists')).toBeVisible();
    });
  });

  test('User attempts to register without fill the fields required', async ({ page }) => {
    await test.step('When the user tries to register without fill the fields required', async () => {
      const playwrightDev = new RegisterDevPage(page);

      await playwrightDev.clickButtonSubmitRegister();
    });
    await test.step('Then the system should prevent the creation of the registration and display a message indicating fields required', async () => {
      const playwrightDev = new RegisterDevPage(page);

      const expectedErrorMessages = {
        'FirstName': 'First name is required.',
        'LastName': 'Last name is required.',
        'Email': 'Email is required.',
        'Password': 'Password is required.',
      };
      for (const [fieldId, expectedErrorMessage] of Object.entries(expectedErrorMessages)) {
        const errorLocator = await playwrightDev.getErrorLocator(page, fieldId);
        await expect(errorLocator).toContainText(expectedErrorMessage);
      }
    });
  })

  test('User attempts to register with a invalid password', async ({ page }) => {
    await test.step('When the user tries to register with a invalid password', async () => {
      const playwrightDev = new RegisterDevPage(page);
      await playwrightDev.fillPasswordInvalid('1')
    });
    await test.step('Then the system should prevent the creation of the registration and display a message indicating the invalid password', async () => {
      const playwrightDev = new RegisterDevPage(page);

      const expectedErrorMessages = {'Password': 'must have at least 6 characters',};
      for (const [fieldId, expectedErrorMessage] of Object.entries(expectedErrorMessages)) {
        const errorLocator = await playwrightDev.getErrorLocator(page, fieldId);
        await expect(errorLocator).toContainText(expectedErrorMessage);
      }
    });
  });

  test('User attempts to register with a invalid email', async ({ page }) => {
    await test.step('When the user tries to register with a invalid email', async () => {
      const playwrightDev = new RegisterDevPage(page);

      await playwrightDev.fillEmailInvalid('234.com')
    });
    await test.step('Then the system should prevent the creation of the registration and display a message indicating the invalid email', async () => {
      const playwrightDev = new RegisterDevPage(page);

      const expectedErrorMessages = {'Email': 'Wrong email',};
      for (const [fieldId, expectedErrorMessage] of Object.entries(expectedErrorMessages)) {
        const errorLocator = await playwrightDev.getErrorLocator(page, fieldId);
        await expect(errorLocator).toContainText(expectedErrorMessage);
      }
    });
  });
 
});




