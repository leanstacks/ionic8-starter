import { useEffect, useRef } from 'react';
import { IonButton } from '@ionic/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
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
  onSubmit: (values: UserFormValues, helpers: FormikHelpers<UserFormValues>) => void;
  user?: User;
}

/**
 * The `UserForm` component renders a Formik form for creating or editing
 * a `User`.
 * @param {UserFormProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const UserForm = ({ className, onSubmit, user, testid = 'form-user' }: UserFormProps) => {
  const focusInput = useRef<HTMLIonInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    focusInput.current?.setFocus();
  }, []);

  /**
   * User form validation schema.
   */
  const validationSchema = object<UserFormValues>({
    name: string().required(t('validation.required')),
    username: string()
      .required(t('validation.required'))
      .min(8, ({ min }) => t('validation.min', { min }))
      .max(30, ({ max }) => t('validation.max', { max })),
    email: string().required(t('validation.required')).email(t('validation.email')),
    phone: string().required(t('validation.required')),
    website: string().url(t('validation.url')),
  });

  return (
    <div className={classNames('ls-user-form', className)} data-testid={testid}>
      <Formik<UserFormValues>
        enableReinitialize={true}
        initialValues={{
          email: user?.email ?? '',
          name: user?.name ?? '',
          phone: user?.phone ?? '',
          username: user?.username ?? '',
          website: user?.website ?? '',
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting }) => (
          <Form data-testid={`${testid}-form`}>
            <Input
              name="name"
              label={t('label.name', { ns: 'user' })}
              labelPlacement="stacked"
              disabled={isSubmitting}
              className="ls-user-form__input"
              ref={focusInput}
              data-testid={`${testid}-field-name`}
            ></Input>
            <Input
              name="username"
              label={t('label.username', { ns: 'user' })}
              labelPlacement="stacked"
              disabled={isSubmitting}
              maxlength={30}
              className="ls-user-form__input"
              data-testid={`${testid}-field-username`}
            ></Input>
            <Input
              name="email"
              type="email"
              label={t('label.email', { ns: 'user' })}
              labelPlacement="stacked"
              disabled={isSubmitting}
              className="ls-user-form__input"
              data-testid={`${testid}-field-email`}
            ></Input>
            <Input
              name="phone"
              label={t('label.phone', { ns: 'user' })}
              labelPlacement="stacked"
              disabled={isSubmitting}
              className="ls-user-form__input"
              data-testid={`${testid}-field-phone`}
            ></Input>
            <Input
              name="website"
              label={t('label.website', { ns: 'user' })}
              labelPlacement="stacked"
              disabled={isSubmitting}
              className="ls-user-form__input"
              data-testid={`${testid}-field-website`}
            ></Input>

            <IonButton
              type="submit"
              color="primary"
              className="ls-user-form__button"
              expand="block"
              disabled={isSubmitting || !dirty}
              data-testid={`${testid}-button-submit`}
            >
              {t('label.save')}
            </IonButton>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
