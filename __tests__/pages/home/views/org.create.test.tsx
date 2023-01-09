import userEvent from '@testing-library/user-event';
import CreateOrgModal from '../../../../components/Modals/org.create.modal';
import { authenticateAdmindMock } from '../../../TestUtils/MockNextAuth';
import { render } from '../../../TestUtils/Test-utils';

jest.mock('next-auth/react');

const user = userEvent.setup(); // always at the start of a file

test('Org create modal', async () => {
  authenticateAdmindMock();
  const onSubmit = jest.fn();
  //   const Component = trpcClient.withTRPC(CreateOrgModal);
  const { getByRole, getByLabelText } = render(
    <CreateOrgModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />
  );

  const nameInput = getByRole('textbox', {
    name: /nombre de su organización/i,
  });
  const saveButton = getByRole('button', {
    name: /guardar/i,
  });

  await user.type(nameInput, 'La org');
  // await user.type(passwordInput, 'asdfasdf');

  await user.click(saveButton);

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ displayName: 'La org' }),
    expect.anything()
  );

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
