import { IonContent, IonPage } from '@ionic/react';
import { PropsWithChildren } from 'react';

import './AuthProvider.scss';
import { useGetUserTokens } from 'common/api/useGetUserTokens';
import LoaderSpinner from 'common/components/Loader/LoaderSpinner';
import { AuthContext, AuthContextValue } from './AuthContext';

/**
 * The `AuthProvider` component creates and provides access to the `AuthContext`
 * value.
 * @param {PropsWithChildren} props - Component properties.
 */
const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: userTokens, isPending, isSuccess, refetch: refetchUserTokens } = useGetUserTokens();

  const value: AuthContextValue = {
    isAuthenticated: isSuccess,
    userTokens: userTokens,
    refetchUserTokens,
  };

  const isReady = !isPending;

  return (
    <AuthContext.Provider value={value}>
      {isReady && <>{children}</>}
      {!isReady && (
        <IonPage className="ls-auth-provider">
          <IonContent fullscreen>
            <LoaderSpinner className="ls-auth-provider__spinner" />
          </IonContent>
        </IonPage>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
