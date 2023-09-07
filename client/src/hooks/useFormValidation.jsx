import { useState, useEffect } from "react";
import { validationRules } from "../utils/validationRules";
import { useSanitizeValues } from "./useSanitizedValues";
import { useToast } from "@chakra-ui/react";

export function useFormValidation(initialState, submit) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  const sanitizedValues = useSanitizeValues(values);
  const toast = useToast();

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        (async () => {
          let toastData = { title: "", description: "", status: "" };
          try {
            const response = await submit(sanitizedValues);
            setSubmitting(false);
            setValues(initialState);
            toastData = {
              title: response.title,
              description: response.message,
              status: "success",
            };
          } catch (error) {
            if (import.meta.env.VITE_ENV === 'development') {
              console.log(error);
            }
            setValues(initialState);
            setSubmitting(false);
            if (error.response) {
              switch (error.response.status) {
                case 401:
                  toastData = {
                    title: "Authentication Error",
                    description: error.response.data.message,
                    status: "error",
                  };
                  break;
                case 409:
                  toastData = {
                    title: "Authentication Error",
                    description: "Credentials already exits",
                    status: "error",
                  };
                  break;
                case 400:
                  toastData = {
                    title: "Bad Request",
                    description: error.response.data.message,
                    status: "error",
                  };
                  break;
                default:
                  toastData = {
                    title: "Error",
                    description: error.response.data.message,
                    status: "error",
                  };
              }
            } else {
              toastData = {
                title: "Error",
                description: "Something Went Wrong",
                status: "error",
              };
            }
          }
          toast({
            title: toastData.title,
            description: toastData.description,
            status: toastData.status,
            duration: 5000,
            isClosable: true,
            variant: "subtle",
            position: "top",
          });
        })();
      } else {
        setSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = (event) => {
    event.persist();
    setValues((prevValues) => ({
      ...prevValues,
      [event.target.name]: event.target.value,
    }));
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
  };

  return { values, setValues, errors, handleChange, handleSubmit, isSubmitting };
}

function validate(values) {
  let errors = {};

  for (let [key, value] of Object.entries(values)) {
    if (validationRules[key] && !validationRules[key].validate(value, values)) {
      errors[key] = validationRules[key].error;
    }
  }

  return errors;
}
