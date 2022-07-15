import MutationQueueLink from '@adobe/apollo-link-mutation-queue';

export default function createMutationQueueLink() {
    return new MutationQueueLink();
}
