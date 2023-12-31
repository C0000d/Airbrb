import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BookRequest from '../components/bookingRequest';
import { AuthContext } from '../AuthContext';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockAuth = {
  token: 'fake-token',
  setToken: jest.fn(),
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeAll(() => {
  window.alert = jest.fn();
});

afterEach(cleanup);

describe('Request', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('renders request component page correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <BookRequest />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByText(/Listing Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/PostedOn:/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Profits:/i)).toBeInTheDocument();
  });

  it('renders back correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <BookRequest />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });

  it('back onclick correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <BookRequest />
        </AuthContext.Provider>
      </Router>
    );
    const back = screen.getByRole('button', { name: /Back/i });
    userEvent.click(back);
    expect(mockNavigate).toHaveBeenCalledWith('/hostedListing');
  });
});
