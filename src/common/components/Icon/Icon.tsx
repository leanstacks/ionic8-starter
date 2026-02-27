import { ComponentPropsWithoutRef } from 'react';
import { IonText } from '@ionic/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faBuilding,
  faCalendar,
  faCircleInfo,
  faEnvelope,
  faHouse,
  faLink,
  faMapLocationDot,
  faMinus,
  faPenToSquare,
  faPhone,
  faPlus,
  faSignOutAlt,
  faTrash,
  faTriangleExclamation,
  faUser,
  faUserGear,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { BaseComponentProps } from '../types';

/**
 * A union type of all Font Awesome icon names (without the `fa-` prefix)
 * used in the applciation.
 */
export type IconName =
  | 'building'
  | 'calendar'
  | 'circleInfo'
  | 'envelope'
  | 'house'
  | 'link'
  | 'mapLocationDot'
  | 'minus'
  | 'penToSquare'
  | 'phone'
  | 'plus'
  | 'signOut'
  | 'trash'
  | 'triangleExclamation'
  | 'user'
  | 'users'
  | 'userGear'
  | 'xmark';

/**
 * Properties for the `Icon` component.
 * @see {@link BaseComponentProps}
 * @see {@link FontAwesomeIcon}
 */
export interface IconProps
  extends
    BaseComponentProps,
    Omit<ComponentPropsWithoutRef<typeof FontAwesomeIcon>, 'color' | 'icon'>,
    Pick<ComponentPropsWithoutRef<typeof IonText>, 'color' | 'slot'> {
  icon: IconName;
}

/**
 * A key/value mapping of every icon used in the application.
 */
const icons: Record<IconName, IconProp> = {
  building: faBuilding,
  calendar: faCalendar,
  circleInfo: faCircleInfo,
  envelope: faEnvelope,
  house: faHouse,
  link: faLink,
  mapLocationDot: faMapLocationDot,
  minus: faMinus,
  penToSquare: faPenToSquare,
  phone: faPhone,
  plus: faPlus,
  signOut: faSignOutAlt,
  trash: faTrash,
  triangleExclamation: faTriangleExclamation,
  userGear: faUserGear,
  user: faUser,
  users: faUsers,
  xmark: faXmark,
};

/**
 * The `Icon` component renders an icon. Wraps the `FontAwesomeIcon` component.
 *
 * @param {IconProps} props - Component properties.
 * @see {@link FontAwesomeIcon}
 */
const Icon = ({ className, color, icon, slot = '', testid = 'icon', ...iconProps }: IconProps) => {
  const faIcon = icons[icon];

  return (
    <IonText color={color} slot={slot} data-testid={testid}>
      <FontAwesomeIcon
        className={classNames('ls-icon', className)}
        icon={faIcon}
        {...iconProps}
        data-testid={`${testid}-icon`}
      />
    </IonText>
  );
};

export default Icon;
