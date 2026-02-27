import { ComponentPropsWithRef, useRef, useState } from 'react';
import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, useIonRouter } from '@ionic/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserListItem.scss';
import { BaseComponentProps } from 'common/components/types';
import { useToasts } from 'common/hooks/useToasts';
import { useProgress } from 'common/hooks/useProgress';
import { DismissButton } from 'common/components/Toast/Toast';
import { User } from 'common/models/user';
import Avatar from 'common/components/Icon/Avatar';
import Icon from 'common/components/Icon/Icon';
import UserDeleteAlert from '../UserDelete/UserDeleteAlert';

/**
 * Properties for the `UserListItem` component.
 * @param {User} user - A `User` object.
 * @see {@link BaseComponentProps}
 * @see {@link IonItem}
 */
interface UserListItemProps extends BaseComponentProps, Pick<ComponentPropsWithRef<typeof IonItem>, 'lines'> {
  user: User;
}

/**
 * The `UserListItem` component renders a single item in the list of
 * `User` objects. Uses `IonItem` to provide base functionality.
 *
 * When clicked, navigates to the user detail page.
 * @param {UserListItemProps} props - Component properties.
 */
const UserListItem = ({ className, lines, testid, user }: UserListItemProps) => {
  const testIdentifier = testid ?? `list-item-user-${user.id}`;
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const { t } = useTranslation();
  const { setProgress } = useProgress();
  const { createToast } = useToasts();
  const router = useIonRouter();
  const ionSlidingRef = useRef<HTMLIonItemSlidingElement>(null);

  const doEdit = () => {
    ionSlidingRef.current?.close();
    router.push(`/tabs/users/${user.id}/edit`);
  };

  return (
    <IonItemSliding
      ref={ionSlidingRef}
      className={classNames('ls-user-list-item', className)}
      data-testid={testIdentifier}
    >
      <IonItem className="ls-user-list-item__item" routerLink={`/tabs/users/${user.id}`} lines={lines} detail>
        <Avatar className="ls-user-list-item__avatar" value={user.name} size="large" />
        <IonLabel>
          <div className="ls-user-list-item__content-row ls-user-list-item__content-row--primary">
            <div data-testid={`${testIdentifier}-name`}>{user.name}</div>
          </div>
          <div className="ls-user-list-item__content-row ls-user-list-item__content-row--secondary">
            <Icon icon="envelope" widthAuto />
            <div data-testid={`${testIdentifier}-email`}>{user.email}</div>
          </div>
        </IonLabel>
      </IonItem>

      <IonItemOptions>
        <IonItemOption className="ls-user-list-item__sliding-option" onClick={() => doEdit()}>
          <Icon className="ls-user-list-item__sliding-option-icon" icon="penToSquare" />
          {t('label.edit')}
        </IonItemOption>
        <IonItemOption
          className="ls-user-list-item__sliding-option"
          color="danger"
          onClick={() => setShowConfirmDelete(true)}
        >
          <Icon className="ls-user-list-item__sliding-option-icon" icon="trash" />
          {t('label.delete')}
        </IonItemOption>
      </IonItemOptions>

      <UserDeleteAlert
        isOpen={showConfirmDelete}
        isPending={(isPending) => setProgress(isPending, { color: 'danger' })}
        onCancel={() => setShowConfirmDelete(false)}
        onError={() => {
          setShowConfirmDelete(false);
          //TODO: handle delete user error
        }}
        onSuccess={() => {
          setShowConfirmDelete(false);
          createToast({
            buttons: [DismissButton()],
            duration: 5000,
            message: `${user?.name} ${t('deleted')}`,
          });
        }}
        user={user}
      />
    </IonItemSliding>
  );
};

export default UserListItem;
