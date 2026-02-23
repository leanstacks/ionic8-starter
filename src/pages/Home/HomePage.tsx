import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  RefresherEventDetail,
} from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { QueryKey } from 'common/utils/constants';
import Header from 'common/components/Header/Header';
import UserSummaryCard from 'pages/Users/components/UserSummaryCard/UserSummaryCard';
import WelcomeBlock from './components/WelcomeBlock/WelcomeBlock';

/**
 * The `HomePage` component renders the layout for the home page. It displays
 * blocks and cards containing information in a responsive grid.
 * @returns JSX
 */
const HomePage = (): JSX.Element => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await queryClient.refetchQueries({ queryKey: [QueryKey.Users], exact: true });
    event.detail.complete();
  };

  return (
    <IonPage data-testid="page-home">
      <Header title={t('ionic-project')} />

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonGrid fixed>
          <IonRow>
            <IonCol sizeXs="12" sizeMd="6">
              <WelcomeBlock />
            </IonCol>
            <IonCol sizeXs="12" sizeMd="6">
              <UserSummaryCard />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
