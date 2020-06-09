/**
 * This is specific to the Venia store-front sample data.
 */
export const DEFAULT_WIDTH_TO_HEIGHT_RATIO: number;
export const imageWidths: Map<string, number>;
export function generateUrl(imageURL: any, mediaBase: any): (width: any, height: any) => any;
export function generateUrlFromContainerWidth(imageURL: any, containerWidth: any, type?: string, ratio?: number): any;
export function generateSrcset(imageURL: any, type: any, ratio: any): string;
