import { IonSkeletonText } from '@ionic/react';
import classNames from 'classnames';

import { BaseComponentProps } from '../types';

/**
 * Properties for the `LoaderSkeleton` component.
 * @see {@link BaseComponentProps}
 */
interface LoaderSkeletonProps extends BaseComponentProps {
  animated?: boolean;
  heightStyle?: string;
  widthStyle?: string;
}

/**
 * The `LoaderSkeleton` component renders an `IonSkeletonText` which displays
 * a skeleton loader. This placeholder content is typically used to inform
 * the user that the content is loading.
 * @param {LoaderSkeletonProps} props - Component properties.
 * @returns JSX
 */
const LoaderSkeleton = ({
  animated = false,
  className,
  heightStyle,
  testid = 'loader-skeleton',
  widthStyle,
}: LoaderSkeletonProps) => {
  const styles = {
    height: heightStyle,
    width: widthStyle,
  };

  return (
    <IonSkeletonText
      animated={animated}
      className={classNames('ls-loader-skeleton', className)}
      data-testid={testid}
      style={styles}
    ></IonSkeletonText>
  );
};

export default LoaderSkeleton;
