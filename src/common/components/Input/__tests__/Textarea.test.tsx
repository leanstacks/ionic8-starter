import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TextareaCustomEvent } from '@ionic/react';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';

import { render, screen } from 'test/test-utils';

import Textarea from '../Textarea';

describe('Textarea', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(
      <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
        <Form>
          <Textarea name="testField" />
        </Form>
      </Formik>,
    );
    await screen.findByTestId('textarea');

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
  });

  it('should change value when typing', async () => {
    // ARRANGE
    const value = 'hello';
    render(
      <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
        <Form>
          <Textarea name="testField" label="Field" />
        </Form>
      </Formik>,
    );
    await screen.findByLabelText('Field');

    // ACT
    await userEvent.type(screen.getByLabelText('Field'), value);

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
    expect(screen.getByTestId('textarea')).toHaveValue(value);
  });

  it('should call supplied input change function', async () => {
    // ARRANGE
    const value = 'hello';
    let enteredValue: string | null | undefined = '';
    const onInput = (e: TextareaCustomEvent) => {
      enteredValue = e.detail.value;
    };
    render(
      <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
        <Form>
          <Textarea name="testField" label="Field" onIonInput={onInput} />
        </Form>
      </Formik>,
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
    const value = 'hello';
    const validationSchema = object({
      testField: string().max(4, 'Must be 4 characters or less.'),
    });
    render(
      <Formik initialValues={{ testField: '' }} onSubmit={() => {}} validationSchema={validationSchema}>
        <Form>
          <Textarea name="testField" label="Field" />
        </Form>
      </Formik>,
    );
    const textareaField = await screen.findByLabelText('Field');

    // ACT
    await userEvent.type(textareaField, value);
    await userEvent.tab();
    await screen.findByText('Must be 4 characters or less.');

    // ASSERT
    expect(screen.getByTestId('textarea')).toBeDefined();
    expect(screen.getByTestId('textarea')).toHaveValue(value);
    expect(screen.getByText('Must be 4 characters or less.')).toBeDefined();
  });
});
