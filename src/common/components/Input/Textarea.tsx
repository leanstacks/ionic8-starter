import { IonTextarea, TextareaCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `Textarea` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonTextarea}
 */
interface TextareaProps
  extends
    PropsWithTestId,
    Omit<ComponentPropsWithoutRef<typeof IonTextarea>, 'name'>,
    Required<Pick<ComponentPropsWithoutRef<typeof IonTextarea>, 'name'>> {}

/**
 * The `Textarea` component renders a standardized `IonTextarea` which is
 * integrated with Formik.
 *
 * Optionally accepts a forwarded `ref` which allows the parent to manipulate
 * the textarea, performing actions programmatically such as giving focus.
 *
 * @param {TextareaProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const Textarea = forwardRef<HTMLIonTextareaElement, TextareaProps>(
  ({ className, onIonInput, testid = 'textarea', ...textareaProps }: TextareaProps, ref) => {
    const [field, meta, helpers] = useField(textareaProps.name);

    /**
     * Handle changes to the textarea's value. Updates the Formik field state.
     * Calls the supplied `onIonInput` props function if one was provided.
     * @param {TextareaCustomEvent} e - The event.
     */
    const onInput = async (e: TextareaCustomEvent) => {
      await helpers.setValue(e.detail.value);
      onIonInput?.(e);
    };

    return (
      <IonTextarea
        className={classNames(
          'ls-textarea',
          className,
          { 'ion-touched': meta.touched },
          { 'ion-invalid': meta.error },
          { 'ion-valid': meta.touched && !meta.error },
        )}
        onIonInput={onInput}
        data-testid={testid}
        {...field}
        {...textareaProps}
        errorText={meta.error}
        ref={ref}
      ></IonTextarea>
    );
  },
);
Textarea.displayName = 'Textarea';

export default Textarea;
