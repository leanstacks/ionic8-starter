import { useMutation, useQueryClient } from '@tanstack/react-query';
import reject from 'lodash/reject';

import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';
import { User } from 'common/models/user';
import { QueryKey } from 'common/utils/constants';

/**
 * The `useUpdateUser` mutation function variables.
 * @param {User} user - The updated `User` object.
 */
export type UpdateUserVariables = {
  user: User;
};

/**
 * An API hook which updates a single `User`. Returns a `UseMutationResult`
 * object whose `mutate` attribute is a function to update a `User`.
 *
 * When successful, the hook updates the cached `User` query data.
 *
 * @returns Returns a `UseMutationResult`.
 */
export const useUpdateUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  /**
   * Update a `User`.
   * @param {UpdateUserVariables} variables - The mutation function variables.
   * @returns {Promise<User>} A Promise which resolves to the updated `User`.
   */
  const updateUser = async ({ user }: UpdateUserVariables): Promise<User> => {
    const response = await axios.request({
      method: 'put',
      url: `${config.VITE_BASE_URL_API}/users/${user.id}`,
      data: user,
    });

    return response.data;
  };

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      // update cached query data
      const userId: string = '' + variables.user.id;
      queryClient.setQueryData<User[]>([QueryKey.Users], (cachedUsers) =>
        cachedUsers ? [...reject(cachedUsers, { id: data.id }), data] : [data],
      );
      queryClient.setQueryData<User>([QueryKey.Users, userId], data);
      // you may [also|instead] choose to invalidate certain cached queries, triggering refetch
      // queryClient.invalidateQueries({ queryKey: [QueryKey.Users], exact: true });
      // queryClient.invalidateQueries({ queryKey: [QueryKey.Users, data.id] });
    },
  });
};
