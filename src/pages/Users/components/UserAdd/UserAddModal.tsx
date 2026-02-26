import { IonModalCustomEvent } from '@ionic/core';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { ComponentPropsWithoutRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PropsWithTestId } from 'common/components/types';
import { useCreateUser } from 'pages/Users/api/useCreateUser';
import { useProgress } from 'common/hooks/useProgress';
import { useToasts } from 'common/hooks/useToasts';
import { DismissButton } from 'common/components/Toast/Toast';
import Icon from 'common/components/Icon/Icon';
import UserForm from '../UserForm/UserForm';
import ErrorCard from 'common/components/Card/ErrorCard';

/**
 * Properties for the `UserAddModal` component.
 * @param {function} setIsOpen - A setter function which accepts a `boolean` that
 * indicates if the modal should be open (`true`) or closed (`false`).
 * @see {@link PropsWithTestId}
 * @see {@link IonModal}
 */
interface UserAddModalProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonModal> {
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * The `UserAddModal` component renders an `IonModal` containing a Formik
 * form to create a new `User`.
 *
 * @param {UserAddModalProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const UserAddModal = ({
  onIonModalDidDismiss,
  setIsOpen,
  testid = 'modal-user-add',
  ...modalProps
}: UserAddModalProps) => {
  const [error, setError] = useState<string>('');
  const router = useIonRouter();
  const { isActive: isActiveProgressBar, progressBar, setProgress } = useProgress();
  const { createToast } = useToasts();
  const { mutate: createUser } = useCreateUser();
  const { t } = useTranslation();

  const didDismiss = (e: IonModalCustomEvent<OverlayEventDetail>) => {
    onIonModalDidDismiss?.(e);
    setIsOpen(false);
  };

  return (
    <IonModal onIonModalDidDismiss={didDismiss} {...modalProps} data-testid={testid}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('add-user', { ns: 'user' })}</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen(false)} data-testid={`${testid}-button-close`}>
              <Icon icon="xmark" />
            </IonButton>
          </IonButtons>

          {isActiveProgressBar && <IonProgressBar className="ion-hide-md-up" {...progressBar} />}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && (
          <ErrorCard
            content={`${t('unable-to-process', { ns: 'user' })} ${error}`}
            className="ion-margin-bottom"
            testid={`${testid}-error`}
          />
        )}
        <UserForm
          onSubmit={(values) => {
            setProgress(true);
            setError('');
            createUser(
              { user: values },
              {
                onSuccess: (user) => {
                  setProgress(false);
                  createToast({
                    buttons: [DismissButton()],
                    duration: 5000,
                    message: `${user.name} ${t('created')}`,
                  });
                  setIsOpen(false);
                  router.push(`/tabs/users/${user.id}`);
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
      </IonContent>
    </IonModal>
  );
};

export default UserAddModal;
