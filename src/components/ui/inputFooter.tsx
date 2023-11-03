import { Conditional } from '../logic/clientConditional';

export type InputFooterProps = {
  helpText?: string;
  errorMessage?: string;
  length?: number;
  maxLength?: number;
  stack?: boolean;
};

function InputFooter({
  helpText,
  errorMessage,
  length,
  maxLength,
  stack,
}: InputFooterProps) {
  return (
    <div
      className={`flex ${stack && 'flex-col-reverse mt-2'} ${
        !helpText && !errorMessage ? 'justify-end' : 'justify-between'
      }`}
    >
      <Conditional showWhen={errorMessage}>
        <div
          className={`block text-sm text-red-500 ${
            helpText ? 'basis-1/2' : ''
          }`}
        >
          {errorMessage}
        </div>
      </Conditional>
      <Conditional showWhen={!errorMessage}>
        <div className="h-5" />
      </Conditional>
      <Conditional showWhen={helpText}>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {helpText}
        </div>
      </Conditional>
      <Conditional showWhen={maxLength}>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          {`${length}/${maxLength}`}
        </div>
      </Conditional>
    </div>
  );
}

export { InputFooter };
