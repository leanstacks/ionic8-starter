import { JSX } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Address } from 'common/models/user';
import { BaseComponentProps } from 'common/components/types';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';
import Icon from 'common/components/Icon/Icon';
import HeaderRow from 'common/components/Text/HeaderRow';

/**
 * Properties for the `AddressDetail` component.
 * @param {Address} [address] - An `Address` object.
 * @param {boolean} [isLoading] - Indicates if the `user` is being loaded.
 * @see {@link BaseComponentProps}
 */
interface AddressDetailProps extends BaseComponentProps {
  address?: Address;
  isLoading?: boolean;
}

/**
 * The `AddressDetail` component renders a block which displays a single
 * `Address`.
 *
 * If `isLoading` is `true` the loading state is rendered.
 *
 * If `isLoading` is `false` and the `address` property is provided, the
 * address attributes are rendered.
 *
 * If `isLoading` is `false` and the `address` property is empty, the
 * component returns `false` so that the component remains in the React
 * hierarchy, but does not render anything.
 *
 * @param {AddressDetailProps} props - Component properties.
 * @returns {JSX.Element | false} Returns JSX when loading or a user is
 * provided, otherwise returns `false`.
 */
const AddressDetail = ({
  address,
  className,
  isLoading = false,
  testid = 'address-detail',
}: AddressDetailProps): JSX.Element | false => {
  const { t } = useTranslation();

  if (isLoading) {
    // loading state
    return (
      <div
        className={classNames('ls-address-detail ls-address-detail--loading', className)}
        data-testid={`${testid}-loader`}
      >
        <HeaderRow border>
          <LoaderSkeleton animated heightStyle="1.5rem" widthStyle="1.5rem" />
          <LoaderSkeleton animated heightStyle="1.5rem" widthStyle="10rem" />
        </HeaderRow>
        <div className="ls-address-detail__content">
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
        </div>
      </div>
    );
  }

  if (address) {
    // success state
    return (
      <div className={classNames('ls-address-detail', className)} data-testid={testid}>
        <HeaderRow border>
          <Icon icon="mapLocationDot" widthAuto />
          <div>{t('address', { ns: 'user' })}</div>
        </HeaderRow>
        <div className="ls-address-detail__content">
          <div>{address.street}</div>
          <div>{address.suite}</div>
          <div>{address.city}</div>
          <div>{address.zipcode}</div>
        </div>
      </div>
    );
  }

  // not loading and no user
  return false;
};

export default AddressDetail;
