import { render, waitFor } from '@testing-library/react';
import Home from '../../not-working-pages/index';
import {
  unauthenticatedMock,
  authenticateUserMock,
} from '../TestUtils/MockNextAuth';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

const user = userEvent.setup(); // always at the start of a file

test('Signin submit', async () => {
  unauthenticatedMock();
  const onSubmit = jest.fn();
  const { getByRole, getByLabelText } = render(<Home onSubmit={onSubmit} />);

  const emailInput = getByRole('textbox', {
    name: 'forms:email',
  });
  const passwordInput = getByLabelText('forms:password');
  const signinButton = getByRole('button', {
    name: 'common:buttons.save',
  });

  await user.type(emailInput, 'tony@tony.com');
  await user.type(passwordInput, 'asdfasdf');

  await user.click(signinButton);

  expect(onSubmit).toHaveBeenCalledWith(
    {
      email: 'tony@tony.com',
      password: 'asdfasdf',
    },
    expect.anything()
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
test('Signin email valid', async () => {
  const onSubmit = jest.fn();
  const { getByRole, getByText } = render(<Home onSubmit={onSubmit} />);

  const emailInput = getByRole('textbox', {
    name: 'forms:email',
  });
  const signinButton = getByRole('button', {
    name: 'common:buttons.save',
  });

  await user.type(emailInput, 'tony');
  await user.click(signinButton);

  await waitFor(() => {
    expect(getByText('validation:invalidEmail')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });
});

test('Signin password valid', async () => {
  const onSubmit = jest.fn();
  const { getByRole, getByText, getByLabelText } = render(
    <Home onSubmit={onSubmit} />
  );

  const passwordInput = getByLabelText('forms:email');
  const signinButton = getByRole('button', {
    name: 'common:buttons.save',
  });

  await user.type(passwordInput, 'tony');
  await user.click(signinButton);

  await waitFor(() => {
    expect(getByText('validation:minPassword')).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });
});

test('Authenticate redirect', async () => {
  authenticateUserMock();
  const onSubmit = jest.fn();
  const mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
  } as any;
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  render(<Home onSubmit={onSubmit} />);

  expect(mockRouter.push).toHaveBeenCalledWith('/home');
});
