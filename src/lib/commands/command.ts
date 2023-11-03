import { ICommand } from '@/lib/abstractions';

export abstract class Command<TPayload, TResult> implements ICommand<TResult> {
  protected _payload: TPayload;

  public result?: TResult = undefined;

  constructor(payload: TPayload) {
    this._payload = payload;
  }

  abstract execute(): Promise<void>;
}
