import DOMPurify from 'dompurify';

export function useSanitizeValues(values) {
    const sanitizedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
            if (typeof value === 'string') {
                return [key, DOMPurify.sanitize(value)];
            } else {
                return [key, value];
            }
        })
    );
    return sanitizedValues;
}
