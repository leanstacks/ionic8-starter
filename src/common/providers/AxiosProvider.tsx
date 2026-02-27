import { PropsWithChildren, useEffect, useState } from 'react';

import { AxiosContext, customAxios } from './AxiosContext';

/**
 * The `AxiosProvider` React component creates, maintains, and provides
 * access to the `AxiosContext` value.
 * @param {PropsWithChildren} props - Component properties, `PropsWithChildren`.
 */
const AxiosProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // use axios interceptors

    // disabling eslint rule because hook is only called on mount and unmount, and we want to set state after interceptors are set up
    /* eslint-disable react-hooks/set-state-in-effect */
    setIsReady(true);

    return () => {
      // eject axios interceptors
    };
  }, []);

  return <AxiosContext.Provider value={customAxios}>{isReady && <>{children}</>}</AxiosContext.Provider>;
};

export default AxiosProvider;
