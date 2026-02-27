import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TextareaCustomEvent } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { render, screen } from 'test/test-utils';

import Textarea from '../Textarea';

const TestForm = ({ initialValue = '', onSubmit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      testField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea control={control} name="testField" label="Field" />
    </form>
  );
};

const TestFormWithValidation = ({ initialValue = '', onSubmit = () => {} }) => {
  const schema = z.object({
    testField: z.string().max(5, { message: 'too long' }),
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
      <Textarea control={control} name="testField" label="Field" />
    </form>
  );
};

describe('Textarea', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('textarea');

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
  });

  it('should change value when typing', async () => {
    // ARRANGE
    const value = 'hello';
    render(<TestForm />);
    await screen.findByLabelText('Field');

    // ACT
    await userEvent.type(screen.getByLabelText('Field'), value);

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
    expect(screen.getByTestId('textarea')).toHaveValue(value);
  });

  it.skip('should call supplied input change function', async () => {
    // ARRANGE
    const value = 'hello';
    let enteredValue: string | null | undefined = '';
    const onInput = (e: TextareaCustomEvent) => {
      enteredValue = e.detail.value;
    };
    const { control } = useForm({
      defaultValues: {
        testField: '',
      },
    });

    render(
      <form>
        <Textarea control={control} name="testField" label="Field" onIonInput={onInput} />
      </form>,
    );
    await screen.findByLabelText('Field');

    // ACT
    await userEvent.type(screen.getByLabelText('Field'), value);

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
    expect(screen.getByTestId('textarea')).toHaveValue(value);
    expect(enteredValue).toBe(value);
  });

  it('should display error text', async () => {
    // ARRANGE
    const value = 'hello there';
    render(<TestFormWithValidation />);
    const textareaField = await screen.findByLabelText('Field');

    // ACT
    await userEvent.type(textareaField, value);
    await userEvent.tab();
    await screen.findByText('too long');

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
    expect(screen.getByTestId('textarea')).toHaveValue(value);
    expect(screen.getByText('too long')).toBeDefined();
  });
});
