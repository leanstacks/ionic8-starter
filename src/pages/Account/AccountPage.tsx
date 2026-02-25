import {
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonLabel,
  IonListHeader,
  IonPage,
  IonRow,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { PropsWithTestId } from 'common/components/types';
import { config } from 'common/utils/config';
import ProgressProvider from 'common/providers/ProgressProvider';
import Header from 'common/components/Header/Header';
import SettingsForm from './components/Settings/SettingsForm';
import List from 'common/components/List/List';

/**
 * The `AccountPage` component renders a list of account related items which
 * a user may perform.
 * @param {PropsWithTestId} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const AccountPage = ({ testid = 'page-account' }: PropsWithTestId) => {
  const [diagnosticsCount, setDiagnosticsCount] = useState<number>(0);
  const router = useIonRouter();
  const { t } = useTranslation();

  const versionTs = dayjs(config.VITE_BUILD_TS).format('YY.MM.DD.hhmm');
  const sha = config.VITE_BUILD_COMMIT_SHA.substring(0, 7);
  const version = `${versionTs}.${sha}`;

  const onDiagnosticsClick = () => {
    if (diagnosticsCount >= 6) {
      setDiagnosticsCount(0);
      router.push('/tabs/account/diagnostics');
    } else {
      setDiagnosticsCount((value) => value + 1);
    }
  };

  return (
    <IonPage className="ls-account-page" data-testid={testid}>
      <ProgressProvider>
        <Header title={t('my-account', { ns: 'account' })} />

        <IonContent>
          <IonGrid fixed>
            <IonRow>
              <IonCol size="12" sizeLg="6" className="order-1-lg">
                <List>
                  <IonListHeader>
                    <IonLabel>{t('navigation.account')}</IonLabel>
                  </IonListHeader>

                  <IonItem className="text-sm" detail routerLink="/tabs/account/profile">
                    <IonLabel className="font-medium ion-margin-end">
                      {t('profile.profile', { ns: 'account' })}
                    </IonLabel>
                  </IonItem>
                  <IonItem className="text-sm" detail routerLink="/auth/signout">
                    <IonLabel className="font-medium ion-margin-end">{t('navigation.signout')}</IonLabel>
                  </IonItem>
                </List>
              </IonCol>

              <IonCol size="12" sizeLg="6" className="order-3-lg">
                <SettingsForm />
              </IonCol>

              <IonCol size="12" sizeLg="6" className="order-2-lg">
                <List>
                  <IonListHeader>
                    <IonLabel>{t('legal', { ns: 'account' })}</IonLabel>
                  </IonListHeader>

                  <IonItem className="text-sm">
                    <IonLabel className="font-medium">{t('privacy-policy', { ns: 'account' })}</IonLabel>
                  </IonItem>
                  <IonItem className="text-sm">
                    <IonLabel className="font-medium">{t('terms-and-conditions', { ns: 'account' })}</IonLabel>
                  </IonItem>
                </List>
              </IonCol>

              <IonCol size="12" sizeLg="6" className="order-4-lg">
                <List>
                  <IonListHeader>
                    <IonLabel>{t('about', { ns: 'account' })}</IonLabel>
                  </IonListHeader>

                  <IonItem className="text-sm" onClick={() => onDiagnosticsClick()}>
                    <IonLabel className="font-medium ion-margin-end">{t('version', { ns: 'account' })}</IonLabel>
                    <IonText>{version}</IonText>
                  </IonItem>
                </List>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </ProgressProvider>
    </IonPage>
  );
};

export default AccountPage;
