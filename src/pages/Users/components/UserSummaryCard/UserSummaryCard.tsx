import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserSummaryCard.scss';
import { useGetUsers } from 'pages/Users/api/useGetUsers';
import { BaseComponentProps } from 'common/components/types';

/**
 * The `UserSummaryCard` component renders an `IonCard` containing summary
 * information about the `User` data. Facilitates navigation to the user
 * list  page.
 */
const UserSummaryCard = ({ className, testid = 'card-user-summary' }: BaseComponentProps) => {
  const { data: users } = useGetUsers();
  const { t } = useTranslation();

  return (
    <IonCard
      button
      routerLink="/tabs/users"
      className={classNames('ls-user-summary-card', className)}
      data-testid={testid}
    >
      <IonCardHeader>
        <IonCardTitle className="ion-text-uppercase">
          {t('navigation.users')}
          {users && (
            <IonBadge className="ls-user-summary-card__badge" data-testid={`${testid}-badge`}>
              {users.length}
            </IonBadge>
          )}
        </IonCardTitle>
        <IonCardSubtitle>{t('tap-to-view', { ns: 'user' })}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>{t('browse-and-search', { ns: 'user' })}</IonCardContent>
    </IonCard>
  );
};

export default UserSummaryCard;
