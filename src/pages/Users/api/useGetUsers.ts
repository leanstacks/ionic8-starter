import { useQuery } from '@tanstack/react-query';

import { useAxios } from 'common/hooks/useAxios';
import { config } from 'common/utils/config';
import { User } from 'common/models/user';
import { QueryKey } from 'common/utils/constants';

/**
 * An API hook which fetches a collection of `User` objects.
 * @returns Returns a `UseQueryResult` with `User` collection data.
 */
export const useGetUsers = () => {
  const axios = useAxios();

  const getUsers = async (): Promise<User[]> => {
    const response = await axios.request({
      url: `${config.VITE_BASE_URL_API}/users`,
    });

    return response.data;
  };

  return useQuery({
    queryKey: [QueryKey.Users],
    queryFn: () => getUsers(),
  });
};
