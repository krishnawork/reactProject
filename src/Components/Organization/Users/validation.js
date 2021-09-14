import * as yup from "yup";
import {
  EMAIL_INVALID,
  GENERIC_REQUIRED,
  EMAIL_MAXLENGTH,
} from "Helpers/Validation/messages";

const initialValues = {
  email: "",
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required(GENERIC_REQUIRED)
    .email(EMAIL_INVALID)
    .max(100, EMAIL_MAXLENGTH),
});

export { initialValues, validationSchema };
