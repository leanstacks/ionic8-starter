import { IonAvatar } from '@ionic/react';
import classNames from 'classnames';

import './Avatar.scss';
import { BaseComponentProps } from '../types';

/**
 * The Avatar shape values.
 */
type AvatarShape = 'round' | 'rounded' | 'square';

/**
 * The Avatar size values.
 */
type AvatarSize = 'small' | 'default' | 'large';

/**
 * Properties for the `Avatar` component.
 * @param {AvatarShape} [shape] - Optional. The avatar shape. Default: `rounded`.
 * @param {AvatarSize} [size] - Optional. The avatar size. Default: `default`.
 * @param {string} [src] - Optional. An image source.
 * @param {string} value - Generated Avatar value.
 * @see {@link BaseComponentProps}
 * @see {@link IonAvatar}
 */
interface AvatarProps extends BaseComponentProps {
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  value: string;
}

/**
 * List of possible colors for generated Avatars.
 */
const COLORS = [
  'ls-avatar--primary',
  'ls-avatar--secondary',
  'ls-avatar--tertiary',
  'ls-avatar--success',
  'ls-avatar--warning',
  'ls-avatar--danger',
];

/**
 * The `Avatar` component renders an icon which uniquely represents a person or
 * think (e.g. team, group, company, etc.).
 *
 * When `src` is supplied, an `<img />` will be rendered.
 *
 * When `src` is empty, the `value` attribute is used to generate an Avatar using
 * first character of the `value`.
 * @param {AvatarProps} props - Component properties.
 * @returns JSX
 */
const Avatar = ({ className, shape = 'rounded', size = 'default', src, testid = 'avatar', value }: AvatarProps) => {
  const trimmedValue = value.trim();
  const initial = trimmedValue ? trimmedValue.charAt(0) : '?';

  const colorClass = COLORS[trimmedValue.length % COLORS.length];

  return (
    <IonAvatar
      className={classNames(
        'ls-avatar',
        { 'ls-avatar--round': shape === 'round' },
        { 'ls-avatar--square': shape === 'square' },
        { 'ls-avatar--small': size === 'small' },
        { 'ls-avatar--large': size === 'large' },
        className,
      )}
      data-testid={testid}
      title={trimmedValue}
    >
      {src ? (
        <img className="ls-avatar__image" src={src} alt={value} data-testid={`${testid}-image`} />
      ) : (
        <div className={classNames('ls-avatar__initial', colorClass)} data-testid={`${testid}-initial`}>
          {initial}
        </div>
      )}
    </IonAvatar>
  );
};

export default Avatar;
