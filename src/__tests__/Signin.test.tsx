import { screen, render } from '@testing-library/react';
import type { Session } from 'next-auth';
import Signin from '../pages/index';
// import { customRender } from './wrappers/CustomRender';

describe('tests signin page', () => {
  // it('Does stuff', () => {
  //   render(<Signin />);
  //   const headingElement = screen.getByRole('button', { name: 'index' });
  //   expect(headingElement).toBeInTheDocument();
  // });
  it('Works', async () => {
    const mockSession: Session = {
      expires: '1',
      user: { email: 'asdf@asdf.com', id: '2' },
    };

    (client as jest.Mock).mockReturnValueOnce([mockSession, false]);

    render(<Signin />);

    const headingElement = screen.getByRole('heading', { name: 'Ingresar' });

    expect(headingElement).toBeInTheDocument();
  });
});
