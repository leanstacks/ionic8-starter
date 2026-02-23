import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PropsWithTestId } from 'common/components/types';
import Header from 'common/components/Header/Header';
import PageHeader from 'common/components/Content/PageHeader';
import AppDiagnostics from './AppDiagnostics';
import PlatformDiagnostics from './PlatformDiagnostics';
import BuildDiagnostics from './BuildDiagnostics';

/**
 * The `DiagnosticsPage` renders a layout of components that display information
 * about the application to aid in support and problem resolution.
 *
 * @param {PropsWithTestId} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const DiagnosticsPage = ({ testid = 'page-diagnostics' }: PropsWithTestId) => {
  const { t } = useTranslation();

  return (
    <IonPage className="ls-diagnostics-page" data-testid={testid}>
      <Header title={t('diagnostics.diagnostics', { ns: 'account' })} backButton defaultHref="/tabs/account" />

      <IonContent>
        <IonGrid fixed>
          <IonRow className="ion-margin-top ion-hide-md-down">
            <IonCol>
              <PageHeader border inset>
                {t('diagnostics.diagnostics', { ns: 'account' })}
              </PageHeader>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeLg="6">
              <AppDiagnostics />
            </IonCol>

            <IonCol size="12" sizeLg="6">
              <PlatformDiagnostics />
            </IonCol>

            <IonCol size="12" sizeLg="6">
              <BuildDiagnostics />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default DiagnosticsPage;
