import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateOrgModal from '../../../../components/Modals/org.create.modal';
import { trpcClient } from '../../../../lib/utils/trpcClient';
import { authenticateAdmindMock } from '../../../TestUtils/MockNextAuth';

jest.mock('next-auth/react');

const user = userEvent.setup(); // always at the start of a file

test('Org create modal', async () => {
  authenticateAdmindMock();
  const onSubmit = jest.fn();
  const Component = trpcClient.withTRPC(CreateOrgModal);
  const { getByRole, getByLabelText } = render(
    <Component
    //  isOpen={true} onClose={() => {}} onSubmit={onSubmit}
    />
  );

  const nameInput = getByRole('textbox', {
    name: /nombre de su organización/i,
  });
  expect(nameInput).toBeInTheDocument();
  // const passwordInput = getByLabelText('Contraseña');
  // const signinButton = getByRole('button', {
  //   name: /ingresar/i,
  // });

  // await user.type(emailInput, 'tony@tony.com');
  // await user.type(passwordInput, 'asdfasdf');

  // await user.click(signinButton);

  // expect(onSubmit).toHaveBeenCalledWith(
  //   {
  //     email: 'tony@tony.com',
  //     password: 'asdfasdf',
  //   },
  //   expect.anything()
  // );

  // expect(onSubmit).toHaveBeenCalledTimes(1);
});
