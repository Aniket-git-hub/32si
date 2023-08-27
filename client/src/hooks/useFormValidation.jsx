import { useState, useEffect } from 'react';
import { validationRules } from '../utils/validationRules';

export function useFormValidation(initialState, submit) {
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0
            if (noErrors) {
                (async () => {
                    await submit()
                    setSubmitting(false)
                })()
            } else {
                setSubmitting(false)
            }
        }
    }, [errors])


    const handleChange = (event) => {
        event.persist()
        setValues((prevValues) => ({
            ...prevValues,
            [event.target.name]: event.target.value,
        }))
        const validationErrors = validate(values)
        setErrors(validationErrors)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const validationErrors = validate(values)
        setErrors(validationErrors)
        setSubmitting(true)
    }

    return { values, errors, handleChange, handleSubmit, isSubmitting }
}

function validate(values) {
    let errors = {}

    for (let [key, value] of Object.entries(values)) {
        if (validationRules[key] && !validationRules[key].validate(value)) {
            errors[key] = validationRules[key].error
        }
    }

    return errors
}
