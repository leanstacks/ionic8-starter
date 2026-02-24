import {
  IonButton,
  IonContent,
  IonInputPasswordToggle,
  IonPopover,
  useIonRouter,
  useIonViewDidEnter,
} from '@ionic/react';
import { useRef, useState } from 'react';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { boolean, object, string } from 'yup';
import { useTranslation } from 'react-i18next';

import './SignInForm.scss';
import { BaseComponentProps } from 'common/components/types';
import { RememberMe } from 'common/models/auth';
import storage from 'common/utils/storage';
import { StorageKey } from 'common/utils/constants';
import { useSignIn } from '../api/useSignIn';
import { useProgress } from 'common/hooks/useProgress';
import Input from 'common/components/Input/Input';
import ErrorCard from 'common/components/Card/ErrorCard';
import Icon from 'common/components/Icon/Icon';
import HeaderRow from 'common/components/Text/HeaderRow';
import CheckboxInput from 'common/components/Input/CheckboxInput';

/**
 * Sign in form values.
 * @param {string} username - A username.
 * @param {string} password - A password.
 */
interface SignInFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * The `SignInForm` component renders a Formik form for user authentication.
 * @param {BaseComponentProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const SignInForm = ({ className, testid = 'form-signin' }: BaseComponentProps) => {
  const focusInput = useRef<HTMLIonInputElement>(null);
  const [error, setError] = useState<string>('');
  const { setIsActive: setShowProgress } = useProgress();
  const router = useIonRouter();
  const { mutate: signIn } = useSignIn();
  const { t } = useTranslation();

  /**
   * Sign in form validation schema.
   */
  const validationSchema = object<SignInFormValues>({
    username: string().required(t('validation.required')),
    password: string().required(t('validation.required')),
    rememberMe: boolean().default(false),
  });

  // remember me details
  const rememberMe = storage.getJsonItem<RememberMe>(StorageKey.RememberMe);

  useIonViewDidEnter(() => {
    focusInput.current?.setFocus();
  });

  return (
    <div className={classNames('ls-signin-form', className)} data-testid={testid}>
      {error && (
        <ErrorCard
          content={`${t('error.unable-to-verify', { ns: 'auth' })} ${error}`}
          className="ion-margin-bottom"
          testid={`${testid}-error`}
        />
      )}

      <Formik<SignInFormValues>
        enableReinitialize={true}
        initialValues={{
          username: rememberMe?.username ?? '',
          password: '',
          rememberMe: !!rememberMe,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setError('');
          setShowProgress(true);
          signIn(values.username, {
            onSuccess: () => {
              if (values.rememberMe) {
                storage.setJsonItem<RememberMe>(StorageKey.RememberMe, {
                  username: values.username,
                });
              } else {
                storage.removeItem(StorageKey.RememberMe);
              }
              router.push('/tabs', 'forward', 'replace');
            },
            onError: (err: Error) => {
              setError(err.message);
            },
            onSettled: () => {
              setShowProgress(false);
              setSubmitting(false);
            },
          });
        }}
        validationSchema={validationSchema}
      >
        {({ dirty, isSubmitting }) => (
          <Form data-testid={`${testid}-form`}>
            <HeaderRow border>
              <div>{t('signin', { ns: 'auth' })}</div>
              <Icon id="signinInfo" icon="circleInfo" color="secondary" />
            </HeaderRow>

            <Input
              name="username"
              label={t('label.username', { ns: 'auth' })}
              labelPlacement="stacked"
              maxlength={30}
              autocomplete="off"
              className="ls-signin-form__input"
              ref={focusInput}
              data-testid={`${testid}-field-username`}
            />
            <Input
              type="password"
              name="password"
              label={t('label.password', { ns: 'auth' })}
              labelPlacement="stacked"
              maxlength={30}
              autocomplete="off"
              className="ls-signin-form__input"
              data-testid={`${testid}-field-password`}
            >
              <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
            </Input>

            <CheckboxInput
              name="rememberMe"
              className="ls-signin-form__input ls-signin-form__input-checkbox"
              testid={`${testid}-field-rememberme`}
            >
              {t('label.remember-me', { ns: 'auth' })}
            </CheckboxInput>

            <IonButton
              type="submit"
              color="primary"
              className="ls-signin-form__button"
              expand="block"
              disabled={isSubmitting || !dirty}
              data-testid={`${testid}-button-submit`}
            >
              {t('signin', { ns: 'auth' })}
            </IonButton>

            <IonPopover trigger="signinInfo" triggerAction="hover" className="ls-signin-form-popover">
              <IonContent className="ion-padding">
                <p>
                  {t('info-username.part1', { ns: 'auth' })}
                  <a href="https://jsonplaceholder.typicode.com/users" target="_blank" rel="noreferrer">
                    {t('info-username.part2', { ns: 'auth' })}
                  </a>
                  . {t('info-username.part3', { ns: 'auth' })} <span className="inline-code">Bret</span>{' '}
                  {t('info-username.part4', { ns: 'auth' })} <span className="inline-code">Samantha</span>.
                </p>
                <p>{t('info-username.part5', { ns: 'auth' })}</p>
              </IonContent>
            </IonPopover>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignInForm;
