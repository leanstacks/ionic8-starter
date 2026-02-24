import { IonRange, RangeCustomEvent } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import { PropsWithTestId } from '../types';

/**
 * Properties for the `RangeInput` component.
 * @param {string} name - The field `name` attribute value.
 * @see {@link PropsWithTestId}
 * @see {@link IonRange}
 */
interface RangeInputProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonRange> {
  name: string;
}

/**
 * The `RangeInput` component renders a standardized `IonRange` which is
 * integrated with Formik.
 *
 * @param {RangeInputProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const RangeInput = ({ className, name, onIonChange, testid = 'input-range', ...rangeProps }: RangeInputProps) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [field, meta, helpers] = useField<number>(name);

  const onChange = async (e: RangeCustomEvent) => {
    await helpers.setValue(e.detail.value as number);
    // add artificial delay to ensure Formik context `values` are updated
    // before proceeding; in rare instances where a form is submitted
    // from a field change event, the delay is needed
    setTimeout(() => {
      onIonChange?.(e);
    }, 100);
  };

  return (
    <IonRange
      className={classNames('ls-range-input', className)}
      onIonChange={onChange}
      data-testid={testid}
      {...field}
      {...rangeProps}
    ></IonRange>
  );
};

export default RangeInput;
