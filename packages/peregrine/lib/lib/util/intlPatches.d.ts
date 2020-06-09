export default IntlPatches;
declare namespace IntlPatches {
    export function formatToPartsPatch({ currency, maximumFractionDigits, useGrouping }: {
        currency: any;
        maximumFractionDigits: any;
        useGrouping: any;
    }, num: any): {
        type: string;
        value: any;
    }[];
    export function formatToPartsPatch({ currency, maximumFractionDigits, useGrouping }: {
        currency: any;
        maximumFractionDigits: any;
        useGrouping: any;
    }, num: any): {
        type: string;
        value: any;
    }[];
    export function toParts(num: any): any;
    export function toParts(num: any): any;
}
