import { IonButton, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './ProfileForm.scss';
import { BaseComponentProps } from 'common/components/types';
import { Profile } from 'common/models/profile';
import { useProgress } from 'common/hooks/useProgress';
import { useUpdateProfile } from 'pages/Account/api/useUpdateProfile';
import { useToasts } from 'common/hooks/useToasts';
import { DismissButton } from 'common/components/Toast/Toast';
import ErrorCard from 'common/components/Card/ErrorCard';
import Input from 'common/components/Input/Input';
import ButtonRow from 'common/components/Button/ButtonRow';
import Textarea from 'common/components/Input/Textarea';
import DateInput from 'common/components/Input/DateInput';

/**
 * Profile form values.
 * @see {@link User}
 */
type ProfileFormValues = Profile;

/**
 * Properties for the `ProfileForm` component.
 * @param {User} user - User to initialize the form.
 * @see {@link BaseComponentProps}
 */
interface ProfileFormProps extends BaseComponentProps {
  profile: Profile;
}

/**
 * The `ProfileForm` component renders a Formik form to edit a user profile.
 * @param {ProfileFormProps} props - Component propeties.
 */
const ProfileForm = ({ className, testid = 'form-profile', profile }: ProfileFormProps) => {
  const focusInput = useRef<HTMLIonInputElement>(null);
  const [error, setError] = useState<string>('');
  const { mutate: updateProfile } = useUpdateProfile();
  const router = useIonRouter();
  const { setProgress } = useProgress();
  const { createToast } = useToasts();
  const { t } = useTranslation();

  /**
   * Profile form validation schema.
   */
  const profileFormSchema = z.object({
    name: z.string().min(1, { message: t('validation.required') }),
    email: z.email({ message: t('validation.email') }).min(1, { message: t('validation.required') }),
    bio: z
      .string()
      .max(500, { message: t('validation.max', { max: 500 }) })
      .optional(),
    dateOfBirth: z.iso.date().optional(),
  });

  const { control, formState, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      email: profile.email,
      name: profile.name,
      bio: profile.bio,
      dateOfBirth: profile.dateOfBirth,
    },
    mode: 'all',
    resolver: zodResolver(profileFormSchema),
  });

  useIonViewDidEnter(() => {
    focusInput.current?.setFocus();
  });

  const onCancel = () => {
    router.goBack();
  };

  const onFormSubmit = (values: ProfileFormValues) => {
    setProgress(true);
    setError('');
    updateProfile(
      { profile: values },
      {
        onSuccess: () => {
          createToast({
            message: t('profile.updated-profile', { ns: 'account' }),
            duration: 5000,
            buttons: [DismissButton()],
          });
          router.goBack();
        },
        onError: (err) => {
          setError(err.message);
        },
        onSettled: () => {
          setProgress(false);
        },
      },
    );
  };

  return (
    <div className={classNames('ls-profile-form', className)} data-testid={testid}>
      {error && (
        <ErrorCard
          content={`${t('profile.unable-to-process', { ns: 'account' })} ${error}`}
          className="ion-margin-bottom"
          testid={`${testid}-error`}
        />
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} noValidate data-testid={`${testid}-form`}>
        <Input
          control={control}
          name="name"
          label={t('profile.label.name', { ns: 'account' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          autocomplete="off"
          className="ls-profile-form__input"
          ref={focusInput}
          testid={`${testid}-field-name`}
        />

        <Input
          control={control}
          name="email"
          type="email"
          label={t('profile.label.email', { ns: 'account' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          autocomplete="off"
          className="ls-profile-form__input"
          testid={`${testid}-field-email`}
        />

        <Textarea
          control={control}
          name="bio"
          label={t('profile.label.bio', { ns: 'account' })}
          labelPlacement="stacked"
          autoGrow
          counter
          maxlength={500}
          disabled={formState.isSubmitting}
          className="ls-profile-form__input"
          testid={`${testid}-field-bio`}
        />

        <DateInput
          control={control}
          name="dateOfBirth"
          label={t('profile.label.birthday', { ns: 'account' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          className="ls-profile-form__input"
          showClearButton
          showDefaultButtons
          showDefaultTitle
          testid={`${testid}-field-dateofbirth`}
        />

        <ButtonRow className="ls-profile-form__button-row" expand="block">
          <IonButton
            type="button"
            color="secondary"
            fill="clear"
            disabled={formState.isSubmitting}
            onClick={onCancel}
            data-testid={`${testid}-button-cancel`}
          >
            {t('label.cancel')}
          </IonButton>
          <IonButton
            type="submit"
            color="primary"
            disabled={formState.isSubmitting || !formState.isDirty}
            data-testid={`${testid}-button-submit`}
          >
            {t('label.save')}
          </IonButton>
        </ButtonRow>
      </form>
    </div>
  );
};

export default ProfileForm;
