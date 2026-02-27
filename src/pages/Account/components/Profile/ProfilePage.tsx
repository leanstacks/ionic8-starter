import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PropsWithTestId } from 'common/components/types';
import { useGetProfile } from 'pages/Account/api/useGetProfile';
import ProgressProvider from 'common/providers/ProgressProvider';
import Container from 'common/components/Content/Container';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';
import PageHeader from 'common/components/Content/PageHeader';
import Header from 'common/components/Header/Header';
import ProfileForm from './ProfileForm';
import ErrorCard from 'common/components/Card/ErrorCard';
import CardRow from 'common/components/Card/CardRow';

/**
 * The `ProfilePage` component renders the page layout for the user profile
 * management page.
 *
 * @param {PropsWithTestId} props - Component properties.
 */
const ProfilePage = ({ testid = 'page-profile' }: PropsWithTestId) => {
  const { data: profile, isError, isLoading } = useGetProfile();
  const { t } = useTranslation();

  return (
    <IonPage className="ls-profile-page" data-testid={testid}>
      <ProgressProvider>
        <Header backButton defaultHref="/tabs/account" title={t('profile.profile', { ns: 'account' })} />

        <IonContent className="ion-padding">
          <Container fixed>
            {isLoading && (
              <div data-testid={`${testid}-loading`}>
                <LoaderSkeleton animated heightStyle="3rem" className="ion-margin-bottom" />
                <LoaderSkeleton animated heightStyle="20rem" />
              </div>
            )}

            {isError && (
              <CardRow>
                <ErrorCard
                  content={t('profile.unable-to-retrieve', { ns: 'account' })}
                  className="ion-margin-bottom"
                  testid={`${testid}-error`}
                />
              </CardRow>
            )}

            {profile && (
              <>
                <PageHeader border inset>
                  <div>{t('profile.profile', { ns: 'account' })}</div>
                </PageHeader>

                <IonGrid>
                  <IonRow>
                    <IonCol sizeMd="10" sizeLg="8" sizeXl="6">
                      <ProfileForm profile={profile} />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </>
            )}
          </Container>
        </IonContent>
      </ProgressProvider>
    </IonPage>
  );
};

export default ProfilePage;
