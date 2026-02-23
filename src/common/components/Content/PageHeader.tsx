import classNames from 'classnames';

import './PageHeader.scss';
import HeaderRow, { HeaderRowProps } from '../Text/HeaderRow';

/**
 * The `PageHeader` component displays a block intended for the top of a page.
 * The block displays the page title and an optional collection of buttons.
 *
 * When provided, the buttons will be rendered at the far right of the page
 * header.
 *
 * Example:
 * ```
 * <PageHeader border inset className="ion-hide-md-down">
 *   <Avatar value={user.name} />
 *   <IonText data-testid={`${testid}-title`}>{user.name}</IonText>
 * </PageHeader>
 * ```
 *
 * @param {HeaderRowProps} props - Component properties.
 * @returns {JSX.Element} Returns JSX.
 */
const PageHeader = ({ className, testid = 'page-header', ...props }: HeaderRowProps) => {
  return <HeaderRow className={classNames('ls-page-header', className)} data-testid={testid} {...props} />;
};

export default PageHeader;
