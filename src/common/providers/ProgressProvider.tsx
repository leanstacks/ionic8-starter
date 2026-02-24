import { useState } from 'react';

import {
  DEFAULT_PROGRESS_BAR,
  ProgressBarProps,
  ProgressContext,
  ProgressContextValue,
  ProgressProviderProps,
} from './ProgressContext';

/**
 * The `ProgessProvider` component creates and provides access to the
 * `ProgressContext` value.
 * @param {ProgressProviderProps} props - Component properties.
 * @returns {JSX.Element} JSX
 */
const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [progressBar, setProgressBar] = useState<ProgressBarProps>(DEFAULT_PROGRESS_BAR);

  const setProgress = (isActive: boolean, props?: ProgressBarProps): void => {
    setIsActive(isActive);
    setProgressBar({ ...DEFAULT_PROGRESS_BAR, ...props });
  };

  const contextValue: ProgressContextValue = {
    isActive,
    progressBar: {
      ...progressBar,
    },
    setIsActive,
    setProgressBar,
    setProgress,
  };

  const isRenderFunction = typeof children === 'function';
  return (
    <ProgressContext.Provider value={contextValue}>
      {isRenderFunction ? children(contextValue) : children}
    </ProgressContext.Provider>
  );
};

export default ProgressProvider;
