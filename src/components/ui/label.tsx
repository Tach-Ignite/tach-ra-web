import { ReactNode } from 'react';

type LabelProps = {
  id?: string;
  children?: ReactNode;
  name?: string;
  required?: boolean;
};

function Label({ children, id, name, required }: LabelProps) {
  const requiredIndicator = required ? "after:content-['*']" : '';

  if (children) {
    return (
      <label id={id} htmlFor={name} className="block mb-0.5">
        <span
          className={`${requiredIndicator} after:ml-0.5 after:text-red-600 block text-sm text-tachGrey`}
        >
          {children}
        </span>
      </label>
    );
  }
}

export { Label, type LabelProps };
