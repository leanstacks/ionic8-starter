import { forwardRef } from 'react';
import { IonInput } from '@ionic/react';
import { Control, FieldValues, useController, FieldPath } from 'react-hook-form';
import classNames from 'classnames';

import { BaseComponentProps } from '../types';

/**
 * Properties for the `Input` component.
 * @see {@link BaseComponentProps}
 * @see {@link IonInput}
 */
interface InputProps<T extends FieldValues>
  extends BaseComponentProps, Omit<React.ComponentPropsWithoutRef<typeof IonInput>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `Input` component renders a standardized `IonInput` which is integrated
 * with React Hook Form.
 *
 * Optionally accepts a forwarded `ref` which allows the parent to manipulate
 * the input, performing actions programmatically such as giving focus.
 *
 * @param {InputProps} props - Component properties.
 * @param {ForwardedRef<HTMLIonInputElement>} [ref] - Optional. A forwarded `ref`.
 */
const InputComponent = <T extends FieldValues>(
  { className, control, name, testid = 'input', ...props }: InputProps<T>,
  ref: React.ForwardedRef<HTMLIonInputElement>,
) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });

  const errorText: string | undefined = isTouched ? error?.message : undefined;

  return (
    <IonInput
      id={props.id || name}
      className={classNames(
        'ls-input',
        className,
        { 'ion-touched': isTouched },
        { 'ion-invalid': error },
        { 'ion-valid': isTouched && !error },
      )}
      {...props}
      {...field}
      errorText={errorText}
      ref={ref}
      data-testid={testid}
    ></IonInput>
  );
};

const Input = forwardRef(InputComponent) as <T extends FieldValues>(
  props: InputProps<T> & { ref?: React.ForwardedRef<HTMLIonInputElement> },
) => React.ReactElement;

export default Input;
