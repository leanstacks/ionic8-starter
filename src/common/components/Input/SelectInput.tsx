import { IonSelect, IonText, SelectCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import './SelectInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `SelectInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonSelect}
 */
interface SelectInputProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonSelect>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `SelectInput` component renders a standardized wrapper of the `IonSelect`
 * component which is integrated with React Hook Form.
 *
 * Accepts a collection of `IonSelectOption` components as `children`.
 *
 * @param {SelectInputProps} props - Component properties.
 */
const SelectInput = <T extends FieldValues>({
  className,
  control,
  name,
  onIonChange,
  testid = 'input-select',
  ...selectProps
}: SelectInputProps<T>) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });

  const onChange = async (e: SelectCustomEvent) => {
    field.onChange(e.detail.value);
    onIonChange?.(e);
  };

  return (
    <div className="ls-select-input ls-select-input--expand-full">
      <IonSelect
        className={classNames(
          'ls-select-input__select',
          className,
          { 'ion-touched': isTouched },
          { 'ion-invalid': error },
          { 'ion-valid': isTouched && !error },
        )}
        onIonChange={onChange}
        data-testid={testid}
        {...field}
        {...selectProps}
      ></IonSelect>
      {error && (
        <IonText color="danger" className="ls-select-input__error text-xs font-normal">
          {error.message}
        </IonText>
      )}
    </div>
  );
};

export default SelectInput;
