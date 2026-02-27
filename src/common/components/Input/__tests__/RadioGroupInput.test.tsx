import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { IonRadio } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { render, screen, waitFor } from 'test/test-utils';

import RadioGroupInput from '../RadioGroupInput';

const TestForm = ({ initialValue = '', onSubmit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioGroupInput control={control} name="testField" testid="input">
        <IonRadio value="one">One</IonRadio>
        <IonRadio value="two">Two</IonRadio>
      </RadioGroupInput>
    </form>
  );
};

const TestFormWithValidation = ({ initialValue = '', onSubmit = () => {} }) => {
  const schema = z.object({
    testField: z.string().refine((val) => val === 'three', { message: 'invalid' }),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
    mode: 'all',
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioGroupInput control={control} name="testField" testid="input">
        <IonRadio value="one">One</IonRadio>
        <IonRadio value="two">Two</IonRadio>
      </RadioGroupInput>
      <button type="submit">Submit</button>
    </form>
  );
};

describe('RadioGroupInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input');

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
  });

  it('should should be selected', async () => {
    // ARRANGE
    render(<TestForm initialValue="one" />);
    await screen.findAllByRole('radio');

    // ASSERT
    expect(screen.getByTestId('input')).toHaveAttribute('value', 'one');
    expect(screen.getByText(/One/i)).toHaveClass('radio-checked');
    expect(screen.getByText(/One/i)).toBeChecked();
    expect(screen.getByText(/Two/i)).not.toHaveClass('radio-checked');
    expect(screen.getByText(/Two/i)).not.toBeChecked();
  });

  it.skip('should should change value', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const { control } = useForm({
      defaultValues: {
        testField: 'two',
      },
    });

    render(
      <form>
        <RadioGroupInput control={control} name="testField" onIonChange={mockOnChange} testid="input">
          <IonRadio value="one">One</IonRadio>
          <IonRadio value="two">Two</IonRadio>
        </RadioGroupInput>
      </form>,
    );
    await screen.findAllByRole('radio');
    expect(screen.getByText(/One/i)).not.toHaveClass('radio-checked');

    // ACT
    await user.click(screen.getByText(/One/i));
    await waitFor(() => expect(screen.getByText(/One/i)).toHaveClass('radio-checked'));

    // ASSERT
    expect(screen.getByTestId('input')).toHaveAttribute('value', 'one');
    expect(screen.getByText(/One/i)).toHaveClass('radio-checked');
    expect(screen.getByText(/One/i)).toBeChecked();
    expect(screen.getByText(/Two/i)).not.toHaveClass('radio-checked');
    expect(screen.getByText(/Two/i)).not.toBeChecked();
    expect(mockOnChange).toHaveBeenCalled();
  });

  it.skip('should should display error', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<TestFormWithValidation />);
    await screen.findAllByRole('radio');

    // ACT
    await user.click(screen.getByText(/One/i));
    await user.click(screen.getByText(/Submit/i));
    await waitFor(() => expect(screen.queryByTestId('input-error')).toBeDefined());

    // ASSERT
    expect(screen.getByTestId('input-error')).toBeDefined();
    expect(screen.getByText(/invalid/i)).toBeDefined();
  });
});
