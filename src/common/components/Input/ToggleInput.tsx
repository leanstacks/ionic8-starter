import { IonToggle, ToggleChangeEventDetail, ToggleCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `ToggleInput` component.
 * @param {string} name - The field `name` attribute value.
 * @see {@link PropsWithTestId}
 * @see {@link IonToggle}
 */
interface ToggleInputProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonToggle> {
  name: string;
}

/**
 * The `ToggleInput` component renders a standardized `IonToggle` which is
 * integrated with Formik.
 *
 * @param {ToggleInputProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const ToggleInput = ({ className, name, onIonChange, testid = 'input-toggle', ...toggleProps }: ToggleInputProps) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [field, meta, helpers] = useField<boolean>(name);

  const onChange = async (e: ToggleCustomEvent<ToggleChangeEventDetail>) => {
    await helpers.setValue(e.detail.checked);
    onIonChange?.(e);
  };

  return (
    <IonToggle
      className={classNames('ls-toggle-input', className)}
      checked={field.value}
      onIonChange={onChange}
      data-testid={testid}
      {...toggleProps}
    />
  );
};

export default ToggleInput;
