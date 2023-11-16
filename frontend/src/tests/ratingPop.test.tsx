import { render, screen, cleanup } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import RatingPopover from '../components/ratingPopover';
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
const myDate = new Date('2023-11-17T12:00:00');
const reviews = [{ user: 'q', rate: 5, comment: 'ausdhf', postOn: myDate }];
const id = 'someId';
// const location = 'someLocation';
afterEach(cleanup);
describe('RatingPopover', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  it('renders card correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <RatingPopover reviews={reviews} id={id} />
        </AuthContext.Provider>
      </Router>
    );
    const cardElement = screen.getByText((content) => {
      return content.includes('global ratings');
    });
    expect(cardElement).toBeInTheDocument();
  });

  it('renders Box correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <RatingPopover reviews={reviews} id={id} />
        </AuthContext.Provider>
      </Router>
    );
    const cardElement = screen.getByText((content) => {
      return content.includes('out of 5');
    });
    expect(cardElement).toBeInTheDocument();
  });

  it('renders Rating component correctly', () => {
    render(
      <Router>
        <AuthContext.Provider value={mockAuth}>
          <RatingPopover reviews={reviews} id={id} />
        </AuthContext.Provider>
      </Router>
    );
    const ratingComponent = screen.getByTestId('custom-rating');
    expect(ratingComponent).toBeInTheDocument();
  });
});
