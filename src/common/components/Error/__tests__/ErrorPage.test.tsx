import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ZodError, ZodIssue } from 'zod';
import { AxiosError } from 'axios';

import { render, screen } from 'test/test-utils';

import ErrorPage from '../ErrorPage';

describe('ErrorPage', () => {
  it('should render successfully', async () => {
    // ARRANGE
    const error = new Error('error message');
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
  });

  it('should display ValidationError', async () => {
    // ARRANGE
    const issues: ZodIssue[] = [
      {
        code: 'custom',
        message: 'Required.',
        path: ['field1'],
      },
      {
        code: 'custom',
        message: 'Max length is 100.',
        path: ['field2'],
      },
    ];
    const error = new ZodError(issues);
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/Validation Error/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/field1.*Required/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/field2.*Max length is 100/i);
  });

  it('should display AxiosError', async () => {
    // ARRANGE
    const config = {
      url: 'http://www.example.org/',
    };
    // @ts-expect-error Only need partial object for test
    const error = new AxiosError('error message', AxiosError.ERR_BAD_REQUEST, config);
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/^ERR_BAD_REQUEST$/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/^error message. http:\/\/www.example.org\/$/i);
  });

  it('should display AxiosError with status code', async () => {
    // ARRANGE
    const config = {
      url: 'http://www.example.org/',
    };
    // @ts-expect-error Only need partial object for test
    const error = new AxiosError('error message', AxiosError.ERR_BAD_REQUEST, config, config, {
      status: 404,
    });
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/^404$/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/^error message. http:\/\/www.example.org\/$/i);
  });

  it('should display Error', async () => {
    // ARRANGE
    const error = new Error('error message');
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/^Error$/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/^error message$/i);
  });

  it('should display Error name', async () => {
    // ARRANGE
    const error = new Error('error message');
    error.name = 'SpecificError';
    const mockReset = vi.fn();
    render(<ErrorPage error={error} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/^SpecificError$/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/^error message$/i);
  });

  it('should display plain error', async () => {
    // ARRANGE
    const mockReset = vi.fn();
    render(<ErrorPage error={'error message'} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error');

    // ASSERT
    expect(screen.getByTestId('page-error')).toBeDefined();
    expect(screen.getByTestId('page-error-title')).toHaveTextContent(/^Error$/i);
    expect(screen.getByTestId('page-error-message')).toHaveTextContent(/^error message$/i);
  });

  it('should attempt to reset clicking page body button', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockReset = vi.fn();
    render(<ErrorPage error={'error message'} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error-button');

    // ACT
    await user.click(screen.getByTestId('page-error-button'));

    // ASSERT
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should attempt to reset clicking footer button', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockReset = vi.fn();
    render(<ErrorPage error={'error message'} resetErrorBoundary={mockReset} />);
    await screen.findByTestId('page-error-footer-button');

    // ACT
    await user.click(screen.getByTestId('page-error-footer-button'));

    // ASSERT
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
