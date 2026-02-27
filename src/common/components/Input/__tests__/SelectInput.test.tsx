import { describe, expect, it } from 'vitest';
import { IonSelectOption } from '@ionic/react';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from 'test/test-utils';

import SelectInput from '../SelectInput';

const TestForm = ({ initialValue = '', onSubmit = (_values: { selectInput: string }) => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selectInput: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectInput control={control} name="selectInput" interface="popover" testid="input">
        <IonSelectOption value="a">Alpha</IonSelectOption>
        <IonSelectOption value="b">Bravo</IonSelectOption>
      </SelectInput>
    </form>
  );
};

describe('SelectInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input');

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
  });

  it.skip('should change value', async () => {
    // ARRANGE
    const value = 'a';
    let submittedValue = '';
    const handleSubmit = (values: { selectInput: string }) => {
      submittedValue = values.selectInput;
    };
    render(<TestForm initialValue={value} onSubmit={handleSubmit} />);
    await screen.findByTestId('input');

    // ACT
    // open the select
    await userEvent.click(screen.getByTestId('input'));
    await waitFor(() => expect(screen.getAllByRole('radio').length).toBe(2));
    // select the second option
    await userEvent.click(screen.getAllByRole('radio')[1]);
    await waitFor(() => expect(submittedValue).toBe('b'));

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
    expect(submittedValue).toBe('b');
  });
});
