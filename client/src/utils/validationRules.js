export const validationRules = {
    email: {
        validate: (value) => /\S+@\S+\.\S+/.test(value),
        error: 'Email address is invalid',
    },
    password: {
        validate: (value) => value.length >= 8,
        error: 'Password needs to be 8 characters or more',
    },
    // password: {
    //     validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value),
    //     error: 'Password needs to be 8 characters or more, with at least 1 lowercase alphabet, 1 uppercase alphabet, 1 number, and 1 special character',
    // },
    name: {
        validate: (value) => value.trim() !== '',
        error: 'Name is required',
    },
    username: {
        validate: (value) => value.trim() !== '',
        error: 'Username is required',
    }, 
    otp: {
        validate: (value) => String(value).length === 6,
        error: 'OTP is required'
    }, 
    cpassword: {
        validate: (value, { password }) => value === password,
        error: 'Confirm password does not match'
    },
    message: {
        validate: (value) => value.trim() !== '',
        error: 'message is required'
    }
    
}
