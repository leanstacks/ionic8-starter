import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from 'test/query-client';
import ConfigContextProvider from 'common/providers/ConfigProvider';
import ToastProvider from 'common/providers/ToastProvider';
import AxiosProvider from 'common/providers/AxiosProvider';
import AuthProvider from 'common/providers/AuthProvider';
import ScrollProvider from 'common/providers/ScrollProvider';

const WithAllProviders = ({ children }: PropsWithChildren) => {
  return (
    <ConfigContextProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AxiosProvider>
            <ToastProvider>
              <ScrollProvider>
                <MemoryRouter>{children}</MemoryRouter>
              </ScrollProvider>
            </ToastProvider>
          </AxiosProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigContextProvider>
  );
};

export default WithAllProviders;
