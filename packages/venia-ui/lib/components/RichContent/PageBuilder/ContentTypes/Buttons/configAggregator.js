import { getAdvanced } from '../../utils';

export default node => {
    return {
        ...getAdvanced(node)
    };
};
