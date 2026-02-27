import { IonCol, IonGrid, IonRow } from '@ionic/react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserDetail.scss';
import { BaseComponentProps } from 'common/components/types';
import { useGetUser } from 'pages/Users/api/useGetUser';
import CardRow from 'common/components/Card/CardRow';
import ErrorCard from 'common/components/Card/ErrorCard';
import ContactInfo from './ContactInfo';
import CompanyDetail from './CompanyDetail';
import AddressDetail from './AddressDetail';

/**
 * Properties for the `UserDetail` component.
 * @param {string} [userId] - Optional. A `User` identifier.
 * @see {@link BaseComponentProps}
 */
interface UserDetailProps extends BaseComponentProps {
  userId?: string;
}

/**
 * The `UserDetail` component renders a block of detailed information about a
 * `User`.  The block contains the user summary information, company details,
 * and address details.
 *
 * The component fetches the `User` when the `userId` property is not empty,
 * otherwise a loading state is displayed. If an error is returned, an
 * error message is displayed.
 *
 * @param {UserDetailProps} props - Component properties.
 */
const UserDetail = ({ className, testid = 'user-detail', userId }: UserDetailProps) => {
  const { t } = useTranslation();
  const { data: user, isError, isLoading } = useGetUser({ userId });

  const baseProps = {
    className: classNames('ls-user-detail', className),
    'data-testid': testid,
  };

  // Error state
  if (isError) {
    return (
      <div {...baseProps}>
        <CardRow testid={`${testid}-error`}>
          <ErrorCard content={t('unable-to-retrieve', { ns: 'user' })} />
        </CardRow>
      </div>
    );
  }

  // Success state
  return (
    <div {...baseProps}>
      <IonGrid>
        <IonRow>
          <IonCol sizeXs="12" sizeMd="6" sizeXl="4">
            <ContactInfo
              className="ion-margin-bottom"
              isLoading={isLoading}
              user={user}
              testid={`${testid}-user-summary`}
            />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="6" sizeXl="4">
            <CompanyDetail
              className="ion-margin-bottom"
              company={user?.company}
              isLoading={isLoading}
              testid={`${testid}-company-detail`}
            />
          </IonCol>
          <IonCol sizeXs="12" sizeMd="6" sizeXl="4">
            <AddressDetail
              className="ion-margin-bottom"
              address={user?.address}
              isLoading={isLoading}
              testid={`${testid}-address-detail`}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default UserDetail;
