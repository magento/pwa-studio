// Function to generate a random nonce
export const nonceGenerator = length => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array)).slice(0, length);
};