import { useState } from 'react';

const DEFAULT_USERNAME = null;

export const useUsername = () => {
    const [username, setUsername] = useState(DEFAULT_USERNAME);

    return {
        username,
        setUsername
    };
};
