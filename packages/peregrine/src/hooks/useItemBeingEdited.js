/**
 * This hook keeps track of the item currently being edited.
 */

import { useState } from 'react';

const INITIAL_ITEM_BEING_EDITED = null;

export const useItemBeingEdited = () => {
    return useState(INITIAL_ITEM_BEING_EDITED);
};
