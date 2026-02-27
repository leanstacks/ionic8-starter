import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

import { BaseComponentProps } from '../types';

/**
 * Properties for the `CardRow` component.
 * @see {@link BaseComponentProps}
 * @see {@link IonCol}
 */
interface CardRowProps extends BaseComponentProps, ComponentPropsWithoutRef<typeof IonCol> {}

/**
 * The `CardRow` component displays an `IonCard` (or other Card component)
 * in a horizontal row, an `IonRow`.
 *
 * The content is horizontally and vertically centered within the row. The
 * card width is responsive, adjusting based upon the viewport size.
 * @param {CardRowProps} props - Component properties.
 */
const CardRow = ({
  className,
  testid = 'row-card',
  sizeMd = '8',
  offsetMd = '2',
  sizeLg = '6',
  offsetLg = '3',
  ...colProps
}: CardRowProps) => {
  return (
    <IonGrid className={classNames('ls-card-row', className)} data-testid={testid}>
      <IonRow>
        <IonCol sizeMd={sizeMd} offsetMd={offsetMd} sizeLg={sizeLg} offsetLg={offsetLg} {...colProps} />
      </IonRow>
    </IonGrid>
  );
};

export default CardRow;
