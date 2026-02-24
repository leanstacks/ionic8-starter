import { ComponentPropsWithoutRef } from 'react';
import { IonSearchbar } from '@ionic/react';
import classNames from 'classnames';

import './Searchbar.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `Searchbar` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonSearchbar}
 */
interface SearchbarProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonSearchbar> {}

/**
 * The `Searchbar` component renders a standardized `IonSearchbar`.
 * @param {SearchbarProps} props - Component properties.
 * @returns {JSX.Element} JSX
 * @see {@link IonSearchbar}
 */
const Searchbar = ({ className, testid = 'ls-searchbar', ...props }: SearchbarProps) => {
  return <IonSearchbar className={classNames('ls-searchbar', className)} data-testid={testid} {...props} />;
};

export default Searchbar;
