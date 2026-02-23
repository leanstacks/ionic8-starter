import { ComponentPropsWithoutRef, useMemo, useState } from 'react';
import { ModalCustomEvent } from '@ionic/core';
import { DatetimeCustomEvent, IonButton, IonDatetime, IonInput, IonModal } from '@ionic/react';
import { useField } from 'formik';
import classNames from 'classnames';
import dayjs from 'dayjs';

import './DatetimeInput.scss';
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
 * Default `IonDatetime` `formatOptions` for the time. May be overridden by
 * supplying a `formatOptions` property. Controls how the time is displayed
 * in the form input.
 * @see {@link IonDatetime}
 */
const DEFAULT_FORMAT_TIME: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
};

/**
 * `DatetimeValue` describes the possible types of an `IonDatetime` whose `presentation`
 * is 'date-time'.
 */
type DatetimeValue = string | null;

/**
 * Properties for the `DatetimeInput` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonDatetime}
 * @see {@link IonInput}
 * @see {@link IonModal}
 */
interface DatetimeInputProps
  extends
    PropsWithTestId,
    Pick<ComponentPropsWithoutRef<typeof IonInput>, 'label' | 'labelPlacement'>,
    Pick<ComponentPropsWithoutRef<typeof IonModal>, 'onIonModalDidDismiss'>,
    Omit<ComponentPropsWithoutRef<typeof IonDatetime>, 'multiple' | 'name' | 'presentation'>,
    Required<Pick<ComponentPropsWithoutRef<typeof IonDatetime>, 'name'>> {}

/**
 * The `DatetimeInput` component renders an `IonDatetime` which is integrated with
 * Formik. The form field value is displayed in an `IonInput`. When that input
 * is clicked, an `IonDatetime` is presented within an `IonModal`.
 *
 * Use this component when you need to collect a date and time, a timestamp,
 * value within a form. The value will be set as an ISO8601 timestamp.
 *
 * @param {DateInputProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const DatetimeInput = ({
  className,
  label,
  labelPlacement,
  onIonModalDidDismiss,
  testid = 'input-datetime',
  ...datetimeProps
}: DatetimeInputProps) => {
  const [field, meta, helpers] = useField<DatetimeValue>(datetimeProps.name);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // populate error text only if the field has been touched and has an error
  const errorText: string | undefined = meta.touched ? meta.error : undefined;

  /**
   * Handle change events emitted by `IonDatetime`.
   * @param {DatetimeCustomEvent} e - The event.
   */
  const onChange = async (e: DatetimeCustomEvent): Promise<void> => {
    const value = e.detail.value as DatetimeValue;
    if (value) {
      const isoDate = dayjs(value).toISOString();
      await helpers.setValue(isoDate, true);
    } else {
      await helpers.setValue(null, true);
    }
    datetimeProps.onIonChange?.(e);
  };

  /**
   * Handle 'did dismiss' events emitted by `IonModal`.
   */
  const onDidDismiss = async (e: ModalCustomEvent): Promise<void> => {
    await helpers.setTouched(true, true);
    setIsOpen(false);
    onIonModalDidDismiss?.(e);
  };

  // format the value to display in the IonInput
  const inputValue = useMemo(() => {
    if (field.value) {
      const date = new Intl.DateTimeFormat(undefined, datetimeProps.formatOptions?.date ?? DEFAULT_FORMAT_DATE).format(
        new Date(field.value),
      );
      const time = new Intl.DateTimeFormat(undefined, datetimeProps.formatOptions?.time ?? DEFAULT_FORMAT_TIME).format(
        new Date(field.value),
      );

      return `${date} ${time}`;
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
          'ls-datetime-input',
          className,
          { 'ion-touched': meta.touched },
          { 'ion-invalid': meta.error },
          { 'ion-valid': meta.touched && !meta.error },
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
        className="ls-datetime-input-modal"
        data-testid={`${testid}-modal`}
        isOpen={isOpen}
        onIonModalDidDismiss={onDidDismiss}
      >
        <IonDatetime
          {...datetimeProps}
          data-testid={`${testid}-datetime`}
          multiple={false}
          onIonChange={onChange}
          presentation="date-time"
          value={datetimeValue}
        ></IonDatetime>
      </IonModal>
    </>
  );
};

export default DatetimeInput;
