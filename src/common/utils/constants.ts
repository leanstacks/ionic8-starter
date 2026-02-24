import { Settings } from 'common/models/settings';

/**
 * React Query cache keys.
 */
export enum QueryKey {
  AppInfo = 'AppInfo',
  Settings = 'Settings',
  UserProfile = 'UserProfile',
  Users = 'Users',
  UserTokens = 'UserTokens',
}

/**
 * Local storage keys.
 */
export enum StorageKey {
  Language = 'ionic-starter.language',
  RememberMe = 'ionic-starter.remember-me',
  Settings = 'ionic-starter.settings',
  UserProfile = 'ionic-starter.user-profile',
  User = 'ionic-starter.user',
  UserTokens = 'ionic-starter.user-tokens',
}

/**
 * The default `Settings` values.
 */
export const DEFAULT_SETTINGS: Settings = {
  allowNotifications: true,
  brightness: 50,
  fontSize: 'default',
  language: 'en',
};

/**
 * Available languages.
 */
export const LANGUAGES = [
  {
    code: 'en',
    value: 'English',
  },
  {
    code: 'es',
    value: 'Spanish',
  },
  {
    code: 'fr',
    value: 'French',
  },
];
