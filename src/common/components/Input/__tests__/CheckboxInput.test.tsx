import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';

import { render, screen, waitFor } from 'test/test-utils';

import CheckboxInput from '../CheckboxInput';

describe('CheckboxInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(
      <Formik initialValues={{ checkboxField: false }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" testid="input">
            MyCheckbox
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    await screen.findByTestId('input');

    // ASSERT
    expect(screen.getByTestId('input')).toBeDefined();
  });

  it('should not be checked', async () => {
    // ARRANGE
    render(
      <Formik initialValues={{ checkboxField: false }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" testid="input">
            MyCheckbox
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    const checkboxElement = await screen.findByTestId('input');

    // ASSERT
    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).not.toBeChecked();
  });

  it('should be checked', async () => {
    // ARRANGE
    render(
      <Formik initialValues={{ checkboxField: true }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" testid="input">
            MyCheckbox
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    const checkboxElement = await screen.findByTestId('input');

    // ASSERT
    expect(checkboxElement).toBeDefined();
    expect(checkboxElement).toBeChecked();
  });

  it('should change boolean value', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <Formik initialValues={{ checkboxField: false }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" testid="input">
            MyCheckbox
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    const checkboxElement = await screen.findByTestId('input');
    expect(checkboxElement).not.toBeChecked();

    // ACT
    await user.click(checkboxElement);

    // ASSERT
    // use waitFor to ensure the state update has been processed before making the assertion
    await waitFor(() => expect(checkboxElement).toBeChecked());
  });

  it('should change array value', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(
      <Formik initialValues={{ checkboxField: [] }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" value="One" testid="one">
            CheckboxOne
          </CheckboxInput>
          <CheckboxInput name="checkboxField" value="Two" testid="two">
            CheckboxTwo
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    const checkboxOne = await screen.findByTestId('one');
    const checkboxTwo = await screen.findByTestId('two');
    expect(checkboxOne).not.toBeChecked();
    expect(checkboxTwo).not.toBeChecked();

    // ACT
    await user.click(screen.getByText('CheckboxOne'));

    // ASSERT
    // use waitFor to ensure the state update has been processed before making the assertion
    await waitFor(() => expect(checkboxOne).toBeChecked());
    expect(checkboxTwo).not.toBeChecked();

    // ACT
    await user.click(screen.getByText('CheckboxOne'));

    // ASSERT
    await waitFor(() => expect(checkboxOne).not.toBeChecked());
    expect(checkboxTwo).not.toBeChecked();
  });

  it.skip('should call onChange function', async () => {
    // ARRANGE
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Formik initialValues={{ checkboxField: false }} onSubmit={() => {}}>
        <Form>
          <CheckboxInput name="checkboxField" onIonChange={onChange} testid="input">
            MyCheckbox
          </CheckboxInput>
        </Form>
      </Formik>,
    );
    await screen.findByText(/MyCheckbox/i);

    // ACT
    await user.click(screen.getByText(/MyCheckbox/i));

    // ASSERT
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('input')).toHaveAttribute('checked', 'true');
  });
});
