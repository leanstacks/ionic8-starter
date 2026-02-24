import { JSX } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { BaseComponentProps } from 'common/components/types';
import { Company } from 'common/models/user';
import LoaderSkeleton from 'common/components/Loader/LoaderSkeleton';
import Icon from 'common/components/Icon/Icon';
import HeaderRow from 'common/components/Text/HeaderRow';

/**
 * Properties for the `CompanyDetail` component.
 * @param {Company} [company] - A `Company` object.
 * @param {boolean} [isLoading] - Indicates if the `user` is being loaded.
 * @see {@link BaseComponentProps}
 */
interface CompanyDetailProps extends BaseComponentProps {
  company?: Company;
  isLoading?: boolean;
}

/**
 * The `CompanyDetail` component renders a block which provides details about
 * a single `Company`.
 *
 * If `isLoading` is `true` the loading state is rendered.
 *
 * If `isLoading` is `false` and the `company` property is provided, the
 * company attributes are rendered.
 *
 * If `isLoading` is `false` and the `company` property is empty, the
 * component returns `false` so that the component remains in the React
 * hierarchy, but does not render anything.
 *
 * @param {CompanyDetailProps} props - Component properties.
 * @returns {JSX.Element | false} Returns JSX when loading or a user is
 * provided, otherwise returns `false`.
 */
const CompanyDetail = ({
  className,
  company,
  isLoading = false,
  testid = 'company-detail',
}: CompanyDetailProps): JSX.Element | false => {
  const { t } = useTranslation();

  if (isLoading) {
    // loading state
    return (
      <div className={classNames('ls-company-detail ls-company-detail--loading')} data-testid={`${testid}-loader`}>
        <HeaderRow border>
          <LoaderSkeleton animated heightStyle="1.5rem" widthStyle="1.5rem" />
          <LoaderSkeleton animated heightStyle="1.5rem" widthStyle="10rem" />
        </HeaderRow>
        <div className="ls-company-detail__content">
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
          <LoaderSkeleton animated heightStyle="1.25rem" widthStyle="20rem" />
        </div>
      </div>
    );
  }

  if (company) {
    // success state
    return (
      <div className={classNames('ls-company-detail', className)} data-testid={testid}>
        <HeaderRow border>
          <Icon icon="building" widthAuto />
          <div>{t('company', { ns: 'user' })}</div>
        </HeaderRow>
        <div className="ls-company-detail__content">
          <div className="font-bold">{company.name}</div>
          <div>{company.catchPhrase}</div>
          <div>{company.bs}</div>
        </div>
      </div>
    );
  }

  // not loading and no user
  return false;
};

export default CompanyDetail;
