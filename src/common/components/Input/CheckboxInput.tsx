import { ComponentPropsWithoutRef } from 'react';
import { CheckboxCustomEvent, IonCheckbox } from '@ionic/react';
import { useField } from 'formik';
import classNames from 'classnames';

import './CheckboxInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `CheckboxInput`component.
 * @see {@link PropsWithTestId}
 * @see {@link IonCheckbox}
 */
interface CheckboxInputProps
  extends
    PropsWithTestId,
    Omit<ComponentPropsWithoutRef<typeof IonCheckbox>, 'name'>,
    Required<Pick<ComponentPropsWithoutRef<typeof IonCheckbox>, 'name'>> {}

/**
 * The `CheckboxInput` component renders a standardized `IonCheckbox` which is
 * integrated with Formik.
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
 * @returns {JSX.Element} JSX
 */
const CheckboxInput = ({
  className,
  name,
  onIonChange,
  testid = 'input-checkbox',
  value,
  ...checkboxProps
}: CheckboxInputProps) => {
  const [field, meta, helpers] = useField({
    name,
    type: 'checkbox',
    value,
  });

  /**
   * Handles changes to the field value as a result of a user action.
   * @param {CheckboxCustomEvent} e - The event.
   */
  const onChange = async (e: CheckboxCustomEvent): Promise<void> => {
    if (typeof meta.value === 'boolean') {
      await helpers.setValue(e.detail.checked);
    } else if (Array.isArray(meta.value)) {
      if (e.detail.checked) {
        await helpers.setValue([...meta.value, e.detail.value]);
      } else {
        await helpers.setValue(meta.value.filter((val) => val !== e.detail.value));
      }
    }
    onIonChange?.(e);
  };

  return (
    <IonCheckbox
      className={classNames('ls-checkbox-input', className)}
      data-testid={testid}
      onIonChange={onChange}
      {...field}
      {...checkboxProps}
    ></IonCheckbox>
  );
};

export default CheckboxInput;
