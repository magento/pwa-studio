export const INTERNAL_ERROR: "INTERNAL_ERROR";
export const NOT_FOUND: "NOT_FOUND";
export default getRouteComponent;
declare function getRouteComponent(apiBase: any, pathname: any): Promise<{
    component: any;
    id: any;
    pathname: any;
    type: any;
    routeError?: undefined;
} | {
    pathname: any;
    routeError: string;
    component?: undefined;
    id?: undefined;
    type?: undefined;
}>;
