import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageList from '../components/pageList';
import { AuthContext } from '../AuthContext';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
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

class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

(global as any).ResizeObserver = MockResizeObserver;

describe('Menu', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  it('renders Menu component correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
  });

  it('navigate to homepage correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
    const homeLink = screen.getByText(/Homepage/i);
    expect(homeLink).toBeInTheDocument();
    userEvent.click(homeLink);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigate to Hosted Listings page correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
    const Hosted = screen.getByText(/Hosted Listings/i);
    expect(Hosted).toBeInTheDocument();
    userEvent.click(Hosted);
    expect(mockNavigate).toHaveBeenCalledWith('/hostedListing');
  });

  it('navigate to My Bookings page correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
    const Bookings = screen.getByText(/My Bookings/i);
    expect(Bookings).toBeInTheDocument();
    userEvent.click(Bookings);
    expect(mockNavigate).toHaveBeenCalledWith('/myBookings');
  });

  it('logs out and navigates on logout click', async () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
    const logoutLink = screen.getByText(/Logout/i);
    userEvent.click(logoutLink);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
