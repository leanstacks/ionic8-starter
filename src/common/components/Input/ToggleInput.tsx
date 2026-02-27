import { IonToggle, ToggleChangeEventDetail, ToggleCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `ToggleInput` component.
 * @param {string} name - The field `name` attribute value.
 * @see {@link PropsWithTestId}
 * @see {@link IonToggle}
 */
interface ToggleInputProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonToggle>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `ToggleInput` component renders a standardized `IonToggle` which is
 * integrated with React Hook Form.
 *
 * @param {ToggleInputProps} props - Component properties.
 */
const ToggleInput = <T extends FieldValues>({
  className,
  control,
  name,
  onIonChange,
  testid = 'input-toggle',
  ...toggleProps
}: ToggleInputProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  const onChange = async (e: ToggleCustomEvent<ToggleChangeEventDetail>) => {
    field.onChange(e.detail.checked);
    onIonChange?.(e);
  };

  return (
    <IonToggle
      className={classNames('ls-toggle-input', className)}
      checked={field.value}
      onIonChange={onChange}
      {...toggleProps}
      data-testid={testid}
    />
  );
};

export default ToggleInput;
