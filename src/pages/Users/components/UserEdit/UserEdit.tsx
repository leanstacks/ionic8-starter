import { useState } from 'react';
import { IonCol, IonGrid, IonRow, useIonRouter } from '@ionic/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BaseComponentProps } from 'common/components/types';
import { User } from 'common/models/user';
import { useUpdateUser } from 'pages/Users/api/useUpdateUser';
import { useProgress } from 'common/hooks/useProgress';
import { useToasts } from 'common/hooks/useToasts';
import { DismissButton } from 'common/components/Toast/Toast';
import ErrorCard from 'common/components/Card/ErrorCard';
import UserForm from '../UserForm/UserForm';

/**
 * Properties for the `UserEdit` component.
 * @see {@link BaseComponentProps}
 */
interface UserEditProps extends BaseComponentProps {
  user: User;
}

/**
 * The `UserEdit` component renders a form for editing a `User`.
 * @param {UserEditProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const UserEdit = ({ className, user, testid = 'user-edit' }: UserEditProps) => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const [error, setError] = useState<string>('');
  const { mutate: updateUser } = useUpdateUser();
  const { createToast } = useToasts();
  const { setProgress } = useProgress();

  return (
    <div className={classNames('ls-user-edit', className)} data-testid={testid}>
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="10" sizeLg="8" sizeXl="6">
            {error && (
              <ErrorCard
                content={`${t('unable-to-process', { ns: 'user' })} ${error}`}
                className="ion-margin-bottom"
                testid={`${testid}-error`}
              />
            )}

            <UserForm
              user={user}
              onSubmit={(values) => {
                setProgress(true);
                setError('');
                updateUser(
                  { user: { ...user, ...values } },
                  {
                    onSuccess: (user) => {
                      setProgress(false);
                      createToast({
                        buttons: [DismissButton()],
                        duration: 5000,
                        message: `${user.name} ${t('updated')}`,
                      });
                      if (router.canGoBack()) {
                        router.goBack();
                      } else {
                        router.push(`/tabs/users/${user.id}`, 'back', 'replace');
                      }
                    },
                    onError(error) {
                      setProgress(false);
                      setError(error.message);
                    },
                  },
                );
              }}
              testid={`${testid}-form`}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default UserEdit;
