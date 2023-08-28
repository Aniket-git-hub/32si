export const validationRules = {
    email: {
        validate: (value) => /\S+@\S+\.\S+/.test(value),
        error: 'Email address is invalid',
    },
    password: {
        validate: (value) => value.length >= 6,
        error: 'Password needs to be 8 characters or more',
    },
    name: {
        validate: (value) => value.trim() !== '',
        error: 'Name is required',
    },
    username: {
        validate: (value) => value.trim() !== '',
        error: 'Username is required',
    }
};
