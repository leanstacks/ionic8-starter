import { useTranslation } from 'react-i18next';

import MessageCard, { MessageCardProps } from './MessageCard';

/**
 * The `ErrorCard` component renders a `MessageCard` displaying information
 * describing an exceptional event which has occurred.
 * @param {MessageCardProps} props - Component properties.
 * @returns JSX
 */
const ErrorCard = ({
  color = 'danger',
  icon = 'triangleExclamation',
  testid = 'card-error',
  title,
  ...cardProps
}: MessageCardProps) => {
  const { t } = useTranslation();
  title ??= t('error-generic');

  return <MessageCard color={color} icon={icon} testid={testid} title={title} {...cardProps} />;
};

export default ErrorCard;
