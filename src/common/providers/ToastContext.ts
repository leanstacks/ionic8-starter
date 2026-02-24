import { ComponentPropsWithoutRef, createContext } from 'react';
import { IonToast } from '@ionic/react';

/**
 * Describes the attributes of a single `Toast`.
 * @see {@link IonToast}
 */
export interface ToastData extends Pick<
  ComponentPropsWithoutRef<typeof IonToast>,
  'buttons' | 'color' | 'duration' | 'layout' | 'message' | 'position' | 'positionAnchor'
> {
  id: string;
}

/**
 * A DTO type which describes the attributes to create a new `Toast`.
 */
export type CreateToastDTO = Omit<ToastData, 'id'>;

/**
 * The `value` provided by the `ToastContext`.
 */
export interface ToastContextValue {
  toasts: ToastData[];
  createToast: (toast: CreateToastDTO) => void;
  removeToast: (id: string) => void;
}

/**
 * The `ToastContext` instance.
 */
export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
