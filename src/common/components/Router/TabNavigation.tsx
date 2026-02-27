import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from 'react-router';
import { useTranslation } from 'react-i18next';

import './TabNavigation.scss';
import AppMenu from '../Menu/AppMenu';
import Icon from '../Icon/Icon';
import HomePage from 'pages/Home/HomePage';
import UserDetailPage from 'pages/Users/components/UserDetail/UserDetailPage';
import UserListPage from 'pages/Users/components/UserList/UserListPage';
import UserEditPage from 'pages/Users/components/UserEdit/UserEditPage';
import AccountPage from 'pages/Account/AccountPage';
import ProfilePage from 'pages/Account/components/Profile/ProfilePage';
import DiagnosticsPage from 'pages/Account/components/Diagnostics/DiagnosticsPage';

/**
 * The `TabNavigation` component provides a router outlet for all of the
 * application routes. The component renders two main application
 * navigation controls.
 *
 * On smaller viewport sizes, Ionic mobile tab navigation is rendered at
 * the bottom of the page.
 *
 * On larger viewport sizes, the Ionic [side] menu is rendered. The menu
 * may be toggled using the hamburger (three lines) icon in the top
 * toolbar.
 *
 * @see {@link AppMenu}
 */
const TabNavigation = () => {
  const { t } = useTranslation();

  return (
    <>
      <AppMenu />

      <IonTabs className="ls-tab-navigation">
        <IonRouterOutlet id="content-main">
          <Redirect exact path="/tabs" to="/tabs/home" />
          <Route exact path="/tabs/home">
            <HomePage />
          </Route>
          <Route exact path="/tabs/users">
            <UserListPage />
          </Route>
          <Route exact path="/tabs/users/:userId">
            <UserDetailPage />
          </Route>
          <Route exact path="/tabs/users/:userId/edit">
            <UserEditPage />
          </Route>
          <Route exact path="/tabs/account">
            <AccountPage />
          </Route>
          <Route exact path="/tabs/account/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/tabs/account/diagnostics">
            <DiagnosticsPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/tabs/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="ls-tab-navigation__bar ion-hide-md-up">
          <IonTabButton className="ls-tab-navigation__bar-button" tab="home" href="/tabs/home">
            <Icon className="ls-tab-navigation__bar-button-icon" icon="house" size="xl" fixedWidth />
            <IonLabel>{t('navigation.home')}</IonLabel>
          </IonTabButton>
          <IonTabButton className="ls-tab-navigation__bar-button" tab="users" href="/tabs/users">
            <Icon className="ls-tab-navigation__bar-button-icon" icon="users" size="xl" fixedWidth />
            <IonLabel>{t('navigation.users')}</IonLabel>
          </IonTabButton>
          <IonTabButton className="ls-tab-navigation__bar-button" tab="account" href="/tabs/account">
            <Icon className="ls-tab-navigation__bar-button-icon" icon="userGear" size="xl" fixedWidth />
            <IonLabel>{t('navigation.account')}</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </>
  );
};

export default TabNavigation;
