import { IonContent, IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import './SignInPage.scss';
import { PropsWithTestId } from 'common/components/types';
import ProgressProvider from 'common/providers/ProgressProvider';
import Header from 'common/components/Header/Header';
import SignInForm from './components/SignInForm';
import Container from 'common/components/Content/Container';

/**
 * The `SignInPage` renders the layout for user authentication.
 * @param {PropsWithTestId} props - Component properties.
 */
const SignInPage = ({ testid = 'page-signin' }: PropsWithTestId) => {
  const { t } = useTranslation();

  return (
    <IonPage className="ls-signin-page" data-testid={testid}>
      <ProgressProvider>
        <Header title={t('ionic-project')} />

        <IonContent fullscreen className="ion-padding">
          <Container className="ls-signin-page__container" fixed>
            <SignInForm className="ls-signin-page__form" />
          </Container>
        </IonContent>
      </ProgressProvider>
    </IonPage>
  );
};

export default SignInPage;
