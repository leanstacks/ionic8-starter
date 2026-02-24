import { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';

import './Header.scss';
import { PropsWithTestId } from '../types';
import logo from 'assets/logo_ls.png';
import { useProgress } from 'common/hooks/useProgress';
import { useAuth } from 'common/hooks/useAuth';

/**
 * Properties for the `Header` component.
 * @param {boolean} [backButton] - Optional. Indicates the back button
 * should be rendered.
 * @param {ReactNode} [buttons] - Optional. One or more buttons, specific
 * to the page.
 * @param {string} [defaultHref] - Optional. The default back navigation
 * href if there is no history in the route stack.
 * @param {string} [title] - Optional. The header title.
 * @param [toolbars] - Optional. Array of IonToolbar properties objects
 * each describing an additional toolbar to appear in the header.
 * @see {@link PropsWithTestId}
 * @see {@link IonBackButton}
 * @see {@link IonToolbar}
 */
interface HeaderProps extends PropsWithTestId, Pick<ComponentPropsWithoutRef<typeof IonBackButton>, 'defaultHref'> {
  backButton?: boolean;
  buttons?: ReactNode;
  title?: string;
  toolbars?: ComponentPropsWithoutRef<typeof IonToolbar>[];
}

const Header = ({ backButton = false, buttons, defaultHref, testid = 'header-app', title, toolbars }: HeaderProps) => {
  const { isAuthenticated } = useAuth();
  const { isActive: isActiveProgressBar, progressBar } = useProgress();
  const { t } = useTranslation();

  return (
    <IonHeader className="ls-header" data-testid="header-app">
      <IonToolbar>
        <IonButtons slot="start">
          {backButton ? (
            <IonBackButton defaultHref={defaultHref} data-testid={`${testid}-button-back`} />
          ) : (
            <img className="ls-header__logo" src={logo} alt="Logo" data-testid={`${testid}-image-logo`} />
          )}
        </IonButtons>
        <IonTitle className="ion-hide-md-up" data-testid={`${testid}-title`}>
          {title}
        </IonTitle>
        <IonButtons className="ls-header__nav-main ion-hide-md-down" data-testid={`${testid}-menu-row`}>
          {isAuthenticated && (
            <>
              <IonButton routerLink="/tabs/home">{t('navigation.home')}</IonButton>
              <IonButton routerLink="/tabs/users">{t('navigation.users')}</IonButton>
            </>
          )}
        </IonButtons>
        <IonButtons className="ls-header__nav-end" slot="end">
          {isAuthenticated && (
            <IonMenuButton
              autoHide={false}
              menu="menu-app"
              className="ion-hide-md-down"
              data-testid={`${testid}-button-menu`}
            ></IonMenuButton>
          )}
          {buttons}
        </IonButtons>

        {isActiveProgressBar && !toolbars && <IonProgressBar {...progressBar} />}
      </IonToolbar>

      {toolbars?.map((toolbarProps, index) => {
        const isLastToolbar: boolean = toolbars.length === index + 1;
        const showProgressBar: boolean = isActiveProgressBar && isLastToolbar;
        const { children, ...props } = toolbarProps;
        return (
          <IonToolbar key={index} {...props}>
            {children}
            {showProgressBar && <IonProgressBar {...progressBar} />}
          </IonToolbar>
        );
      })}
    </IonHeader>
  );
};

export default Header;
