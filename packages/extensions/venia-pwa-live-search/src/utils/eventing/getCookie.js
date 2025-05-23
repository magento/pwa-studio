export const getDecodedCookie = key => {
  const encodedCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(key))
    .split('=')[1];
  const decodedCookie = decodeURIComponent(encodedCookie);
  const value = JSON.parse(decodedCookie);
  return value;
};
