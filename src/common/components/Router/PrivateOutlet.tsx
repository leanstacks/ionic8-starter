import { PropsWithChildren } from 'react';
import { Redirect } from 'react-router';

import { useAuth } from 'common/hooks/useAuth';

const PrivateOutlet = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated ? children : <Redirect to="/auth/signin" />}</>;
};

export default PrivateOutlet;
