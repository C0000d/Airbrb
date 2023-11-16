import { render, screen, fireEvent, waitFor, getByText, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageList from '../components/pageList';
import { AuthContext } from '../AuthContext';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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

describe('Search', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  it('renders pagelist component correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
  });
  it('renders search component correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <PageList />
        </AuthContext.Provider>
      </Router>
    );
    const searchInput = screen.getByPlaceholderText('Search…');
    expect(searchInput).toBeInTheDocument();
  });

  test('clicking on search opens the search dialog', () => {
    render(
        <Router>
          <AuthContext.Provider value={mockAuth}>
            <PageList />
          </AuthContext.Provider>
        </Router>
      );
    const searchInput = screen.getByPlaceholderText('Search…');
    fireEvent.click(searchInput);
    const searchDialogTitle = screen.getByText('Search the listings you want...');
    expect(searchDialogTitle).toBeInTheDocument();
  });
});