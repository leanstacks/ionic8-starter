import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { render, screen } from 'test/test-utils';

import DateInput from '../DateInput';

const TestForm = ({ initialValue = '', onSubmit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DateInput control={control} name="testField" testid="input" />
    </form>
  );
};

describe('DateInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input');

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
  });

  it('should display initial value', async () => {
    // ARRANGE
    render(<TestForm initialValue="2024-01-01" />);
    await screen.findByTestId('input-button-calendar');

    // ACT
    await userEvent.click(screen.getByTestId('input-button-calendar'));

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
    expect(screen.getByTestId('input')).toHaveValue('Jan 1, 2024');
    expect(screen.getByTestId('input-datetime')).toBeDefined();
    expect(screen.getByTestId('input-datetime')).toHaveValue('2024-01-01T00:00');
  });
});
