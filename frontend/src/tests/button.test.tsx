import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/login';
// import React from 'react';
import { AuthContext } from '../AuthContext';
import React, { useContext, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAuth = {
  token: 'fake-token',
  setToken: jest.fn(),
};

describe('Login', () => {
  it('renders button with default title', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    // expect(screen.getByText(/click me!/i)).toBeInTheDocument();
    // screen.debug();
    // screen.logTestingPlaygroundURL();
  });
});