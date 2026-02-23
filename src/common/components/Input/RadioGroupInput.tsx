import { ComponentPropsWithoutRef } from 'react';
import { IonRadioGroup, IonText, RadioGroupCustomEvent } from '@ionic/react';
import { useField } from 'formik';
import classNames from 'classnames';

import './RadioGroupInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `RadioGroupInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonRadioGroup}
 */
interface RadioGroupInputProps
  extends
    PropsWithTestId,
    Omit<ComponentPropsWithoutRef<typeof IonRadioGroup>, 'name'>,
    Required<Pick<ComponentPropsWithoutRef<typeof IonRadioGroup>, 'name'>> {}

/**
 * The `RadioGroupInput` component renders a standardized `IonRadioGroup` which
 * is integrated with Formik.
 *
 * Use one to many `IonRadio` components as the `children` to specify the
 * available options.
 *
 * @param {RadioGroupInputProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const RadioGroupInput = ({
  className,
  name,
  onIonChange,
  testid = 'input-radiogroup',
  ...radioGroupProps
}: RadioGroupInputProps) => {
  const [field, meta, helpers] = useField({ name });

  /**
   * Handles changes to the field value as a result of user action.
   * @param {RadioGroupCustomEvent} event - The event
   */
  const onChange = async (event: RadioGroupCustomEvent): Promise<void> => {
    await helpers.setValue(event.detail.value);
    await helpers.setTouched(true);
    onIonChange?.(event);
  };

  return (
    <div className="ls-radiogroup-input ls-radiogroup-input--expand-full" data-testid={`${testid}-wrapper`}>
      <IonRadioGroup
        className={classNames('ls-radiogroup-input__radiogroup', className)}
        data-testid={testid}
        onIonChange={onChange}
        {...field}
        {...radioGroupProps}
      />
      {!!meta.error && (
        <IonText className="ls-radiogroup-input__error" color="danger" data-testid={`${testid}-error`}>
          {meta.error}
        </IonText>
      )}
    </div>
  );
};

export default RadioGroupInput;
