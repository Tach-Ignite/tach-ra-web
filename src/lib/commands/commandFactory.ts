import {
  ICommand,
  ICommandFactory,
  IServiceResolver,
} from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable('commandFactory', 'serviceResolver')
export class CommandFactory implements ICommandFactory {
  private _serviceResolver: IServiceResolver;

  constructor(serviceResolver: IServiceResolver) {
    this._serviceResolver = serviceResolver;
  }

  create<TPayload, TResult>(
    commandSymbol: string,
    payload: TPayload,
  ): ICommand<TResult> {
    return this._serviceResolver.resolve<ICommand<TResult>>(commandSymbol, {
      payload,
    });
  }
}
