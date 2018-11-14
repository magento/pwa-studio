import { GraphQL } from 'types';

import { MediaGalleryEntry } from './media-gallery-entry.model';
import { PriceModel } from './price.model';

export type ProductDetailModel = GraphQL<{
    description: string;
    media_gallery_entries: MediaGalleryEntry[];
    name: string; price: PriceModel;
    sku: string
}>;
