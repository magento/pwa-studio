/**
 * process.env.DEV_SERVER_SERVICE_WORKER_ENABLED is
 * a string representation of a boolean value
 */
export const VALID_SERVICE_WORKER_ENVIRONMENT: boolean;
export function registerMessageHandler(type: string, handler: Function): Function;
export function unRegisterMessageHandler(type: string, handler: Function): void;
export function handleMessageFromSW(type: string, payload: object, event: MessageEvent): void;
export function sendMessageToSW(type: string, payload: object): Promise<any>;
