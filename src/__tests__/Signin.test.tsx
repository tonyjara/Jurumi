import { render, screen } from '@testing-library/react';
import Signin from '../pages/index';
import { ThemeWrapper } from './wrappers/AppWrapper';

describe('tests signin page', () => {
  it('Does stuff', () => {
    render(<Signin />, { wrapper: ThemeWrapper });
    const headingElement = screen.getByRole('button', { name: 'index' });
    expect(headingElement).toBeInTheDocument();
  });
});
