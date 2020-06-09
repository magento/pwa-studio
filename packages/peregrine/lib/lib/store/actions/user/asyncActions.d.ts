export function signOut(payload?: {}): (dispatch: any) => Promise<void>;
export function getUserDetails({ fetchUserDetails }: {
    fetchUserDetails: any;
}): (...args: any[]) => Promise<void>;
export function resetPassword({ email }: {
    email: any;
}): (...args: any[]) => Promise<void>;
export function setToken(token: any): (...args: any[]) => Promise<void>;
export function clearToken(): (...args: any[]) => Promise<void>;
