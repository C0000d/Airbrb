import * as Cypress from 'cypress'

describe('happy path', () => {
  it('navigate to homepage', () => {
    cy.visit('localhost:3000/');
    cy.wait(5000)
    cy.url().should('include', 'localhost:3000')
    cy.wait(2000)
  });

  it('successfully register', () => {
    cy.visit('localhost:3000/register');
    cy.wait(5000)
    cy.url().should('include', 'localhost:3000/register');
    cy.wait(2000)
    const name = '6080';
    const email  = '6080@gmail.com';
    const password = '6080';
    const checkPassword = '6080';
    cy.get('[data-cy="register-email-input"]').type(email);
    cy.get('[data-cy="register-password-input"]').type(password);
    cy.get('[data-cy="register-checkpassword-input"]').type(checkPassword);
    cy.get('[data-cy="register-name-input"]').type(name);
    cy.wait(2000)
    cy.get('[data-cy="register-submit-button"]').click();
    cy.wait(5000)
    cy.url().should('include', 'localhost:3000/dashboard');
  });

  it ('Successfully create a new listing ', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.wait(5000)
    cy.get('[data-cy="Create-list-btn"]').click();
    cy.wait(5000)
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
    cy.wait(1000)
    cy.get('[data-cy="create-list-Submit"]').click();
    cy.wait(5000)
  });

  it ('Successfully edit a listing title and add a youtube video url', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.wait(5000)
    cy.contains('Edit').click()
    cy.wait(5000)
    const title = 'Unsw new title'
    const video = 'https://youtu.be/8peKcSEDFB4?si=7zuOjAmkg31cQF8s'
    cy.get('[data-cy="edit-list-title"]').type('{selectall}{backspace}').type(title);
    cy.get('[data-cy="edit-list-video"]').type('{selectall}{backspace}').type(video);
    cy.wait(5000)
    cy.get('[data-cy="edit-list-Submit"]').click();
    cy.wait(5000)
  });

  it ('Successfully publish a listing', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.wait(5000)
    cy.contains('Publish').click()
    cy.wait(2000)
    cy.get('.MuiIconButton-root').eq(1).click();
    cy.wait(2000)
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.wait(2000)
    cy.get('.MuiIconButton-root').eq(2).click();
    cy.wait(2000)
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.wait(2000)
    cy.contains('Submit').click()
    cy.wait(5000)
  });

  it ('Successfully unpublish a listing', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.wait(6000)
    cy.contains('unPublish').click()
    cy.wait(5000)
  });

  it ('Successfully logout', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.wait(5000)
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(2000)
    cy.contains('Logout').click();
    cy.wait(2000)
  });

  it ('Successfully login', () => {
    cy.visit('localhost:3000/login');
    cy.wait(5000)
    const email = '6080@gmail.com';
    const password = '6080';
    cy.get('[data-cy="login-email-input"]').type(email);
    cy.get('[data-cy="login-password-input"]').type(password);
    cy.wait(1500)
    cy.get('[data-cy="login-submit-btn"]').click();
    cy.wait(5000)
  });

  it ('go to delete a listing and logout', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(2000)
    cy.contains('Hosted Listings').click();
    cy.wait(3000)
    cy.contains('Delete').click();
    cy.wait(3000)
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(3000)
    cy.contains('Logout').click();
    cy.wait(3000)
  });

  after(() => {
    cy.clearLocalStorage();
  });
})
