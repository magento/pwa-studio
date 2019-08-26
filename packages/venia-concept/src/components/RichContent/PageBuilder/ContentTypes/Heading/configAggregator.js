import {getAdvanced} from "../../utils";

export default node => {
    return {
        headingType: node.nodeName,
        ...getAdvanced(node),
    };
};
