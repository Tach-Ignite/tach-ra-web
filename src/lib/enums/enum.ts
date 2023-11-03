import { IEnum } from '@/lib/abstractions';

export class Enum implements IEnum {
  [x: string]: any;

  _reverseDictionary = {} as Record<string, string>;

  _keys: string[] = [];

  _values: any[] = [];

  _object: any;

  constructor(enumValues: Object) {
    this._object = enumValues;
    Object.entries(enumValues).forEach(([key, value]) => {
      if (this._keys.includes(key)) {
        throw new Error(`key with name ${key} already exists in this Enum.`);
      }
      if (this._values.includes(value)) {
        throw new Error(`string value ${value} already exists in this Enum.`);
      }
      this._keys.push(key);
      this._values.push(value);
      this[key] = value;
      if (typeof value === 'string') {
        this._reverseDictionary[value] = key;
      }
    });
  }

  reverseLookup(value: string): string {
    return this._reverseDictionary[value];
  }
}
