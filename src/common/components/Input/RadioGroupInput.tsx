import { ComponentPropsWithoutRef } from 'react';
import { IonRadioGroup, IonText, RadioGroupCustomEvent } from '@ionic/react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';

import './RadioGroupInput.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `RadioGroupInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonRadioGroup}
 */
interface RadioGroupInputProps<T extends FieldValues>
  extends PropsWithTestId, Omit<ComponentPropsWithoutRef<typeof IonRadioGroup>, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `RadioGroupInput` component renders a standardized `IonRadioGroup` which
 * is integrated with React Hook Form.
 *
 * Use one to many `IonRadio` components as the `children` to specify the
 * available options.
 *
 * @param {RadioGroupInputProps} props - Component properties.
 */
const RadioGroupInput = <T extends FieldValues>({
  className,
  control,
  name,
  onIonChange,
  testid = 'input-radiogroup',
  ...radioGroupProps
}: RadioGroupInputProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  /**
   * Handles changes to the field value as a result of user action.
   * @param {RadioGroupCustomEvent} event - The event
   */
  const onChange = async (event: RadioGroupCustomEvent): Promise<void> => {
    field.onChange(event.detail.value);
    onIonChange?.(event);
  };

  return (
    <div className="ls-radiogroup-input ls-radiogroup-input--expand-full" data-testid={`${testid}-wrapper`}>
      <IonRadioGroup
        className={classNames('ls-radiogroup-input__radiogroup', className)}
        onIonChange={onChange}
        {...radioGroupProps}
        {...field}
        data-testid={testid}
      />
      {!!error && (
        <IonText className="ls-radiogroup-input__error" color="danger" data-testid={`${testid}-error`}>
          {error.message}
        </IonText>
      )}
    </div>
  );
};

export default RadioGroupInput;
