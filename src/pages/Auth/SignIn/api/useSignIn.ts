import { useMutation, useQueryClient } from '@tanstack/react-query';
import find from 'lodash/find';
import { add } from 'date-fns';

import { User } from 'common/models/user';
import { UserTokens } from 'common/models/auth';
import { QueryKey, StorageKey } from 'common/utils/constants';
import storage from 'common/utils/storage';
import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';

/**
 * An API hook which authenticates a `User`.
 * @returns Returns a `UseMutationResult` with `User` data.
 */
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  /**
   * Authenticates a user.
   * @param {string} username - A username.
   * @returns Returns a Promise which resolves to a `User` if successful,
   * otherwise throws an Error.
   */
  const signIn = async (username: string): Promise<User> => {
    // TODO: This is a contrived "signin" approach for demonstration purposes.
    //       You should implement authentication functionality in accordance
    //       with your IdP.

    // fetch all users
    const response = await axios.request<User[]>({
      url: `${config.VITE_BASE_URL_API}/users`,
    });

    // if user matching 'username' is found, consider the user to be authenticated.
    const user = find<User>(response.data, { username });
    if (user) {
      // store current user in localstorage
      storage.setItem(StorageKey.User, JSON.stringify(user));

      // simulate the creation of authentication tokens
      const expires_at = add(new Date(), { hours: 1 }).toISOString();
      const tokens: UserTokens = {
        access_token: 'access_token',
        id_token: 'id_token',
        refresh_token: 'refresh_token',
        token_type: 'bearer',
        expires_at,
        expires_in: 3600,
      };
      storage.setItem(StorageKey.UserTokens, JSON.stringify(tokens));

      return user;
    } else {
      throw new Error('Authentication failed.');
    }
  };

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.UserTokens] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.Users, 'current'] });
    },
  });
};
