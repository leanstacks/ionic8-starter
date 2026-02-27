import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

import { render, screen } from 'test/test-utils';
import { Settings } from 'common/models/settings';
import { settingsFixture } from '__fixtures__/settings';
import * as UseGetSettings from 'common/api/useGetSettings';
import * as UseUpdateSettings from 'common/api/useUpdateSettings';

import SettingsForm from '../SettingsForm';

describe('SettingsForm', () => {
  beforeEach(() => {
    const useGetSettingsSpy = vi.spyOn(UseGetSettings, 'useGetSettings');
    useGetSettingsSpy.mockReturnValue({
      data: settingsFixture,
      isLoading: false,
      isSuccess: true,
      isError: false,
    } as unknown as UseQueryResult<Settings>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render successfully', async () => {
    // ARRANGE
    render(<SettingsForm />);
    await screen.findByTestId('form-settings');

    // ASSERT
    expect(screen.getByTestId('form-settings')).toBeDefined();
  });

  it('should render loading state', async () => {
    // ARRANGE
    const useGetSettingsSpy = vi.spyOn(UseGetSettings, 'useGetSettings');
    useGetSettingsSpy.mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
    } as unknown as UseQueryResult<Settings>);
    render(<SettingsForm testid="form" />);
    await screen.findByTestId('form-loading');

    // ASSERT
    expect(screen.getByTestId('form-loading')).toBeDefined();
  });

  it('should submit form', async () => {
    // ARRANGE
    const mockUpdateSettings = vi.fn();
    const useUpdateSettingsSpy = vi.spyOn(UseUpdateSettings, 'useUpdateSettings');
    useUpdateSettingsSpy.mockReturnValue({
      mutate: mockUpdateSettings,
    } as unknown as UseMutationResult<Settings, Error, UseUpdateSettings.UpdateSettingsVariables>);
    render(<SettingsForm testid="form" />);
    await screen.findByTestId('form');

    // ACT
    await userEvent.click(screen.getByTestId('form-field-allowNotifications'));

    // ASSERT
    expect(screen.getByTestId('form')).toBeDefined();
    expect(mockUpdateSettings).toHaveBeenCalled();
  });
});
