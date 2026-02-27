import { IonRange, RangeCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `RangeInput` component.
 * @param {string} name - The field `name` attribute value.
 * @see {@link PropsWithTestId}
 * @see {@link IonRange}
 */
interface RangeInputProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonRange>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `RangeInput` component renders a standardized `IonRange` which is
 * integrated with React Hook Form.
 *
 * @param {RangeInputProps} props - Component properties.
 */
const RangeInput = <T extends FieldValues>({
  className,
  control,
  name,
  onIonChange,
  testid = 'input-range',
  ...rangeProps
}: RangeInputProps<T>) => {
  const { field } = useController({
    name,
    control,
  });

  const onChange = async (e: RangeCustomEvent) => {
    field.onChange(e.detail.value);
    onIonChange?.(e);
  };

  return (
    <IonRange
      className={classNames('ls-range-input', className)}
      onIonChange={onChange}
      {...rangeProps}
      {...field}
      data-testid={testid}
    ></IonRange>
  );
};

export default RangeInput;
