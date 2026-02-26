import { useEffect, useRef } from 'react';
import { IonButton, useIonViewDidEnter } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserForm.scss';
import { BaseComponentProps } from 'common/components/types';
import { User } from 'common/models/user';
import Input from 'common/components/Input/Input';

/**
 * User form values.
 * @see {@link User}
 */
type UserFormValues = Pick<User, 'email' | 'name' | 'phone' | 'username' | 'website'>;

/**
 * Properties for the `UserForm` component.
 * @param {User} [user] - Optional. User to initialize the form.
 * @see {@link BaseComponentProps}
 */
interface UserFormProps extends BaseComponentProps {
  onSubmit: (values: UserFormValues) => void;
  user?: User;
}

/**
 * The `UserForm` component renders a form for creating or editing
 * a `User`.
 * @param {UserFormProps} props - Component properties.
 */
const UserForm = ({ className, onSubmit, user, testid = 'form-user' }: UserFormProps) => {
  const focusInput = useRef<HTMLIonInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    focusInput.current?.setFocus();
  }, []);

  /**
   * Focus the first input when the view is entered.
   */
  useIonViewDidEnter(() => {
    // TODO: fix focus using Ionic's focus management system instead of directly manipulating the DOM element
    focusInput.current?.setFocus();
  });

  /**
   * User form validation schema.
   */
  const userFormSchema = z.object({
    name: z.string().min(1, { message: t('validation.required') }),
    username: z
      .string()
      .min(8, { message: t('validation.min', { min: 8 }) })
      .max(30, { message: t('validation.max', { max: 30 }) }),
    email: z.email({ message: t('validation.email') }).min(1, { message: t('validation.required') }),
    phone: z.string().min(1, { message: t('validation.required') }),
    website: z.url({ message: t('validation.url') }).min(1, { message: t('validation.required') }),
  });

  const { control, formState, handleSubmit } = useForm<UserFormValues>({
    defaultValues: {
      email: user?.email ?? '',
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      username: user?.username ?? '',
      website: user?.website ?? '',
    },
    mode: 'all',
    resolver: zodResolver(userFormSchema),
  });

  return (
    <div className={classNames('ls-user-form', className)} data-testid={testid}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid={`${testid}-form`}>
        <Input
          control={control}
          name="name"
          label={t('label.name', { ns: 'user' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          className="ls-user-form__input"
          ref={focusInput}
          data-testid={`${testid}-field-name`}
        ></Input>
        <Input
          control={control}
          name="username"
          label={t('label.username', { ns: 'user' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          maxlength={30}
          className="ls-user-form__input"
          data-testid={`${testid}-field-username`}
        ></Input>
        <Input
          control={control}
          name="email"
          type="email"
          label={t('label.email', { ns: 'user' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          className="ls-user-form__input"
          data-testid={`${testid}-field-email`}
        ></Input>
        <Input
          control={control}
          name="phone"
          label={t('label.phone', { ns: 'user' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          className="ls-user-form__input"
          data-testid={`${testid}-field-phone`}
        ></Input>
        <Input
          control={control}
          name="website"
          label={t('label.website', { ns: 'user' })}
          labelPlacement="stacked"
          disabled={formState.isSubmitting}
          className="ls-user-form__input"
          data-testid={`${testid}-field-website`}
        ></Input>

        <IonButton
          type="submit"
          color="primary"
          className="ls-user-form__button"
          expand="block"
          disabled={formState.isSubmitting || !formState.isDirty}
          data-testid={`${testid}-button-submit`}
        >
          {t('label.save')}
        </IonButton>
      </form>
    </div>
  );
};

export default UserForm;
