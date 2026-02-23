import { IonSelect, IonText, SelectCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import './SelectInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `SelectInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonSelect}
 */
interface SelectInputProps
  extends
    PropsWithTestId,
    Omit<ComponentPropsWithoutRef<typeof IonSelect>, 'name'>,
    Required<Pick<ComponentPropsWithoutRef<typeof IonSelect>, 'name'>> {}

/**
 * The `SelectInput` component renders a standardized wrapper of the `IonSelect`
 * component which is integrated with Formik.
 *
 * Accepts a collection of `IonSelectOption` components as `children`.
 *
 * @param {SelectInputProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const SelectInput = ({ className, name, onIonChange, testid = 'input-select', ...selectProps }: SelectInputProps) => {
  const [field, meta, helpers] = useField(name);

  const onChange = async (e: SelectCustomEvent) => {
    await helpers.setValue(e.detail.value);
    onIonChange?.(e);
  };

  return (
    <div className="ls-select-input ls-select-input--expand-full">
      <IonSelect
        className={classNames(
          'ls-select-input__select',
          className,
          { 'ion-touched': meta.touched },
          { 'ion-invalid': meta.error },
          { 'ion-valid': meta.touched && !meta.error },
        )}
        onIonChange={onChange}
        data-testid={testid}
        {...field}
        {...selectProps}
      ></IonSelect>
      {meta.error && (
        <IonText color="danger" className="ls-select-input__error text-xs font-normal">
          {meta.error}
        </IonText>
      )}
    </div>
  );
};

export default SelectInput;
