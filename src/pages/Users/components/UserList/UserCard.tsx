import { IonCard } from '@ionic/react';
import classNames from 'classnames';

import './UserCard.scss';
import { BaseComponentProps } from 'common/components/types';
import { User } from 'common/models/user';
import Avatar from 'common/components/Icon/Avatar';
import Icon from 'common/components/Icon/Icon';

/**
 * Properties for the `UserCard` component.
 * @param {User} user - A `User` object.
 * @see {@link BaseComponentProps}
 */
interface UserCardProps extends BaseComponentProps {
  user: User;
}

/**
 * The `UserCard` component renders an `IonCard` which displays an avatar,
 * name, and email address of a single `User`.
 * @param {UserCardProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const UserCard = ({ className, testid = 'card-user', user }: UserCardProps) => {
  return (
    <IonCard
      className={classNames('ls-card-user', className)}
      routerLink={`/tabs/users/${user.id}`}
      data-testid={testid}
    >
      <div className="ls-card-user__layout">
        <Avatar className="ls-card-user__avatar" value={user.name} size="large" />
        <div>
          <div className="ls-card-user__header">{user.name}</div>
          <div className="ls-card-user__content-row">
            <Icon icon="envelope" widthAuto />
            <div>{user.email}</div>
          </div>
        </div>
      </div>
    </IonCard>
  );
};

export default UserCard;
