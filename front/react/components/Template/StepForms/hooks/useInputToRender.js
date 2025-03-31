import { DefaultInput } from "../components/inputs/DefaultInput";
import { CepInput } from "../components/inputs/CepInput";
import { PhoneInput } from "../components/inputs/PhoneInput";
import { CnpjInput } from "../components/inputs/CnpjInput";
import { CpfInput } from "../components/inputs/CpfInput";
import { FieldSelectInput } from "../components/inputs/FieldSelectInput";
import { RadioInput } from "../components/inputs/RadioInput";
import { CheckboxInput } from "../components/inputs/ChekboxInput";
import { FileInput } from "../components/inputs/FileInput";
import { TextAreaInput } from "../components/inputs/TextAreaInput";

export function useInputToRender(input) {
    switch (input.inputType) {
      case 'cep':
        return (
          <CepInput
            key={input.name}
            name={input.name}
            label={input.label}
            type={input.inputType}
            required={input.required}
            width={input.width}
          />
        );
      case 'phone':
        return (
          <PhoneInput
            key={input.name}
            name={input.name}
            label={input.label}
            type={input.inputType}
            required={input.required}
            width={input.width}
          />
      )
      case 'cnpj':
        return (
          <CnpjInput
            key={input.name}
            name={input.name}
            label={input.label}
            type={input.inputType}
            required={input.required}
            width={input.width}
          />
      )
      case 'cpf':
        return (
          <CpfInput
            key={input.name}
            name={input.name}
            label={input.label}
            type={input.inputType}
            required={input.required}
            width={input.width}
          />
      )
      case 'select':
        return (
          <FieldSelectInput
            key={input.name}
            name={input.name}
            label={input.label}
            type={input.inputType}
            options={input.options}
            required={input.required}
            width={input.width}
          />
      )
      case 'radio':
        return (
          <RadioInput
            key={input.name}
            name={input.name}
            label={input.label}
            options={input.options}
            required={input.required}
            width={input.width}
          />
      )
      case 'checkbox':
        return (
          <CheckboxInput
            key={input.name}
            name={input.name}
            label={input.label}
            options={input.options}
            required={input.required}
            width={input.width}
          />
      )
      case 'file':
        return (
          <FileInput
            key={input.name}
            name={input.name}
            label={input.label}
            required={input.required}
            width={input.width}
          />
      )
      case 'text-area':
        return (
          < TextAreaInput
            key={input.name}
            name={input.name}
            label={input.label}
            placeholder={input.placeholder}
            required={input.required}
            width={input.width}
          />
      );
      default:
        return (
          < DefaultInput
            key={input.name}
            name={input.name}
            label={input.label}
            placeholder={input.placeholder}
            required={input.required}
            width={input.width}
          />
        );
    }
}