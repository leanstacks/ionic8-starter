import { describe, expect, it, vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';

import { render, screen } from 'test/test-utils';
import * as UseGetUsers from 'pages/Users/api/useGetUsers';
import { User } from 'common/models/user';
import UserList from '../UserList';

describe('UserList', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<UserList />);
    await screen.findByTestId('list-user');

    // ASSERT
    expect(screen.getByTestId('list-user')).toBeDefined();
  });

  it('should render list', async () => {
    // ARRANGE
    render(<UserList />);
    await screen.findByTestId('list-item-user-1');

    // ASSERT
    expect(screen.getByTestId('list-user')).toBeDefined();
    expect(screen.getByTestId('list-item-user-1')).toBeDefined();
    expect(screen.getByTestId('list-item-user-2')).toBeDefined();
  });

  it('should render loading state', async () => {
    // ARRANGE
    const useGetUsersSpy = vi.spyOn(UseGetUsers, 'useGetUsers');
    useGetUsersSpy.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as UseQueryResult<User[], Error>);
    render(<UserList />);
    await screen.findByTestId('list-user-loader');

    // ASSERT
    expect(screen.getByTestId('list-user-loader')).toBeDefined();
  });

  it('should render error state', async () => {
    // ARRANGE
    const useGetUsersSpy = vi.spyOn(UseGetUsers, 'useGetUsers');
    useGetUsersSpy.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as UseQueryResult<User[], Error>);
    render(<UserList />);
    await screen.findByTestId('list-user-error');

    // ASSERT
    expect(screen.getByTestId('list-user-error')).toBeDefined();
  });

  it('should render empty state', async () => {
    // ARRANGE
    const useGetUsersSpy = vi.spyOn(UseGetUsers, 'useGetUsers');
    useGetUsersSpy.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult<User[], Error>);
    render(<UserList />);
    await screen.findByTestId('list-user-empty');

    // ASSERT
    expect(screen.getByTestId('list-user-empty')).toBeDefined();
  });
});
