import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { render, screen } from 'test/test-utils';

import ToggleInput from '../ToggleInput';

const TestForm = ({ initialValue = false, onSubmit = (_values: { testField: boolean }) => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToggleInput control={control} name="testField" />
    </form>
  );
};

describe('ToggleInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input-toggle');

    // ASSERT
    expect(screen.getByTestId('input-toggle')).toBeDefined();
  });

  it.skip('should change value', async () => {
    // ARRANGE
    let value = false;
    const handleSubmit = (values: { testField: boolean }) => {
      value = values.testField;
    };
    render(<TestForm onSubmit={handleSubmit} />);
    await screen.findByTestId('input-toggle');

    // ACT
    await userEvent.click(screen.getByTestId('input-toggle'));

    // ASSERT
    expect(screen.getByTestId('input-toggle')).toBeDefined();
    expect(value).toBe(true);
  });
});
