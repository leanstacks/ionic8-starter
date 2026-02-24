import { IonAlert } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserDeleteAlert.scss';
import { BaseComponentProps } from 'common/components/types';
import { User } from 'common/models/user';
import { useDeleteUser } from 'pages/Users/api/useDeleteUser';

/**
 * Properties for the `UserDetailAlert` component.
 * @param {function} [isPending] - Optional. Function called when the delete
 * operation is in progress.
 * @param {function} [onCancel] - Optional. Function called when the `Cancel`
 * button is pressed.
 * @param {function} [onError] - Optional. Function called when the delete
 * operation results in an Error.
 * @param {function} [onSuccess] - Optional. Function called when the delete
 * operation completes successfully.
 * @param {User} user - The `User` to be deleted.
 * @see {@link BaseComponentProps}
 * @see {@link IonAlert}
 */
interface UserDeleteAlertProps extends BaseComponentProps, Pick<ComponentPropsWithoutRef<typeof IonAlert>, 'isOpen'> {
  isPending?: (isPending: boolean) => void;
  onCancel?: () => void;
  onError?: () => void;
  onSuccess?: () => void;
  user: User;
}

/**
 * The `UserDeleteAlert` component is a wrapper for `IonAlert`. Use the
 * `UserDeleteAlert` component to render an alert to confirm the deletion
 * of a `User`.
 * @param {UserDeleteAlertProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const UserDeleteAlert = ({
  className,
  isOpen,
  isPending,
  onCancel,
  onError,
  onSuccess,
  testid = 'alert-user-delete',
  user,
}: UserDeleteAlertProps) => {
  const { isPending: isDeleting, mutate: deleteUser } = useDeleteUser();
  const { t } = useTranslation();

  const doDeleteUser = () => {
    isPending?.(true);
    deleteUser(
      { id: user.id },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: () => {
          onError?.();
        },
        onSettled: () => {
          isPending?.(false);
        },
      },
    );
  };

  return (
    <IonAlert
      className={classNames('ls-user-delete-alert', className)}
      data-testid={testid}
      buttons={[
        {
          handler: () => {
            onCancel?.();
          },
          htmlAttributes: {
            disabled: isDeleting,
            'data-testid': `${testid}-button-cancel`,
          },
          text: t('label.cancel'),
        },
        {
          handler: () => {
            doDeleteUser();
            return false;
          },
          htmlAttributes: { disabled: isDeleting, 'data-testid': `${testid}-button-delete` },
          text: t('label.delete'),
        },
      ]}
      header={isDeleting ? t('delete.deleting', { ns: 'user' }) : t('confirm-prompt')}
      isOpen={isOpen}
      message={
        isDeleting
          ? t('delete.in-progress', { name: user?.name, ns: 'user' })
          : t('delete.warning', { name: user?.name, ns: 'user' })
      }
    />
  );
};

export default UserDeleteAlert;
