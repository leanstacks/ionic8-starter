import { IonItem, IonLabel, IonListHeader, IonRadio, IonSelectOption } from '@ionic/react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import orderBy from 'lodash/orderBy';
import map from 'lodash/map';
import { useTranslation } from 'react-i18next';

import './SettingsForm.scss';
import storage from 'common/utils/storage';
import { BaseComponentProps } from 'common/components/types';
import { LANGUAGES, StorageKey } from 'common/utils/constants';
import { Settings } from 'common/models/settings';
import { useGetSettings } from 'common/api/useGetSettings';
import { useUpdateSettings } from 'common/api/useUpdateSettings';
import { useProgress } from 'common/hooks/useProgress';
import { useToasts } from 'common/hooks/useToasts';
import { DismissButton } from 'common/components/Toast/Toast';
import ToggleInput from 'common/components/Input/ToggleInput';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';
import List from 'common/components/List/List';
import RangeInput from 'common/components/Input/RangeInput';
import Icon from 'common/components/Icon/Icon';
import SelectInput from 'common/components/Input/SelectInput';
import RadioGroupInput from 'common/components/Input/RadioGroupInput';

/**
 * Settings form values.
 * @see {@link Settings}
 */
type SettingsFormValues = Pick<Settings, 'allowNotifications' | 'brightness' | 'fontSize' | 'language'>;

/**
 * The `SettingsForm` component renders a form to edit user settings.
 * @param {BaseComponentProps} props - Component properties.
 */
const SettingsForm = ({ className, testid = 'form-settings' }: BaseComponentProps) => {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings } = useUpdateSettings();
  const { setProgress } = useProgress();
  const { createToast } = useToasts();
  const { i18n, t } = useTranslation();

  /**
   * Settings form validation schema.
   */
  const settingsFormSchema = z.object({
    allowNotifications: z.boolean(),
    brightness: z.number().min(0).max(100),
    fontSize: z
      .string()
      .optional()
      .default('default')
      .refine((value) => ['smaller', 'default', 'larger'].includes(value), {
        message: t('validation.oneOf', { values: ['smaller', 'default', 'larger'].join(', ') }),
      }),
    language: z.enum(map(LANGUAGES, 'code') as [string, ...string[]], {
      message: t('validation.oneOf', { values: map(LANGUAGES, 'code').join(', ') }),
    }),
  });

  const { control, formState, handleSubmit } = useForm<SettingsFormValues>({
    defaultValues: {
      allowNotifications: settings?.allowNotifications ?? false,
      brightness: settings?.brightness ?? 50,
      fontSize: settings?.fontSize ?? 'default',
      language: settings?.language ?? 'en',
    },
    resolver: zodResolver(settingsFormSchema),
  });

  const onFormSubmit = (values: SettingsFormValues) => {
    setProgress(true);
    updateSettings(
      { settings: values },
      {
        onSuccess: (settings) => {
          createToast({
            message: t('settings.update-success', { ns: 'account' }),
            duration: 3000,
            buttons: [DismissButton()],
          });
          // store the preferred language for i18n language detection
          storage.setItem(StorageKey.Language, settings.language);
          i18n.changeLanguage(settings.language);
        },
        onError: () => {
          createToast({
            message: t('settings.unable-to-update', { ns: 'account' }),
            buttons: [DismissButton()],
            color: 'danger',
          });
        },
        onSettled: () => {
          setProgress(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className={classNames('ls-settings-form', className)} data-testid={`${testid}-loading`}>
        <List>
          <IonListHeader>
            <IonLabel>{t('settings.settings', { ns: 'account' })}</IonLabel>
          </IonListHeader>

          <IonItem>
            <LoaderSkeleton animated heightStyle="1.25rem" />
          </IonItem>
          <IonItem>
            <LoaderSkeleton animated heightStyle="1.25rem" />
          </IonItem>
          <IonItem>
            <LoaderSkeleton animated heightStyle="1.25rem" />
          </IonItem>
          <IonItem lines="none">
            <LoaderSkeleton animated heightStyle="1.25rem" />
          </IonItem>
          <IonItem>
            <div style={{ width: '100%' }}>
              <LoaderSkeleton animated heightStyle="1rem" className="ion-margin-bottom" />
              <LoaderSkeleton animated heightStyle="1.25rem" className="ion-margin-bottom" />
              <LoaderSkeleton animated heightStyle="1.5rem" className="ion-margin-bottom" />
            </div>
          </IonItem>
        </List>
      </div>
    );
  }

  if (settings) {
    return (
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        data-testid={testid}
        className={classNames('ls-settings-form', className)}
      >
        <List>
          <IonListHeader>
            <IonLabel>{t('settings.settings', { ns: 'account' })}</IonLabel>
          </IonListHeader>

          <IonItem className="text-sm font-medium">
            <ToggleInput
              control={control}
              name="allowNotifications"
              disabled={formState.isSubmitting}
              onIonChange={() => handleSubmit(onFormSubmit)()}
              testid={`${testid}-field-allowNotifications`}
            >
              {t('settings.label.notifications', { ns: 'account' })}
            </ToggleInput>
          </IonItem>

          <IonItem className="text-sm font-medium">
            <RangeInput
              control={control}
              name="brightness"
              label={t('settings.label.brightness', { ns: 'account' })}
              labelPlacement="start"
              disabled={formState.isSubmitting}
              onIonChange={() => handleSubmit(onFormSubmit)()}
              testid={`${testid}-field-brightness`}
            >
              <Icon icon="minus" slot="start" />
              <Icon icon="plus" slot="end" />
            </RangeInput>
          </IonItem>

          <IonItem className="text-sm font-medium">
            <SelectInput
              control={control}
              name="language"
              label={t('settings.label.language', { ns: 'account' })}
              interface="popover"
              disabled={formState.isSubmitting}
              onIonChange={() => handleSubmit(onFormSubmit)()}
              testid={`${testid}-field-language`}
            >
              {orderBy(LANGUAGES, ['value']).map((language) => (
                <IonSelectOption key={language.code} value={language.code}>
                  {t(`settings.language.${language.code}`, { ns: 'account' })}
                </IonSelectOption>
              ))}
            </SelectInput>
          </IonItem>

          <IonItem lines="none" className="text-sm font-medium">
            <IonLabel>{t('settings.label.font-size', { ns: 'account' })}</IonLabel>
          </IonItem>

          <IonItem>
            <RadioGroupInput
              name="fontSize"
              control={control}
              onIonChange={() => handleSubmit(onFormSubmit)()}
              testid={`${testid}-field-fontSize`}
            >
              <IonRadio
                className="ls-settings-form__input-fontsize-radio text-xs"
                disabled={formState.isSubmitting}
                value="smaller"
              >
                {t('settings.font-size.smaller', { ns: 'account' })}
              </IonRadio>
              <IonRadio
                className="ls-settings-form__input-fontsize-radio"
                disabled={formState.isSubmitting}
                value="default"
              >
                {t('settings.font-size.default', { ns: 'account' })}
              </IonRadio>
              <IonRadio
                className="ls-settings-form__input-fontsize-radio text-xl"
                disabled={formState.isSubmitting}
                value="larger"
              >
                {t('settings.font-size.larger', { ns: 'account' })}
              </IonRadio>
            </RadioGroupInput>
          </IonItem>
        </List>
      </form>
    );
  } else {
    // if settings failed to load, render nothing (the error state is handled in the parent component)
    return null;
  }
};

export default SettingsForm;
