import { IOptions } from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable('options')
export class Options<T extends object> implements IOptions<T> {
  private _value: T;

  get value(): T {
    return this._value;
  }

  constructor(value: T) {
    this._value = value;
  }
}
