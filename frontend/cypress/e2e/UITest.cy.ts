import * as Cypress from 'cypress'

describe('happy path', () => {
  it('navigate to homepage', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000')
  });

  it('successfully register', () => {
    cy.visit('localhost:3000/register');
    cy.url().should('include', 'localhost:3000/register');
    const name = '6080';
    const email  = '6080@gmail.com';
    const password = '6080';
    const checkPassword = '6080';
    cy.get('[data-cy="register-email-input"]').type(email);
    cy.get('[data-cy="register-password-input"]').type(password);
    cy.get('[data-cy="register-checkpassword-input"]').type(checkPassword);
    cy.get('[data-cy="register-name-input"]').type(name);
    cy.get('[data-cy="register-submit-button"]').click();
    cy.url().should('include', 'localhost:3000/dashboard');
  });

  it ('Successfully create a new listing ', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.get('[data-cy="Create-list-btn"]').click();
    const title  = 'Unsw GO!';
    const address  = '0514 Pitt Street, Sydney';
    const price = '999';
    const type = "house";
    const bathrooms = "4";
    const bedrooms = "4";
    const beds = "5";
    const amenities =  "Parking, swimmming pool";
    
    cy.get('[data-cy="create-list-title"]').type(title);
    cy.get('[data-cy="create-list-address"]').type(address);
    cy.get('[data-cy="create-list-price"]').type(price);
    cy.get('[data-cy="create-list-type"]').type(type);
    cy.get('[data-cy="create-list-bathrooms"]').type(bathrooms);
    cy.get('[data-cy="create-list-bedrooms"]').type(bedrooms);
    cy.get('[data-cy="create-list-beds"]').type(beds);
    cy.get('[data-cy="create-list-amenities"]').type(amenities);
    cy.get('[data-cy="create-list-Submit"]').click();
  });

  it ('Successfully edit a listing title', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.contains('Edit').click()
    const title = 'Unsw new title'
    cy.get('[data-cy="edit-list-title"]').type('{selectall}{backspace}').type(title);
    cy.get('[data-cy="edit-list-Submit"]').click();
  });

  it ('Successfully publish a listing', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.contains('Publish').click()
    cy.get('.MuiIconButton-root').eq(1).click();
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.get('.MuiIconButton-root').eq(2).click();
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.contains('Submit').click()
  });

  it ('Successfully unpublish a listing', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.contains('unPublish').click()
  });

  it ('Successfully logout', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.contains('Logout').click();
  });

  it ('Successfully login', () => {
    cy.visit('localhost:3000/login');
    const email = '6080@gmail.com';
    const password = '6080';
    cy.get('[data-cy="login-email-input"]').type(email);
    cy.get('[data-cy="login-password-input"]').type(password);
    cy.get('[data-cy="login-submit-btn"]').click();
  });

  it ('go to delete a listing and logout', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.contains('Hosted Listings').click();
    cy.contains('Delete').click();
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.contains('Logout').click();
  });  
})