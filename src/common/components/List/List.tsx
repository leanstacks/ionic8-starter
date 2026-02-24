import { ComponentPropsWithoutRef } from 'react';
import { IonList } from '@ionic/react';
import classNames from 'classnames';

import './List.scss';
import { PropsWithTestId } from '../types';

/**
 * Properties for the `List` component.
 * @see {@link PropsWithTestId}
 * @see {@link IonList}
 */
interface ListProps extends PropsWithTestId, ComponentPropsWithoutRef<typeof IonList> {}

/**
 * The `List` component is a wrapper for the Ionic `IonList` component. Renders
 * and standardized implementation of `IonList`.
 *
 * @param {ListProps} props - Component properties.
 * @returns {JSX.Element} JSX
 * @see {@link IonList}
 */
const List = ({ className, testid = 'list', ...listProps }: ListProps) => {
  return <IonList className={classNames('ls-list', className)} data-testid={testid} {...listProps} />;
};

export default List;
