import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

import './SignOutPage.scss';
import { PropsWithTestId } from 'common/components/types';
import { useSignOut } from './api/useSignOut';
import LoaderSpinner from 'common/components/Loader/LoaderSpinner';

/**
 * The `SignOutPage` renders a loader while the application removes
 * authentication state from the currently signed in user.
 * @param {PropsWithTestId} props - Component properties.
 */
const SignOutPage = ({ testid = 'page-signout' }: PropsWithTestId) => {
  const router = useIonRouter();
  const { mutate: signOut } = useSignOut();

  useEffect(() => {
    signOut(undefined, {
      onSuccess: () => {
        router.push('/auth/signin', 'forward', 'replace');
      },
      onError: () => {
        // TODO handle sign out error
        router.push('/tabs/home', 'forward', 'replace');
      },
    });
    // disabling eslint rule because hook is only called on mount and unmount, and we don't want to add dependencies that would cause it to run more than once
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return (
    <IonPage className="ls-page-signout" data-testid={testid}>
      <IonContent fullscreen>
        <LoaderSpinner className="ls-page-signout__loader-spinner" />
      </IonContent>
    </IonPage>
  );
};

export default SignOutPage;
