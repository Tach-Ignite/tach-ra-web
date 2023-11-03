import { ErrorWithStatusCode } from '../errors';

/**
 * @internal
 */
export class RegistryNode<T> {
  public readonly value: T;

  private _dependencies: Map<symbol, number> = new Map();

  private _extraArgs: { [key: string]: any } | undefined;

  get extraArgs(): { [key: string]: any } | undefined {
    return this._extraArgs;
  }

  private _isFactory: boolean;

  get isFactory(): boolean {
    return this._isFactory;
  }

  constructor(
    value: T,
    extraArgs: { [key: string]: any } | undefined = undefined,
    isFactory: boolean = false,
  ) {
    this.value = value;
    this._isFactory = isFactory;
    this._extraArgs = extraArgs;
  }

  registerDependency(s: symbol, parameterIndex: number) {
    if (this._isFactory) {
      throw new ErrorWithStatusCode(
        'Cannot register dependencies for factory',
        500,
      );
    }
    this._dependencies.set(s, parameterIndex);
  }

  getDependencies(): Map<symbol, number> {
    return this._dependencies;
  }
}
