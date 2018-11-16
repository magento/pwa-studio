import { GraphQL } from 'types';

export type MediaGalleryEntry = GraphQL<{
    disabled: boolean;
    label: string;
    position: number;
    file: string
}>;
