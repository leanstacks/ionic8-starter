import { useQuery } from '@tanstack/react-query';

import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';
import { User } from 'common/models/user';
import { QueryKey } from 'common/utils/constants';

/**
 * Properties for the `useGetUser` API hook.
 * @param {string} [userId] - A `User` identifier.
 */
interface UseGetUserProps {
  userId?: string;
}

/**
 * An API hook which fetches a single `User` object.
 * @param {UseGetUserProps} props - Hook properties.
 * @returns Returns a `UseQueryResult` with `User` data.
 */
export const useGetUser = ({ userId }: UseGetUserProps) => {
  const axios = useAxios();

  const getUser = async (): Promise<User> => {
    const response = await axios.request({
      url: `${config.VITE_BASE_URL_API}/users/${userId}`,
    });

    return response.data;
  };

  return useQuery({
    queryKey: [QueryKey.Users, userId],
    queryFn: () => getUser(),
    enabled: !!userId,
  });
};
