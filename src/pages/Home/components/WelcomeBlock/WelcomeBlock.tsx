import { useTranslation } from 'react-i18next';

import Block from 'common/components/Block/Block';
import { BaseComponentProps } from 'common/components/types';

/**
 * The `WelcomeBlock` component renders a `Block` of information about the
 * application.
 * @param {BaseComponentProps} props - Component properties.
 * @returns JSX
 */
const WelcomeBlock = ({ className, testid = 'block-welcome' }: BaseComponentProps) => {
  const { t } = useTranslation();

  return (
    <Block
      className={className}
      title={t('welcome')}
      testid={testid}
      content={
        <div>
          {t('welcome.sentence1', { ns: 'home' })} {t('welcome.sentence2.1', { ns: 'home' })}{' '}
          <a href="https://ionic.io/" target="_blank" rel="noreferrer">
            Ionic
          </a>{' '}
          {t('welcome.sentence2.2', { ns: 'home' })}{' '}
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            React
          </a>{' '}
          {t('welcome.sentence2.3', { ns: 'home' })}.
        </div>
      }
    />
  );
};

export default WelcomeBlock;
