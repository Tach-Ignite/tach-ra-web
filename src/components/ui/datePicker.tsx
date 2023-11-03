import ReactDatePicker from 'react-datepicker';
import { twMerge } from 'tailwind-merge';
import { Label } from './label';
import { InputFooter } from './inputFooter';

export type DatePickerProps = {
  required?: boolean;
  label?: string;
  name?: string;
  value: Date | object;
  errorMessage?: string;
  className?: string;
  onChange: (date: Date) => void;
};

export function DatePicker({
  value,
  onChange,
  required,
  name,
  label,
  errorMessage,
  className,
}: DatePickerProps) {
  let inputClass = 'border rounded py-1 px-1.5 w-full';
  if (className) {
    inputClass = twMerge(inputClass, className);
  }

  return (
    <div className="mb-1">
      <Label required={required} name={name}>
        {label}
      </Label>
      <ReactDatePicker
        selected={value as Date}
        onChange={onChange}
        showYearDropdown
        showMonthDropdown
        className={inputClass}
      />
      <InputFooter errorMessage={errorMessage} />
    </div>
  );
}

export default DatePicker;
