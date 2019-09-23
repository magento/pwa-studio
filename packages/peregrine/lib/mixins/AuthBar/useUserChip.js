import { useCallback } from 'react';

export const useUserChip = props => {
  const { showMyAccount, user } = props;
  const { email, firstname, lastname } = user || {};
  const fullname = `${firstname} ${lastname}`;
  const display = fullname.trim() || 'Loading...';

  const handleClick = useCallback(() => {
      showMyAccount();
  }, [showMyAccount]);

  return {
    display,
    email,
    fullname,
    handleClick,
  }
};
