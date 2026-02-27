import { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { ModalCustomEvent } from '@ionic/core';
import { DatetimeCustomEvent, IonButton, IonDatetime, IonInput, IonModal } from '@ionic/react';
import { Control, FieldPath, FieldValues, useController } from 'react-hook-form';
import classNames from 'classnames';
import dayjs from 'dayjs';

import './DateInput.scss';
import { PropsWithTestId } from '../types';
import Icon from '../Icon/Icon';

/**
 * Default `IonDatetime` `formatOptions` for the date. May be overridden by
 * supplying a `formatOptions` property. Controls how the date is displayed
 * in the form input.
 * @see {@link IonDatetime}
 */
const DEFAULT_FORMAT_DATE: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

/**
 * `DateValue` describes the possible types of an `IonDatetime` whose `presentation`
 * is 'date'.
 */
type DateValue = string | null;

/**
 * Properties for the `DateInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonDatetime}
 * @see {@link IonInput}
 * @see {@link IonModal}
 */
interface DateInputProps<T extends FieldValues>
  extends
    PropsWithTestId,
    Pick<ComponentPropsWithoutRef<typeof IonInput>, 'label' | 'labelPlacement'>,
    Pick<ComponentPropsWithoutRef<typeof IonModal>, 'onIonModalDidDismiss'>,
    Omit<ComponentPropsWithoutRef<typeof IonDatetime>, 'multiple' | 'name' | 'presentation'> {
  control: Control<T>;
  name: FieldPath<T>;
}

/**
 * The `DateInput` component renders an `IonDatetime` which is integrated with
 * React Hook Form. The form field value is displayed in an `IonInput`. When that input
 * is clicked, an `IonDatetime` is presented within an `IonModal`.
 *
 * Use this component when you need to collect a date value within a form. The
 * date value will be set as an ISO8601 date, e.g. YYYY-MM-DD
 *
 * @param {DateInputProps} props - Component properties.
 */
const DateInput = <T extends FieldValues>({
  className,
  control,
  name,
  label,
  labelPlacement,
  onIonModalDidDismiss,
  testid = 'input-date',
  ...datetimeProps
}: DateInputProps<T>) => {
  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // populate error text only if the field has been touched and has an error
  const errorText: string | undefined = isTouched ? error?.message : undefined;

  /**
   * Handle change events emitted by `IonDatetime`.
   * @param {DatetimeCustomEvent} e - The event.
   */
  const onChange = async (e: DatetimeCustomEvent): Promise<void> => {
    const value = e.detail.value as DateValue;
    if (value) {
      const isoDate = dayjs(value).format('YYYY-MM-DD');
      field.onChange(isoDate);
    } else {
      field.onChange(null);
    }
    datetimeProps.onIonChange?.(e);
  };

  /**
   * Handle 'did dismiss' events emitted by `IonModal`.
   */
  const onDidDismiss = async (e: ModalCustomEvent): Promise<void> => {
    field.onBlur();
    setIsOpen(false);
    onIonModalDidDismiss?.(e);
  };

  // format the value to display in the IonInput
  // use UTC so that local timezone offset does not change the date
  const inputValue = useMemo(() => {
    if (field.value) {
      const dateOptions: Intl.DateTimeFormatOptions = {
        ...(datetimeProps.formatOptions?.date ?? DEFAULT_FORMAT_DATE),
        timeZone: 'UTC',
      };

      return Intl.DateTimeFormat(undefined, dateOptions).format(new Date(field.value));
    } else {
      return '';
    }
  }, [datetimeProps.formatOptions, field.value]);

  // format the value for the IonDatetime. it must be a local ISO date or null/undefined
  const datetimeValue = useMemo(() => {
    return field.value ? dayjs(field.value).format('YYYY-MM-DD[T]HH:mm') : null;
  }, [field.value]);

  return (
    <>
      <IonInput
        className={classNames(
          'ls-date-input',
          className,
          { 'ion-touched': isTouched },
          { 'ion-invalid': error },
          { 'ion-valid': isTouched && !error },
        )}
        data-testid={testid}
        disabled={datetimeProps.disabled}
        errorText={errorText}
        label={label}
        labelPlacement={labelPlacement}
        onFocus={() => setIsOpen(true)}
        readonly
        value={inputValue}
      >
        <IonButton
          aria-hidden="true"
          data-testid={`${testid}-button-calendar`}
          disabled={datetimeProps.disabled}
          fill="clear"
          onClick={() => setIsOpen(true)}
          slot="end"
        >
          <Icon icon="calendar" />
        </IonButton>
      </IonInput>

      <IonModal
        className="ls-date-input-modal"
        data-testid={`${testid}-modal`}
        isOpen={isOpen}
        onIonModalDidDismiss={onDidDismiss}
      >
        <IonDatetime
          {...datetimeProps}
          data-testid={`${testid}-datetime`}
          multiple={false}
          onIonChange={onChange}
          presentation="date"
          value={datetimeValue}
        ></IonDatetime>
      </IonModal>
    </>
  );
};

export default DateInput;
