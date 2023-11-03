export interface ICommand<TResult> {
  result?: TResult;
  execute(): Promise<void>;
}

export interface IInvoker {
  invoke<TResult>(command: ICommand<TResult>): Promise<TResult | undefined>;
}

export interface ICommandFactory {
  create<TPayload, TResult>(
    commandSymbol: string,
    payload: TPayload,
  ): ICommand<TResult>;
}
