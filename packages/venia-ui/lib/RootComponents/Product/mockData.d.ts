export default data;
declare namespace data {
    export const additionalInfo: string;
    export const description: string;
    export const images: {
        id: string;
    }[];
    export const name: string;
    export const options: {
        id: string;
        name: string;
        type: string;
        values: {
            id: string;
            name: string;
        }[];
    }[];
    export const price: string;
}
