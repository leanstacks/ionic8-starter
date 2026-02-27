import classNames from 'classnames';

import './Toasts.scss';
import { BaseComponentProps } from '../types';
import { useToasts } from 'common/hooks/useToasts';
import Toast from './Toast';

/**
 * The `Toasts` component renders `Toast` components when toast data is
 * available via the `ToastProvider`.
 *
 * Due to the rigidly fixed positional nature of `IonToast`, each toast is
 * displayed one at a time, i.e. the next toast is displayed after the
 * current one is dismissed.
 *
 * The `Toasts` component also provides a position anchor for the rendering
 * of `Toast` components, ensuring that they are positioned appropriately
 * for the viewport size.
 * @param {BaseComponentProps} props - Component properties.
 */
const Toasts = ({ className, testid = 'toasts' }: BaseComponentProps) => {
  const { removeToast, toasts = [] } = useToasts();
  const toast = toasts[0];

  return (
    <div id="toasts" className={classNames('ls-toasts', className)} data-testid={testid}>
      {toast && (
        <Toast
          dismiss={() => removeToast(toast.id)}
          key={toast.id}
          toast={{ ...toast, positionAnchor: 'toasts' }}
          testid={`toast-${toast.id}`}
        ></Toast>
      )}
    </div>
  );
};

export default Toasts;
