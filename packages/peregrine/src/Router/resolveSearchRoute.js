import { tempGetWebpackChunkData } from './resolveUnknownRoute';

let preloadDone = false;
export default function resolveSearchRoute(opts) {
    const { route, apiBase, __tmp_webpack_public_path__ } = opts;

    function handleResolverResponse() {
        return tempGetWebpackChunkData(
            'SEARCH',
            __tmp_webpack_public_path__
        ).then(({ rootChunkID, rootModuleID }) => ({
            rootChunkID,
            rootModuleID
        }));
    }
    //May be unneeded to check preload for search

    return handleResolverResponse();
}
