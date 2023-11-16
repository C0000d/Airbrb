import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Publish from '../components/publishListing';
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
describe('Publish', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  it('renders cancel button', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  it('renders add more button', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );
    expect(screen.getByRole('button', { name: /Add More/i })).toBeInTheDocument();
    expect(screen.getByText(/Add More/i)).toBeInTheDocument();
  });

  it('renders datepicker correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );
    const startDatePicker = screen.getByLabelText('Available From: *');
    const endDatePicker = screen.getByLabelText('Available To: *');
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
  });

  it('adds a new date picker group when "Add More" is clicked', async () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );

    const datePickerButtons = screen.getAllByLabelText('Choose date');

    datePickerButtons.forEach((button) => {
      userEvent.click(button);
      waitFor(() => {
        const targetDates = screen.getAllByText('30', { selector: 'button' });

        targetDates.forEach((targetDate) => {
          userEvent.click(targetDate);
        });
        const startDatePicker = screen.getByTestId('startDatePicker');
        expect(startDatePicker).toHaveLength(2);
      });
    });
  });
  it('triggers onClick when cancel clicked', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <Publish />
        </AuthContext.Provider>
      </Router>
    );
    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});