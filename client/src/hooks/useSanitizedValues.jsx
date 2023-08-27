import DOMPurify from 'dompurify';

export function useSanitizeValues(values) {
    const sanitizedValues = Object.keys(values).reduce((acc, key) => {
        acc[key] = DOMPurify.sanitize(values[key])
        return acc
    }, {});

    return sanitizedValues
}
