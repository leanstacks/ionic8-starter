import { IonItem, IonLabel, IonListHeader } from '@ionic/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BaseComponentProps } from 'common/components/types';
import { usePlatform } from 'common/hooks/usePlatform';
import { useGetAppInfo } from 'pages/Account/api/useGetAppInfo';
import List from 'common/components/List/List';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';

/**
 * The `AppDiagnostics` component displays application diagnostic information
 * as a list of key/value pairs. The attributes are obtained from the `App`
 * capacitor.
 *
 * @param {BaseComponentProps} props - Component properties.
 */
const AppDiagnostics = ({ className, testid = 'diagnostics-app' }: BaseComponentProps) => {
  const { isNativePlatform } = usePlatform();
  const { data: appInfo, isLoading } = useGetAppInfo();
  const { t } = useTranslation();

  if (isNativePlatform) {
    return (
      <List className={classNames('ls-app-diagnostics', className)} data-testid={testid}>
        <IonListHeader lines="full">
          <IonLabel>{t('diagnostics.app', { ns: 'account' })}</IonLabel>
        </IonListHeader>
        {isLoading && (
          <IonItem data-testid={`${testid}-loading`}>
            <LoaderSkeleton animated heightStyle="1.5rem" />
          </IonItem>
        )}
        {appInfo && (
          <>
            <IonItem className="text-sm">
              <IonLabel className="font-medium ion-margin-end">
                {t('diagnostics.label.name', { ns: 'account' })}
              </IonLabel>
              <IonLabel className="ion-text-end" data-testid={`${testid}-name`}>
                {appInfo.name}
              </IonLabel>
            </IonItem>
            <IonItem className="text-sm">
              <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.id', { ns: 'account' })}</IonLabel>
              <IonLabel className="ion-text-end" data-testid={`${testid}-id`}>
                {appInfo.id}
              </IonLabel>
            </IonItem>
            <IonItem className="text-sm">
              <IonLabel className="font-medium ion-margin-end">
                {t('diagnostics.label.build', { ns: 'account' })}
              </IonLabel>
              <IonLabel className="ion-text-end" data-testid={`${testid}-build`}>
                {appInfo.build}
              </IonLabel>
            </IonItem>
            <IonItem className="text-sm">
              <IonLabel className="font-medium ion-margin-end">
                {t('diagnostics.label.version', { ns: 'account' })}
              </IonLabel>
              <IonLabel className="ion-text-end" data-testid={`${testid}-version`}>
                {appInfo.version}
              </IonLabel>
            </IonItem>
          </>
        )}
      </List>
    );
  } else {
    return (
      <List className={classNames('ls-app-diagnostics', className)} data-testid={testid}>
        <IonListHeader lines="full">
          <IonLabel>{t('diagnostics.app', { ns: 'account' })}</IonLabel>
        </IonListHeader>
        <IonItem className="text-sm">
          <IonLabel color="medium" className="font-medium" data-testid={`${testid}-not-native`}>
            {t('diagnostics.platform-not-native', { ns: 'account' })}
          </IonLabel>
        </IonItem>
      </List>
    );
  }
};

export default AppDiagnostics;
