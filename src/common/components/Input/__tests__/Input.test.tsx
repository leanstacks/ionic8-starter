import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { render, screen } from 'test/test-utils';

import Input from '../Input';

/**
 * Test wrapper component to provide React Hook Form context
 */
const TestForm = ({ initialValue = '', onSubmit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input control={control} name="testField" label="Test Field" />
    </form>
  );
};

describe('Input', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input');

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
  });

  it('should change value when typing', async () => {
    // ARRANGE
    const value = 'hello';
    render(<TestForm />);
    await screen.findByLabelText('Test Field');

    // ACT
    await userEvent.type(screen.getByLabelText('Test Field'), value);

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
    expect(screen.getByTestId('input')).toHaveValue(value);
  });
});
