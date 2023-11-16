import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/login';
import { AuthContext } from '../AuthContext';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const mockAuth = {
  token: null,
  setToken: jest.fn(),
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
afterEach(cleanup);
describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  it('renders cancel button', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('triggers onClick when cancel clicked', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('has two TextField components', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    const emailField = screen.getByLabelText('Email Address *');
    const passwordField = screen.getByLabelText('Password *');
    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
  });

  it('renders Login button', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Login />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});