/**
 * Generates an identifier for a toast by inspecting the properties that
 * differentiate toasts from one another.
 */
export type getToastId = any;
export function getToastId({ type, message, dismissable, actionText, icon }: {
    type: string;
    message: string;
    dismissable: boolean;
    actionText: string;
    icon: any;
}): number;
export function useToasts(): any[];
