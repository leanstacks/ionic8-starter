import {
  IonButton,
  IonButtons,
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  RefresherEventDetail,
  SearchbarCustomEvent,
} from '@ionic/react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './UserListPage.scss';
import { PropsWithTestId } from 'common/components/types';
import { QueryKey } from 'common/utils/constants';
import { useScrollContext } from 'common/hooks/useScrollContext';
import Header from 'common/components/Header/Header';
import Searchbar from 'common/components/Searchbar/Searchbar';
import Container from 'common/components/Content/Container';
import PageHeader from 'common/components/Content/PageHeader';
import UserList from './UserList';
import UserGrid from './UserGrid';
import ProgressProvider from 'common/providers/ProgressProvider';
import UserAddFab from '../UserAdd/UserAddFab';
import Icon from 'common/components/Icon/Icon';
import UserAddModal from '../UserAdd/UserAddModal';

/**
 * The `UserListPage` component renders a list of all `User` objects.
 */
export const UserListPage = ({ testid = 'page-user-list' }: PropsWithTestId) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { handleIonScroll, scrollDirection } = useScrollContext();

  /**
   * Handle pull to refresh events.
   * @param {CustomEvent} event - The refresh event.
   */
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await queryClient.refetchQueries({ queryKey: [QueryKey.Users], exact: true });
    event.detail.complete();
  };

  /**
   * Handle changes to the search toolbar value as a user types.
   * @param {SearchbarCustomEvent} event - The event.
   */
  const handleInputSearch = (event: SearchbarCustomEvent) => {
    setSearch(event.target.value ?? '');
  };

  return (
    <IonPage className="ls-user-list-page" data-testid={testid}>
      <ProgressProvider>
        <Header
          title={t('navigation.users')}
          toolbars={[
            {
              children: <Searchbar debounce={500} onIonInput={handleInputSearch} />,
              className: classNames('ls-user-list-page__searchbar', {
                'ion-hide': scrollDirection === 'down',
              }),
            },
          ]}
        />

        <IonContent scrollEvents onIonScroll={handleIonScroll}>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <Container fixed>
            <PageHeader border inset className="ion-margin-top ion-hide-md-down">
              <IonText>{t('navigation.users')}</IonText>
              <IonButtons>
                <IonButton
                  shape="round"
                  title={t('add-user', { ns: 'user' })}
                  onClick={() => setIsOpenModal(true)}
                  data-testid={`${testid}-page-header-button-create`}
                >
                  <Icon icon="plus" size="xl" />
                </IonButton>
              </IonButtons>
            </PageHeader>
            <UserList className="ion-hide-md-up ls-user-list-page__list" filterBy={search} />
            <UserGrid className="ion-hide-md-down" filterBy={search} />
          </Container>
          <UserAddFab className="ion-hide-md-up" onClick={() => setIsOpenModal(true)} />
          <UserAddModal isOpen={isOpenModal} setIsOpen={setIsOpenModal} />
        </IonContent>
      </ProgressProvider>
    </IonPage>
  );
};

export default UserListPage;
