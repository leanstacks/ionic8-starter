import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import './Badges.scss';
import { BaseComponentProps } from '../types';

/**
 * Properties for the `Badges` component.
 * @see {@link BaseComponentProps}
 * @see {@link PropsWithChildren}
 */
interface BadgesProps extends BaseComponentProps, PropsWithChildren {}

/**
 * The `Badges` component renders a collection of `IonBadge` components in a
 * flexbox. The badges will wrap as needed.
 * @param {BadgesProps} props - Component properties.
 */
const Badges = ({ children, className, testid = 'badges' }: BadgesProps) => {
  return (
    <div className={classNames('ls-badges', className)} data-testid={testid}>
      {children}
    </div>
  );
};

export default Badges;
