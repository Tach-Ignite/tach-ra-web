import Ajv, { JSONSchemaType } from 'ajv';
import { IValidator, ValidationResult } from '@/lib/abstractions';
import { Injectable } from '@/lib/ioc/injectable';

@Injectable('validator', 'ajv')
export class Validator implements IValidator {
  private _ajv: Ajv;

  constructor(ajv: Ajv) {
    this._ajv = ajv;
  }

  validate<T>(
    entity: T,
    schema: JSONSchemaType<T>,
    allowUndefined = false,
  ): ValidationResult {
    if (allowUndefined && entity === undefined) {
      return { valid: true } as ValidationResult;
    }
    const valid = this._ajv.validate(schema, entity);
    const errors: { [x: string]: any } = {};
    this._ajv.errors?.forEach((error) => {
      errors[error.propertyName!] = error.message;
    });
    return { valid, errors } as ValidationResult;
  }
}
