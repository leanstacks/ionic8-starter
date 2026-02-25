import { useMutation, useQueryClient } from '@tanstack/react-query';
import reject from 'lodash/reject';

import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';
import { User } from 'common/models/user';
import { QueryKey } from 'common/utils/constants';

/**
 * The `useDeleteUser` mutation function variables.
 * @param {number} id - A `User` identifier.
 */
export type DeleteUserVariables = {
  id: number;
};

/**
 * An API hook which deletes a single `User`. Returns a `UseMutationResult`
 * object whose `mutate` attribute is a function to delete a `User`.
 *
 * When successful, thehook updates the cached `User` data.
 *
 * @returns Returns a `UseMutationResult`.
 */
export const useDeleteUser = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  /**
   * Delete a `User`.
   * @param {DeleteUserVariables} variables - The mutation function variables.
   * @returns {Promise<void>} A Promise which resolves `void` when successful.
   */
  const deleteUser = async ({ id }: DeleteUserVariables): Promise<void> => {
    const response = await axios.request({
      method: 'delete',
      url: `${config.VITE_BASE_URL_API}/users/${id}`,
    });

    return response.data;
  };

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (data, variables) => {
      queryClient.setQueryData<User[]>([QueryKey.Users], (cachedUsers) =>
        cachedUsers ? [...reject(cachedUsers, { id: variables.id })] : [],
      );
    },
  });
};
