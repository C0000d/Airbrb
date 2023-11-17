import * as Cypress from 'cypress'

describe('unhappy path', () => {
  it('navigate to homepage', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000')
    cy.wait(1000)
  });

  it ('login with an invalid email', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(1000)
    cy.contains('Login').click();
    cy.wait(1000)
    const email = '1';
    const password = '6080';
    cy.get('[data-cy="login-email-input"]').type(email);
    cy.get('[data-cy="login-password-input"]').type(password);
    cy.wait(1000)
    cy.get('[data-cy="login-submit-btn"]').click();
    cy.wait(1000)
  });

  it ('Then Successfully signs up', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(1000)
    cy.contains('Register').click();
    cy.wait(1000)
    const name = 'xiaoyu';
    const email  = 'dadiaonan@gmail.com';
    const password = 'daye';
    const checkPassword = 'daye';
    cy.get('[data-cy="register-email-input"]').type(email);
    cy.get('[data-cy="register-password-input"]').type(password);
    cy.get('[data-cy="register-checkpassword-input"]').type(checkPassword);
    cy.get('[data-cy="register-name-input"]').type(name);
    cy.get('[data-cy="register-submit-button"]').click();
    cy.wait(2000)
  });

  it ('unSuccessfully create a new listing with empty title ', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(1000)
    cy.contains('Hosted Listings').click();
    cy.wait(1000)
    cy.get('[data-cy="Create-list-btn"]').click();
    cy.wait(1000)
    const address  = '0514 Pitt Street, Sydney';
    const price = '999';
    const type = "house";
    const bathrooms = "4";
    const bedrooms = "4";
    const beds = "5";
    const amenities =  "Parking, swimmming pool";
    
    cy.get('[data-cy="create-list-address"]').type(address);
    cy.get('[data-cy="create-list-price"]').type(price);
    cy.get('[data-cy="create-list-type"]').type(type);
    cy.get('[data-cy="create-list-bathrooms"]').type(bathrooms);
    cy.get('[data-cy="create-list-bedrooms"]').type(bedrooms);
    cy.get('[data-cy="create-list-beds"]').type(beds);
    cy.get('[data-cy="create-list-amenities"]').type(amenities);
    cy.get('[data-cy="create-list-Submit"]').click();
    cy.wait(1000)
  });

  it ('Then add a title and Successfully create a new listing', () => {
    const title  = 'Unsw GO!';
    cy.get('[data-cy="create-list-title"]').type(title);
    cy.wait(1000)
    cy.get('[data-cy="create-list-Submit"]').click();
    cy.wait(1500)
  });

  it ('Successfully add a youtube video url', () => {
    cy.contains('Edit').click()
    const video = 'https://youtu.be/8peKcSEDFB4?si=7zuOjAmkg31cQF8s'
    cy.get('[data-cy="edit-list-video"]').type('{selectall}{backspace}').type(video);
    cy.get('[data-cy="edit-list-Submit"]').click();
    cy.wait(3000)
  });

  it ('Successfully publish a listing', () => {
    // cy.visit('localhost:3000/hostedListing');
    cy.contains('Publish').click()
    cy.wait(1000)
    cy.get('.MuiIconButton-root').eq(1).click();
    cy.wait(1000)
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.wait(1000)
    cy.get('.MuiIconButton-root').eq(2).click();
    cy.wait(1000)
    cy.get('.MuiPickersDay-root').contains('30').click();
    cy.wait(1000)
    cy.contains('Submit').click()
    cy.wait(2000)
  });

  it ('Successfully create another new listing', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.get('[data-cy="Create-list-btn"]').click();
    const title  = 'So Tired!';
    const address  = '0514 NanYuan Street, Yangzhou, China';
    const price = '3629';
    const type = "house";
    const bathrooms = "5";
    const bedrooms = "6";
    const beds = "7";
    const amenities =  "Parking, Garden";
    
    cy.get('[data-cy="create-list-title"]').type(title);
    cy.get('[data-cy="create-list-address"]').type(address);
    cy.get('[data-cy="create-list-price"]').type(price);
    cy.get('[data-cy="create-list-type"]').type(type);
    cy.get('[data-cy="create-list-bathrooms"]').type(bathrooms);
    cy.get('[data-cy="create-list-bedrooms"]').type(bedrooms);
    cy.get('[data-cy="create-list-beds"]').type(beds);
    cy.get('[data-cy="create-list-amenities"]').type(amenities);
    cy.get('[data-cy="create-list-Submit"]').click();
    cy.wait(2000)
  });

  it ('search with no result', () => {
    cy.visit('localhost:3000/hostedListing');
    cy.get('[data-cy="search-list"]').click();
    cy.wait(1000)
    const searchTitle = '000000';
    cy.get('[data-cy="search-title"]').type(searchTitle);
    cy.wait(1000)
    cy.get('[data-cy="search-btn"]').click();
    cy.wait(3000)
  });

  it ('try searching again, and check the detail', () => {
    cy.get('[data-cy="search-list"]').click();
    cy.wait(1000)
    const searchTitle = 'unsw';
    cy.get('[data-cy="search-title"]').type(searchTitle);
    cy.wait(1000)
    cy.get('[data-cy="search-btn"]').click();
    cy.wait(3000)
    cy.get('[data-cy="search-detail"]').click();
    cy.wait(3000)
    cy.contains('Back').click()
    cy.wait(3000)
  });

  it ('logout', () => {
    cy.get('button.MuiIconButton-root[aria-label="account of current user"]').click();
    cy.wait(1000)
    cy.contains('Logout').click();
    cy.wait(3000)
  });
})
