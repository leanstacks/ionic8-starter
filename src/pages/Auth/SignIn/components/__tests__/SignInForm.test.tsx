import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { UseMutationResult } from '@tanstack/react-query';

import { render, screen } from 'test/test-utils';
import * as UseSignIn from 'pages/Auth/SignIn/api/useSignIn';
import { User } from 'common/models/user';

import SignInForm from '../SignInForm';

describe('SignInForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render successfully', async () => {
    // ARRANGE
    render(<SignInForm />);
    await screen.findByTestId('form-signin');

    // ASSERT
    expect(screen.getByTestId('form-signin')).toBeDefined();
  });

  it('should submit the form', async () => {
    // ARRANGE
    const mockSignIn = vi.fn();
    const useSignInSpy = vi.spyOn(UseSignIn, 'useSignIn');
    useSignInSpy.mockReturnValue({
      mutate: mockSignIn,
    } as unknown as UseMutationResult<User, Error, string, unknown>);
    render(<SignInForm testid="form" />);
    await screen.findByLabelText('Username');

    // ACT
    await userEvent.type(screen.getByLabelText('Username'), 'Bret');
    await userEvent.type(screen.getByLabelText('Password'), 'a');
    await userEvent.click(screen.getByTestId('form-button-submit'));

    // ASSERT
    expect(screen.getByTestId('form')).toBeDefined();
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should display error', async () => {
    render(<SignInForm testid="form" />);
    await screen.findByLabelText('Username');

    // ACT
    await userEvent.type(screen.getByLabelText('Username'), 'Unknown');
    await userEvent.type(screen.getByLabelText('Password'), 'a');
    await userEvent.click(screen.getByTestId('form-button-submit'));

    // ASSERT
    expect(screen.getByTestId('form-error')).toBeDefined();
  });
});
