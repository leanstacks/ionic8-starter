import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';
import { User } from 'common/models/user';
import { QueryKey } from 'common/utils/constants';

/**
 * Describes the properties of a `User` needed to create a new `User`.
 */
export type CreateUserDTO = Pick<User, 'email' | 'name' | 'phone' | 'username' | 'website'>;

/**
 * The `useCreateUser` mutation function variables.
 * @param {CreateUserDTO} user - The user to be created.
 */
export type CreateUserVariables = {
  user: CreateUserDTO;
};

/**
 * An API hook which updates a single `User`. Returns a `UseMutationResult`
 * object whose `mutate` attribute is a function to create a `User`.
 *
 * When succesful, the hook updates the cached `User` query data.
 * @returns Returns a `UseMutationResult`.
 */
export const useCreateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  /**
   * Create a `User`.
   * @param {CreateUserVariables} variables - The mutation function variables.
   * @returns {Promise<User>} Returns a Promise which resolves to the created
   * `User`.
   */
  const createUser = async ({ user }: CreateUserVariables): Promise<User> => {
    const response = await axios.request({
      method: 'post',
      url: `${config.VITE_BASE_URL_API}/users`,
      data: user,
    });

    return response.data;
  };

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      // update cached query data
      const userId: string = '' + data.id;
      queryClient.setQueryData<User[]>([QueryKey.Users], (cachedUsers) =>
        cachedUsers ? [...cachedUsers, data] : [data],
      );
      queryClient.setQueryData<User>([QueryKey.Users, userId], data);
      // you may [also|instead] choose to invalidate certain cached queries, triggering refetch
      // queryClient.invalidateQueries({ queryKey: [QueryKey.Users], exact: true });
      // queryClient.invalidateQueries({ queryKey: [QueryKey.Users, userId] });
    },
  });
};
