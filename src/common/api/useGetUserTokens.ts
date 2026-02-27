import { useQuery } from '@tanstack/react-query';
import { isBefore } from 'date-fns';

import { UserTokens } from 'common/models/auth';
import { QueryKey, StorageKey } from 'common/utils/constants';
import storage from 'common/utils/storage';

/**
 * An API hook which fetches tokens from the application Identity Provider, IdP.
 * This hook contains example logic which should be replaced with an actual
 * IdP integration.
 * @returns Returns a `UseQueryResult` with `UserTokens` data.
 */
export const useGetUserTokens = () => {
  const getUserTokens = async (): Promise<UserTokens> => {
    // TODO: replace with logic to fetch tokens from your IdP
    return new Promise((resolve, reject) => {
      const storedTokens = storage.getItem(StorageKey.UserTokens);

      if (storedTokens) {
        // tokens found
        const tokens = JSON.parse(storedTokens) as unknown as UserTokens;
        const now = new Date();
        if (isBefore(now, new Date(tokens.expires_at))) {
          // tokens not expired
          return resolve(tokens);
        } else {
          // tokens expired
          return reject(new Error('Tokens expired.'));
        }
      }

      // tokens not found
      return reject(new Error('Tokens not found.'));
    });
  };

  return useQuery({
    queryKey: [QueryKey.UserTokens],
    queryFn: () => getUserTokens(),
    retry: 0,
    refetchInterval: 60000,
  });
};
