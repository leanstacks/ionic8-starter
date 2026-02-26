import { ComponentPropsWithoutRef } from 'react';
import { CheckboxCustomEvent, IonCheckbox } from '@ionic/react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import './CheckboxInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `CheckboxInput`component.
 * @see {@link PropsWithTestId}
 * @see {@link IonCheckbox}
 */
interface CheckboxInputProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonCheckbox>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `CheckboxInput` component renders a standardized `IonCheckbox` which is
 * integrated with React Hook Form.
 *
 * CheckboxInput supports two types of field values: `boolean` and `string[]`.
 *
 * To create a `boolean` field, use a single `CheckboxInput` within a form and
 * do not use the `value` prop.
 *
 * To create a `string[]` field, use one to many `CheckboxInput` within a form
 * with the same `name` and a unique `value` property.
 *
 * @param {CheckboxInputProps} props - Component properties.
 */
const CheckboxInput = <T extends FieldValues>({
  className,
  control,
  name,
  onIonChange,
  testid = 'input-checkbox',
  ...checkboxProps
}: CheckboxInputProps<T>) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });

  /**
   * Handles changes to the field value as a result of a user action.
   * @param {CheckboxCustomEvent} e - The event.
   */
  const onChange = async (e: CheckboxCustomEvent): Promise<void> => {
    field.onChange(!field.value);
    onIonChange?.(e);
  };

  const errorText: string | undefined = isTouched ? error?.message : undefined;

  return (
    <IonCheckbox
      className={classNames('ls-checkbox-input', className)}
      onIonChange={onChange}
      value={field.value}
      checked={field.value}
      {...checkboxProps}
      errorText={errorText}
      data-testid={testid}
    ></IonCheckbox>
  );
};

export default CheckboxInput;
