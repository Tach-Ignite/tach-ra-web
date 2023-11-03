import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { Conditional } from '../logic/clientConditional';
import { Label } from './label';
import { InputFooter } from './inputFooter';

export type InputProps = {
  id?: string;
  label?: string;
  name?: string;
  className?: string;
  required?: boolean;
  type?: string;
  step?: number;
  register: any;
  registerOptions?: any;
  errorMessage?: string;
  placeholder?: string;
  helpText?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  autoComplete?: string;
  value?: string;
  checked?: boolean;
  onFocus?: (event: any) => void;
  getValues?: (name: string) => any;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
};

export function Input({
  id,
  label,
  name,
  className,
  required,
  type,
  step,
  register,
  registerOptions,
  errorMessage,
  placeholder,
  onFocus,
  helpText,
  rows,
  cols,
  maxLength,
  value,
  checked,
  getValues,
  autoComplete,
  onChange,
  onBlur,
}: InputProps) {
  let baseStyles = '';
  if (type === 'checkbox') {
    baseStyles = twMerge(baseStyles, 'flex flex-row-reverse justify-end');
  }
  const styles = className ? twMerge(baseStyles, className) : baseStyles;
  const fileButtonClass =
    'file:mr-4 file:text-base file:cursor-pointer file:border-0 file:font-medium file:bg-tachGrey file:text-white file:rounded file:hover:bg-tachPurple file:duration-300 file:justify-center file:items-center file:px-4 file:py-3';
  const fileInputClass = `block w-full text-tachGrey text-sm rounded w-full outline-none cursor-pointer ${fileButtonClass}`;
  const checkboxInputClass = 'flex-none p-1 w-6 h-6 mr-4';
  let inputClass =
    'border-tachGrey outline-none focus-visible:border-tachGreen border rounded py-1 px-1.5 w-full transition duration-300';
  if (type === 'file') {
    inputClass = fileInputClass;
  } else if (type === 'checkbox') {
    inputClass = checkboxInputClass;
  }

  const [length, setLength] = useState(0);

  function changeHandler(event: any) {
    setLength(event.target.value.length);
  }

  return (
    <>
      <div className={styles}>
        <Label required={required} name={name}>
          {label}
        </Label>
        <Conditional showWhen={type === 'textarea'}>
          <textarea
            value={value}
            rows={rows}
            maxLength={maxLength}
            cols={cols}
            autoComplete={autoComplete}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            {...register(
              name,
              registerOptions
                ? {
                    ...registerOptions,
                    onChange: (e: any) => {
                      if (maxLength) {
                        changeHandler(e);
                      }
                      registerOptions.onChange(e);
                    },
                  }
                : {
                    onChange: (e: any) => {
                      changeHandler(e);
                    },
                  },
            )}
            className={`${inputClass} ${errorMessage ? 'border-red-600' : ''}`}
            placeholder={placeholder}
          />
        </Conditional>
        <Conditional showWhen={type !== 'textarea'}>
          <input
            type={type}
            value={value}
            checked={checked}
            step={step}
            maxLength={maxLength}
            autoComplete={autoComplete}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            {...register(
              name,
              registerOptions
                ? {
                    ...registerOptions,
                    onChange: (e: any) => {
                      if (maxLength) {
                        changeHandler(e);
                      }
                      if (registerOptions.onChange) {
                        registerOptions.onChange(e);
                      }
                    },
                  }
                : {
                    onChange: (e: any) => {
                      changeHandler(e);
                    },
                  },
            )}
            className={`${inputClass} ${errorMessage ? 'border-red-600' : ''}`}
            placeholder={placeholder}
          />
        </Conditional>
        <Conditional showWhen={type !== 'checkbox'}>
          <InputFooter
            length={length}
            maxLength={maxLength}
            helpText={helpText}
            errorMessage={errorMessage}
            stack={type === 'file'}
          />
        </Conditional>
      </div>
      <Conditional showWhen={type === 'checkbox'}>
        <InputFooter
          length={length}
          maxLength={maxLength}
          helpText={helpText}
          errorMessage={errorMessage}
          stack={type === 'file'}
        />
      </Conditional>
    </>
  );
}
