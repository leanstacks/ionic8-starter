import { JSX } from 'react';
import { ComponentPropsWithoutRef, createContext, ReactNode } from 'react';
import { IonProgressBar } from '@ionic/react';

/**
 * Select properties from `IonProgressBar` which control how the progress bar
 * is rendered.
 */
export type ProgressBarProps = Pick<
  ComponentPropsWithoutRef<typeof IonProgressBar>,
  'buffer' | 'color' | 'reversed' | 'type' | 'value'
>;

/**
 * The `ProgressProvider` render props function type.
 */
export type ProgressRenderFn = (progress: ProgressContextValue) => JSX.Element;

/**
 * Properties for the `ProgressProvider` component.
 * @param {ProgressRenderFn | ReactNode} children - A render props function
 * or `ReactNode`.
 * @see {@link ProgressRenderFn}
 * @see {@link ReactNode}
 */
export interface ProgressProviderProps {
  children: ProgressRenderFn | ReactNode;
}

/**
 * The `value` provided  by the `ProgressContext`.
 */
export interface ProgressContextValue {
  isActive: boolean;
  progressBar: ProgressBarProps;
  setIsActive: (isActive: boolean) => void;
  setProgressBar: (props: ProgressBarProps) => void;
  setProgress: (isActive: boolean, props?: ProgressBarProps) => void;
}

/**
 * Default `ProgressBarProps` value for the `ProgressContext`.
 */
export const DEFAULT_PROGRESS_BAR: ProgressBarProps = {
  type: 'indeterminate',
};

/**
 * Default value for the `ProgressContext`.
 */
const DEFAULT_PROGRESS: ProgressContextValue = {
  isActive: false,
  progressBar: DEFAULT_PROGRESS_BAR,
  setIsActive: () => {},
  setProgressBar: () => {},
  setProgress: () => {},
};

/**
 * The `ProgressContext` instance.
 */
export const ProgressContext = createContext<ProgressContextValue>(DEFAULT_PROGRESS);
