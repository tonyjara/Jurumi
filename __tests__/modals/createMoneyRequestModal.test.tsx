// import CreateMoneyRequestModal from '@/components/Modals/MoneyRequest.create.modal';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Signin from '../../pages/index';
import '@testing-library/jest-dom';
import CreateMoneyRequestModal from '../../components/Modals/MoneyRequest.create.modal';

it.only('create moneyRequest test', async () => {
  render(
    <CreateMoneyRequestModal
      isOpen={true}
      onClose={() => {}}
      orgId="asdfasdf"
    />
  );

  // render(<Signin />);
  // expect(screen.getByTestId('forms:email')).tobeInTheDocument();

  // userEvent.type(screen.getByTestId('forms:email'), 'conceptooooo');
});
