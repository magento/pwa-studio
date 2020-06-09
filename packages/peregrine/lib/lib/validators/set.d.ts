export default optionalSet;
declare function optionalSet(props: any, propName: any, componentName: any): Error;
declare namespace optionalSet {
    export { requiredSet as isRequired };
}
declare function requiredSet(props: any, propName: any, componentName: any): Error;
