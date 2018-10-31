import { tempGetWebpackChunkData } from './resolveUnknownRoute';

export default function resolveSearchRoute(opts) {
    const { __tmp_webpack_public_path__ } = opts;

    function handleResolverResponse() {
        return tempGetWebpackChunkData(
            'SEARCH',
            __tmp_webpack_public_path__
        ).then(({ rootChunkID, rootModuleID }) => ({
            rootChunkID,
            rootModuleID
        }));
    }

    return handleResolverResponse();
}
