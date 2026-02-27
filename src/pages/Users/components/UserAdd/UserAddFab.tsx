import { ComponentPropsWithoutRef } from 'react';
import { IonFab, IonFabButton } from '@ionic/react';
import classNames from 'classnames';

import './UserAddFab.scss';
import { PropsWithTestId } from 'common/components/types';
import Icon from 'common/components/Icon/Icon';

/**
 * Properties for the `UserAddFab` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonFab}
 */
interface UserAddFabProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonFab> {}

/**
 * The `UserAddFab` renders an Ionic Floating Action Button, or FAB.
 * The button navigates to the create new `User` form when clicked.
 * @param {UserAddFabProps} props - Component properties.
 */
const UserAddFab = ({
  className,
  horizontal = 'end',
  slot = 'fixed',
  testid = 'fab-user-add',
  vertical = 'bottom',
  ...fabProps
}: UserAddFabProps) => {
  return (
    <IonFab
      className={classNames('ls-user-add-fab', className)}
      data-testid={testid}
      slot={slot}
      vertical={vertical}
      horizontal={horizontal}
      {...fabProps}
    >
      <IonFabButton>
        <Icon className="ls-user-add-fab__icon" icon="plus" />
      </IonFabButton>
    </IonFab>
  );
};

export default UserAddFab;
