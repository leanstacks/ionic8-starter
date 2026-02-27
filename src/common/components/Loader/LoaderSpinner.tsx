import { IonSpinner, IonText } from '@ionic/react';
import classNames from 'classnames';

import './LoaderSpinner.scss';
import { BaseComponentProps } from '../types';

/**
 * Properties for the `LoaderSpinner` component.
 * @param {string} [text] - Optional. Text to accompany the spinner icon.
 */
interface LoaderSpinnerProps extends BaseComponentProps {
  text?: string;
}

/**
 * The `LoaderSpinner` component renders an `IonSpinner` component which is
 * centered horizontally and vertically within a block.
 *
 * By default the height matches that of the spinner icon; however, you may
 * pass additional classes to modify the height and other styling of this
 * component.
 * @param {LoaderSpinnerProps} props - Component properties.
 */
const LoaderSpinner = ({ className, testid = 'loader-spinner', text }: LoaderSpinnerProps) => {
  return (
    <div className={classNames('ls-loader-spinner', className)} data-testid={testid}>
      <IonSpinner></IonSpinner>
      {text && <IonText className="ls-loader-spinner__text">{text}</IonText>}
    </div>
  );
};

export default LoaderSpinner;
