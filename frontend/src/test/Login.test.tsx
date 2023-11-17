import React, { ReactNode, ReactElement } from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Login from '../components/login';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from '@mui/material';

interface LoginProps {
  email: string;
  password: string;
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const props_one: LoginProps = {
  email: 'selinajiang321@gmail.com',
  password: "123",
};

// Create a mock for AuthContext
const mockSetToken = jest.fn();
const mockAuthContext = {
  token: null,
  setToken: mockSetToken,
};

const mockContext = {
  token: 'mockToken',
  setToken: jest.fn(),
};

jest.mock('../AuthContext', () => {
  return {
    __esModule: true,
    default: {
      Consumer: (props: { children: (value: AuthContextType) => ReactNode }) => props.children(mockAuthContext),
      Provider: ({ children }: AuthProviderProps) => <div>{children}</div>,
    },
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

afterEach(cleanup);

describe('Login', () => {
  // Define any helper functions with TypeScript types
  const noop = (): void => {};

  it('render Login correctly', () => {
    const login = shallow(<Login />);
    expect(toJson(login)).toMatchSnapshot();
  });

  it('render Login Button correctly', () => {
    const wrapper = shallow(<Login />);
    const logInDom = (
      <Typography component='h1' variant='h5'>
        Log In
      </Typography>
    );
    expect(wrapper.contains(logInDom)).toEqual(true);
  });

  test('TextField component should exists.', () => {
    expect(TextField).toBeDefined();
  });

  it('renders a button with submit button type if nothing is provided', () => {
    const button = shallow(
      <Button onClick={noop} type='submit' />
    );
    expect(toJson(button)).toMatchSnapshot();
  });

  it('has one button component', () => {
    const button = shallow(<Login />);
    expect(button.find(Button)).toHaveLength(1);
  });

  it('has two TextField components', () => {
    const textField = shallow(<Login />);
    expect(textField.find(TextField)).toHaveLength(2);
  });

  it('has a link inside a grid box to register', () => {
    const loginPage = shallow(<Login />);
    expect(loginPage.find(Grid)).toHaveLength(2);
  });

  it('renders the login form correctly', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(Box)).toHaveLength(1);
    expect(wrapper.find(TextField)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(2);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('allows user to input email and password', () => {
    const { getByLabelText } = render(<Login />);
  
    const emailInput = getByLabelText('Email Address *') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  
    const passwordInput = getByLabelText('Password *') as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

});