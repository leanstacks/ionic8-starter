import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './ContactInfo.scss';
import { BaseComponentProps } from 'common/components/types';
import { User } from 'common/models/user';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';
import Icon from 'common/components/Icon/Icon';
import HeaderRow from 'common/components/Text/HeaderRow';

/**
 * Properties for the `ContactInfo` component.
 * @param {boolean} [isLoading] - Indicates if the `user` is being loaded.
 * @param {boolean} [showHeader] - Indicates if the header should be rendered.
 * @param {User} [user] - A `User` object.
 * @see {@link BaseComponentProps}
 */
interface ContactInfoProps extends BaseComponentProps {
  isLoading?: boolean;
  showHeader?: boolean;
  user?: User;
}

/**
 * The `ContactInfo` component renders a block containing contact information
 * about a single `User` including their email, phone, and website.
 *
 * If `isLoading` is `true` the loading state is rendered.
 *
 * If `isLoading` is `false` and the `user` property is provided, the
 * user attributes are rendered.
 *
 * If `isLoading` is `false` and the `user` property is empty, the
 * component returns `null`.
 *
 * @param {ContactInfoProps} props - Component properties.
 */
const ContactInfo = ({
  className,
  isLoading = false,
  showHeader = true,
  testid = 'contact-info',
  user,
}: ContactInfoProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    // loading state
    return (
      <div
        className={classNames('ls-contact-info ls-contact-info--loading', className)}
        data-testid={`${testid}-loader`}
      >
        {showHeader && (
          <HeaderRow border>
            <LoaderSkeleton animated widthStyle="1.5rem" heightStyle="1.5rem" />
            <LoaderSkeleton animated widthStyle="12rem" heightStyle="1.5rem" />
          </HeaderRow>
        )}
        <div className="ls-contact-info__content">
          <LoaderSkeleton animated widthStyle="20rem" heightStyle="1.25rem" />
          <LoaderSkeleton animated widthStyle="20rem" heightStyle="1.25rem" />
          <LoaderSkeleton animated widthStyle="20rem" heightStyle="1.25rem" />
        </div>
      </div>
    );
  }

  if (user) {
    // success state
    return (
      <div className={classNames('ls-contact-info', className)} data-testid={testid}>
        {showHeader && (
          <HeaderRow border>
            <Icon icon="user" widthAuto />
            <div>{t('contact', { ns: 'user' })}</div>
          </HeaderRow>
        )}
        <div className="ls-contact-info__content">
          {user.email && (
            <div>
              <Icon icon="envelope" />
              <div>{user.email}</div>
            </div>
          )}
          {user.phone && (
            <div>
              <Icon icon="phone" />
              <div>{user.phone}</div>
            </div>
          )}
          {user.website && (
            <div>
              <Icon icon="link" />
              <div>{user.website}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // not loading and no user
  return null;
};

export default ContactInfo;
