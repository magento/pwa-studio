export default getNamedExport;
/**
 * Retrieve a single exported binding from a module.
 *
 * @param {object} obj - A module's namespace object
 * @param {string} name - The binding to retrieve
 * @returns {Promise<*>}
 */
declare function getNamedExport(obj: object, name?: string): Promise<any>;
