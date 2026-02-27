import { IonTextarea, TextareaCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `Textarea` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonTextarea}
 */
interface TextareaProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonTextarea>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `Textarea` component renders a standardized `IonTextarea` which is
 * integrated with React Hook Form.
 *
 * Optionally accepts a forwarded `ref` which allows the parent to manipulate
 * the textarea, performing actions programmatically such as giving focus.
 *
 * @param {TextareaProps} props - Component properties.
 */
const TextareaComponent = <T extends FieldValues>(
  { className, control, name, onIonInput, testid = 'textarea', ...textareaProps }: TextareaProps<T>,
  ref: React.ForwardedRef<HTMLIonTextareaElement>,
) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });

  /**
   * Handle changes to the textarea's value. Updates the field state.
   * Calls the supplied `onIonInput` props function if one was provided.
   * @param {TextareaCustomEvent} e - The event.
   */
  const onInput = async (e: TextareaCustomEvent) => {
    field.onChange(e.detail.value);
    onIonInput?.(e);
  };

  return (
    <IonTextarea
      id={textareaProps.id || name}
      className={classNames(
        'ls-textarea',
        className,
        { 'ion-touched': isTouched },
        { 'ion-invalid': error },
        { 'ion-valid': isTouched && !error },
      )}
      onIonInput={onInput}
      {...textareaProps}
      {...field}
      data-testid={testid}
      errorText={error?.message}
      ref={ref}
    ></IonTextarea>
  );
};

const Textarea = forwardRef(TextareaComponent) as <T extends FieldValues>(
  props: TextareaProps<T> & { ref?: React.ForwardedRef<HTMLIonTextareaElement> },
) => React.ReactElement;

export default Textarea;
