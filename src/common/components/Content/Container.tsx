import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { BaseComponentProps } from '../types';
import './Container.scss';

/**
 * Properties for the `Container` component.
 * @param {boolean} [fixed] - Indicates if a `fixed` sized container is used.
 * @see {@link BaseComponentProps}
 * @see {@link PropsWithChildren}
 */
interface ContainerProps extends BaseComponentProps, PropsWithChildren {
  fixed?: boolean;
}

/**
 * The `Container` component controls the width of the enclosed content.
 *
 * A standard `Container` is 100% wide.
 *
 * A `fixed` `Container` is 100% wide at extra-small and small viewports. It
 * has a fixed width and is centered at medium, large, and extra-large viewports.
 *
 * @param {ContainerProps} props - Component properties.
 */
const Container = ({ children, className, fixed = false, testid = 'container' }: ContainerProps) => {
  return (
    <div className={classNames('ls-container', { 'ls-container--fixed': fixed }, className)} data-testid={testid}>
      {children}
    </div>
  );
};

export default Container;
