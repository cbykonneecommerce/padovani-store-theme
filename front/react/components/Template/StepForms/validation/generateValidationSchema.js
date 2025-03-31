import * as Yup from 'yup';

const REQUIRED_MESSAGE = 'Campo Obrigatório';
const INVALID_PHONE_MESSAGE = 'Número de telefone inválido';
const INVALID_EMAIL = 'Email inválido';

const CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const CPF_REGEX = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
const PHONE_REGEX = /^\((\d{2})\) (\d) \d{4} \d{4}$/;
const CEP_REGEX = /\d{5}-\d{3}/;
//doc: Examples of validations can be seen in this topic:
//https://stackoverflow.com/questions/63769152/how-to-get-yup-to-perform-more-than-one-custom-validation

const createValidationSchema = (input) => {
  let validationSchema = Yup.string();

  if (input?.required) {
    validationSchema = validationSchema.required(REQUIRED_MESSAGE);
  }

  switch (input?.inputType) {
    case 'cnpj':
      return validationSchema.matches(CNPJ_REGEX, 'CNPJ inválido');
    case 'cpf':
      return validationSchema.matches(CPF_REGEX, 'CPF inválido');
    case 'email':
      return validationSchema.email(INVALID_EMAIL);
    case 'phone':
      return validationSchema.min(11, INVALID_PHONE_MESSAGE).matches(PHONE_REGEX, 'Número inválido');
    case 'cep':
      return validationSchema.matches(CEP_REGEX, 'CEP inválido');
    default:
      return validationSchema;
  }
};

export const generateValidationSchema = (inputs) => {
  const validationSchema = {};

  inputs?.forEach((input) => {
    validationSchema[input.name] = createValidationSchema(input);
  });

  return Yup.object().shape(validationSchema);
};
