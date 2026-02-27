import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import classNames from 'classnames';

import './MessageCard.scss';
import { BaseComponentProps } from '../types';
import Icon, { IconProps } from '../Icon/Icon';

/**
 * Properties for the `MessageCard` component.
 * @param {ReactNode} [content] - Optional. Card content.
 * @param {ReactNode} [subtitle] - Optional. Card subtitle.
 * @param {ReactNode} [title] - Optional. Card title.
 * @see {@link BaseComponentProps}
 * @see {@link HTMLIonCardElement}
 * @see {@link HTMLIonIconElement}
 */
export interface MessageCardProps
  extends
    BaseComponentProps,
    Pick<ComponentPropsWithoutRef<typeof IonCard>, 'color'>,
    Partial<Pick<IconProps, 'icon'>> {
  content?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
}

/**
 * The `MessageCard` component displays an `IonCard` which displays an
 * informational message. The card consists of several optional elements
 * to make it flexible. A title line with optional icon.  A subtitle.
 * And the card content.
 * @param {MessageCardProps} props - Component properties.
 */
const MessageCard = ({
  className,
  color,
  content,
  icon,
  subtitle,
  testid = 'card-message',
  title,
}: MessageCardProps) => {
  return (
    <IonCard className={classNames('ls-message-card', className)} data-testid={testid} color={color}>
      {title && (
        <IonCardHeader className="header">
          <IonCardTitle className="ls-message-card__header">
            {icon && <Icon className="ls-message-card__header-icon" icon={icon} data-testid={`${testid}-icon`} />}
            <div className="ls-message-card__header-title" data-testid={`${testid}-title`}>
              {title}
            </div>
          </IonCardTitle>
          {subtitle && (
            <IonCardSubtitle className="ls-message-card__subtitle" data-testid={`${testid}-subtitle`}>
              {subtitle}
            </IonCardSubtitle>
          )}
        </IonCardHeader>
      )}

      {content && (
        <IonCardContent className="ls-message-card__content" data-testid={`${testid}-content`}>
          {content}
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default MessageCard;
