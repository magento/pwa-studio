import { useState } from 'react';

export const useSortTicket = (props = {}) => useState(() => Object.assign({}, props));