import { IonApp, setupIonicReact } from '@ionic/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorPage from 'common/components/Error/ErrorPage';
import { queryClient } from 'common/utils/query-client';
import AuthProvider from 'common/providers/AuthProvider';
import AxiosProvider from 'common/providers/AxiosProvider';
import ToastProvider from 'common/providers/ToastProvider';
import ScrollProvider from 'common/providers/ScrollProvider';
import Toasts from 'common/components/Toast/Toasts';
import AppRouter from 'common/components/Router/AppRouter';

import './theme/main.css';

setupIonicReact();

/**
 * The application root module. The outermost component of the Ionic React
 * application hierarchy. Declares application-wide providers.
 */
const App = () => (
  <IonApp data-testid="app">
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AxiosProvider>
            <ToastProvider>
              <ScrollProvider>
                <AppRouter />
                <Toasts />
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
              </ScrollProvider>
            </ToastProvider>
          </AxiosProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </IonApp>
);

export default App;
