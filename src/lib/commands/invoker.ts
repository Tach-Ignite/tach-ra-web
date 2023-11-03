import { ICommand, IInvoker } from '@/lib/abstractions';
import { Injectable } from '../ioc/injectable';

@Injectable('invoker')
export class Invoker implements IInvoker {
  async invoke<TResult>(
    command: ICommand<TResult>,
  ): Promise<TResult | undefined> {
    await command.execute();
    return command.result;
  }
}
