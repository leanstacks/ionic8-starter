import { IonCol, IonGrid, IonRow } from '@ionic/react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

import './UserGrid.scss';
import { BaseComponentProps } from 'common/components/types';
import { useGetUsers } from 'pages/Users/api/useGetUsers';
import { filterUsers } from 'pages/Users/utils/users';
import UserCard from './UserCard';
import LoaderSpinner from 'common/components/Loader/LoaderSpinner';
import CardRow from 'common/components/Card/CardRow';
import ErrorCard from 'common/components/Card/ErrorCard';
import EmptyCard from 'common/components/Card/EmptyCard';

/**
 * Properties for the `UserGrid` component.
 * @param {string} [filterBy] - Optional. Critera to filter the list of `Users`.
 * @see {@link BaseComponentProps}
 */
interface UserGridProps extends BaseComponentProps {
  filterBy?: string;
}

/**
 * The `UserGrid` component renders a grid of `UserCard`s. Uses the `IonGrid`
 * component to provide base functionality.
 * @param {UserGridProps} props - Component properties.
 * @see {@link IonGrid}
 */
const UserGrid = ({ className, filterBy, testid = 'grid-user' }: UserGridProps) => {
  const { t } = useTranslation();
  const { data: users, isError, isLoading } = useGetUsers();

  const baseProps = {
    className: classNames('ls-user-grid', className),
    'data-testid': testid,
  };

  // Loading state
  if (isLoading) {
    return (
      <div {...baseProps}>
        <LoaderSpinner
          className="ls-user-grid__loader"
          testid={`${testid}-loader`}
          text={`${t('loading-users', { ns: 'user' })}...`}
        />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div {...baseProps}>
        <CardRow className="ls-user-grid__card-row" testid={`${testid}-error`}>
          <ErrorCard content={t('unable-to-retrieve', { ns: 'user' })} />
        </CardRow>
      </div>
    );
  }

  const filteredUsers = filterUsers(users, filterBy);

  // Empty state
  if (isEmpty(filteredUsers)) {
    return (
      <div {...baseProps}>
        <CardRow className="ls-user-grid__card-row" testid={`${testid}-empty`}>
          <EmptyCard content={t('unable-to-find', { ns: 'user' })} />
        </CardRow>
      </div>
    );
  }

  // Success state
  return (
    <IonGrid {...baseProps}>
      <IonRow>
        {filteredUsers &&
          filteredUsers.map((user) => (
            <IonCol key={user.id} sizeXs="12" sizeMd="6" sizeXl="4">
              <UserCard user={user} testid={`${testid}-card-user-${user.id}`} />
            </IonCol>
          ))}
      </IonRow>
    </IonGrid>
  );
};

export default UserGrid;
