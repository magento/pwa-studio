import { useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useResetPassword = () => {
    const location = useLocation();

    const token = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        if (searchParams.has('token')) {
            return searchParams.get('token');
        } else {
            return null;
        }
    }, [location]);

    const handleSubmit = useCallback(() => {}, []);

    return {
        token,
        handleSubmit
    };
};
