import { IonToast, ToastButton } from '@ionic/react';
import { useState } from 'react';
import classNames from 'classnames';
import { t } from 'i18next';

import { BaseComponentProps } from '../types';
import { ToastData } from 'common/providers/ToastContext';

/**
 * Properties for the `Toast` component.
 * @param {function} [dismiss] - Optional. Function called when Toast is dismissed.
 * @param {ToastData} toast - A `ToastData` object.
 * @see {@link BaseComponentProps}
 */
interface ToastProps extends BaseComponentProps {
  dismiss?: () => void;
  toast: ToastData;
}

/**
 * Creates a standardized `ToastButton` to dismiss a `Toast`.
 * @returns {ToastButton} A `ToastButton`.
 */
export const DismissButton = (): ToastButton => ({
  role: 'cancel',
  text: t('label.dismiss'),
});

/**
 * The `Toast` component renders an `IonToast` using the supplied `toast`
 * property attributes.
 *
 * When the toast is dismissed, the supplied `dismiss` function is invoked
 * when supplied in the properties.
 * @param {ToastProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const Toast = ({ className, dismiss, testid = 'toast', toast }: ToastProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const doDismiss = () => {
    setIsOpen(false);
    dismiss?.();
  };

  return (
    <IonToast
      buttons={toast.buttons}
      className={classNames('ls-toast', className)}
      color={toast.color ?? 'medium'}
      data-testid={testid}
      duration={toast.duration}
      isOpen={isOpen}
      layout={toast.layout ?? 'baseline'}
      message={toast.message}
      position={toast.position ?? 'bottom'}
      positionAnchor={toast.positionAnchor}
      onDidDismiss={doDismiss}
    ></IonToast>
  );
};

export default Toast;
