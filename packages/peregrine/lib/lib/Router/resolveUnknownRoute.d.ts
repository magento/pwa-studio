export default function resolveUnknownRoute(opts: any): Promise<{
    type: "PRODUCT" | "CATEGORY" | "CMS_PAGE";
} | {
    type: any;
    id: any;
}>;
