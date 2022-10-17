import { useState } from 'react';

export const useFilterTicket = (props = {}) => useState(() => Object.assign({}, props));
