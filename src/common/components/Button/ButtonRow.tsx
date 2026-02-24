import { IonRow } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

import './ButtonRow.scss';
import { BaseComponentProps } from '../types';

/**
 * Properties for the `ButtonRow` component.
 * @see {@link BaseComponentProps}
 * @see {@link IonRow}
 */
interface ButtonRowProps extends BaseComponentProps, ComponentPropsWithoutRef<typeof IonRow> {
  expand?: 'block';
}

/**
 * The `ButtonRow` component renders an `IonRow` for the display of one or more
 * `IonButton` components in a horizontal row.
 *
 * Use the `expand` property control how buttons are displayed within the row.
 * @param {ButtonRowProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const ButtonRow = ({ className, expand, testid = 'row-button', ...rowProps }: ButtonRowProps) => {
  return (
    <IonRow
      className={classNames('ls-button-row', { 'ls-button-row--block': expand === 'block' }, className)}
      data-testid={testid}
      {...rowProps}
    />
  );
};

export default ButtonRow;
