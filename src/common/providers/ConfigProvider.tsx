import { PropsWithChildren, useEffect, useState } from 'react';
import { ObjectSchema, ValidationError, number, object, string } from 'yup';
import { useTranslation } from 'react-i18next';

import { Config, ConfigContext } from './ConfigContext';

/**
 * The `ConfigContextProvider` React component creates, maintains, and provides
 * access to the `ConfigContext` value.
 * Validates the React application configuration values from `import.meta.env`.
 * Throws an `Error` when the configuration is invalid, preventing application
 * startup.
 * @param {PropsWithChildren} props - Component properties, `PropsWithChildren`.
 * @returns {JSX.Element} JSX
 */
const ConfigContextProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { t } = useTranslation();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [config, setConfig] = useState<Config>();

  /**
   * The configuration validation schema.
   * @see {@link https://github.com/jquense/yup | Yup}
   */
  const configSchema: ObjectSchema<Config> = object({
    VITE_BASE_URL_API: string()
      .url()
      .required(({ path }) => t('validation.required-path', { path })),
    VITE_BUILD_DATE: string().default('1970-01-01'),
    VITE_BUILD_TIME: string().default('00:00:00'),
    VITE_BUILD_TS: string().default('1970-01-01T00:00:00+0000'),
    VITE_BUILD_COMMIT_SHA: string().default('local'),
    VITE_BUILD_ENV_CODE: string().default('local'),
    VITE_BUILD_WORKFLOW_RUNNER: string().default('local'),
    VITE_BUILD_WORKFLOW_NAME: string().default('local'),
    VITE_BUILD_WORKFLOW_RUN_NUMBER: number().default(1),
    VITE_BUILD_WORKFLOW_RUN_ATTEMPT: number().default(-1),
    VITE_TOAST_AUTO_DISMISS_MILLIS: number().default(5000),
  });

  useEffect(() => {
    try {
      const validatedConfig = configSchema.validateSync(import.meta.env, {
        abortEarly: false,
        stripUnknown: true,
      });
      setConfig(validatedConfig);
      setIsReady(true);
    } catch (err) {
      if (err instanceof ValidationError) {
        throw new Error(
          `${t('error-configuration-validation')}. ${err.errors.reduce((msg, error) => `${msg} ${error}`)}`,
        );
      }
      if (err instanceof Error) throw new Error(`${t('error-configuration')}. ${err.message}`);
      throw err;
    }

    // disabling eslint rule because hook is only called on mount and unmount, and we don't want to add dependencies that would cause it to run more than once
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return <ConfigContext.Provider value={config}>{isReady && <>{children}</>}</ConfigContext.Provider>;
};

export default ConfigContextProvider;
