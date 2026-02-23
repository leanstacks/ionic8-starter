import { IonBadge, IonItem, IonLabel, IonListHeader } from '@ionic/react';
import classNames from 'classnames';

import { BaseComponentProps } from 'common/components/types';
import { usePlatform } from 'common/hooks/usePlatform';
import List from 'common/components/List/List';
import Badges from 'common/components/Badge/Badges';
import { useTranslation } from 'react-i18next';

/**
 * The `PlatformDiagnostics` component displays application diagnostic information
 * as a list of key/value pairs. The attributes are obtained from the Ionic
 * framework.
 *
 * @param {BaseComponentProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const PlatformDiagnostics = ({ className, testid = 'diagnostics-platform' }: BaseComponentProps) => {
  const { isNativePlatform, platforms } = usePlatform();
  const { t } = useTranslation();

  return (
    <List className={classNames('ls-platform-diagnostics', className)} data-testid={testid}>
      <IonListHeader lines="full">
        <IonLabel>{t('diagnostics.platform', { ns: 'account' })}</IonLabel>
      </IonListHeader>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">{t('diagnostics.label.native', { ns: 'account' })}</IonLabel>
        {isNativePlatform ? (
          <IonBadge className="uppercase" data-testid={`${testid}-is-native`}>
            {t('yes')}
          </IonBadge>
        ) : (
          <IonBadge className="uppercase" color="medium" data-testid={`${testid}-not-native`}>
            {t('no')}
          </IonBadge>
        )}
      </IonItem>
      <IonItem className="text-sm">
        <IonLabel className="font-medium ion-margin-end">
          {t('diagnostics.label.platforms', { ns: 'account' })}
        </IonLabel>
        <Badges data-testid={`${testid}-platforms`}>
          {platforms.map((platform) => (
            <IonBadge key={platform} color="medium" data-testid={`${testid}-platform`}>
              {platform}
            </IonBadge>
          ))}
        </Badges>
      </IonItem>
    </List>
  );
};

export default PlatformDiagnostics;
