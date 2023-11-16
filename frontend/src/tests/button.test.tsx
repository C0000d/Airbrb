import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/login';
// import React from 'react';
import { AuthContext } from '../AuthContext';
import React, { useContext, useState } from 'react';

describe('Button', () => {
  // const authContext = useContext(AuthContext);
  it('renders button with default title', () => {
    render(<Login />);
    // expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login-cancel/i })).toBeInTheDocument();
    // expect(screen.getByText(/click me!/i)).toBeInTheDocument();

    // screen.getByRole('');
    // screen.debug();
    // screen.logTestingPlaygroundURL();
  });
})