export const getUserInformation = ({ user: { currentUser } }) => {
    const { email, firstname, lastname } = currentUser;

    return {
        email,
        firstname,
        lastname,
        fullname: `${firstname} ${lastname}`
    };
};
