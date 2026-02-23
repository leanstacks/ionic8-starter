import { useTranslation } from 'react-i18next';

import MessageCard, { MessageCardProps } from './MessageCard';

/**
 * The `EmptyCard` component renders a `MessageCard` displaying information
 * when there is no data to display. For example, when a list of items has
 * no items to display.
 * @param {MessageCardProps} props - Component properties.
 * @returns JSX
 */
const EmptyCard = ({ icon = 'circleInfo', testid = 'card-empty', title, ...cardProps }: MessageCardProps) => {
  const { t } = useTranslation();
  title ??= t('error-no-data');

  return <MessageCard icon={icon} testid={testid} title={title} {...cardProps} />;
};

export default EmptyCard;
