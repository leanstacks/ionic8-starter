import { IonItem, IonLabel, IonListHeader, IonText } from '@ionic/react';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { BaseComponentProps } from 'common/components/types';
import List from 'common/components/List/List';
import { config } from 'common/utils/config';

/**
 * The `BuildDiagnostics` component displays application diagnostic information
 * as a list of key/value pairs. The attributes are obtained from the application
 * configuration with values obtained from the DevOps automation pipeline.
 *
 * @param {BaseComponentProps} props - Component properties.
 */
const BuildDiagnostics = ({ className, testid = 'diagnostics-build' }: BaseComponentProps) => {
  const { t } = useTranslation();

  return (
    <List className={classNames('ls-build-diagnostics', className)} data-testid={testid}>
      <IonListHeader lines="full">
        <IonLabel>{t('diagnostics.build', { ns: 'account' })}</IonLabel>
      </IonListHeader>

      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">
          {t('diagnostics.label.environment', { ns: 'account' })}
        </IonLabel>
        <IonText data-testid={`${testid}-env`}>{config.VITE_BUILD_ENV_CODE}</IonText>
      </IonItem>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.time', { ns: 'account' })}</IonLabel>
        <IonText data-testid={`${testid}-time`}>
          {format(new Date(config.VITE_BUILD_TS), 'yyyy-MM-dd HH:mm:ss xxx')}
        </IonText>
      </IonItem>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.sha', { ns: 'account' })}</IonLabel>
        <IonText className="break-all" data-testid={`${testid}-sha`}>
          {config.VITE_BUILD_COMMIT_SHA}
        </IonText>
      </IonItem>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.runner', { ns: 'account' })}</IonLabel>
        <IonText data-testid={`${testid}-runner`}>{config.VITE_BUILD_WORKFLOW_RUNNER}</IonText>
      </IonItem>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.workflow', { ns: 'account' })}</IonLabel>
        <IonText data-testid={`${testid}-workflow`}>
          {config.VITE_BUILD_WORKFLOW_NAME} {config.VITE_BUILD_WORKFLOW_RUN_NUMBER}
          {config.VITE_BUILD_WORKFLOW_RUN_ATTEMPT > -1 && <>.{config.VITE_BUILD_WORKFLOW_RUN_ATTEMPT}</>}
        </IonText>
      </IonItem>
    </List>
  );
};

export default BuildDiagnostics;
