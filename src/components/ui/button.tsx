import { twMerge } from 'tailwind-merge';
import { Conditional } from '../logic/clientConditional';

export type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  style?:
    | 'cyan'
    | 'cyan-light'
    | 'red'
    | 'red-light'
    | 'green'
    | 'green-light'
    | 'neutral'
    | 'neutral-light'
    | 'fuchsia'
    | 'fuchsia-light'
    | 'orange'
    | 'orange-light'
    | 'yellow'
    | 'yellow-light'
    | 'lime'
    | 'lime-light'
    | 'violet'
    | 'violet-light'
    | 'link';
  className?: string;
  beforeIcon?: React.ReactElement;
  afterIcon?: React.ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  disabled?: boolean;
};

export function Button({
  style,
  className,
  type,
  beforeIcon,
  afterIcon,
  onClick,
  isLoading,
  children,
  disabled,
}: React.PropsWithChildren<ButtonProps>) {
  let stylebuilder: string[] = [];
  stylebuilder.push(
    'bg-tachGrey hover:bg-tachPurple text-white font-medium rounded duration-300 flex gap-3 justify-center items-center px-4 py-3',
  );
  switch (style) {
    case 'cyan-light':
      stylebuilder.push(
        'border-2 border-cyan-500 bg-white hover:bg-neutral-200 text-blue-500',
      );
      break;
    case 'red':
      stylebuilder.push(
        'border-2 border-red-500 bg-red-500 hover:bg-red-700 text-white',
      );
      break;
    case 'red-light':
      stylebuilder.push(
        'border-2 border-red-500 bg-white hover:bg-neutral-200 text-red-500',
      );
      break;
    case 'green':
      stylebuilder.push(
        'border-2 border-green-500 bg-green-500 hover:bg-green-700 text-white',
      );
      break;
    case 'green-light':
      stylebuilder.push(
        'border-2 border-green-500 bg-white hover:bg-neutral-200 text-green-500',
      );
      break;
    case 'neutral':
      stylebuilder.push(
        'border-2 border-neutral-500 bg-neutral-500 hover:bg-neutral-700 text-white',
      );
      break;
    case 'neutral-light':
      stylebuilder.push(
        'border-2 border-neutral-500 bg-white hover:bg-neutral-200 text-neutral-500',
      );
      break;
    case 'fuchsia':
      stylebuilder.push(
        'border-2 border-fuchsia-500 bg-fuchsia-500 hover:bg-fuchsia-700 text-white',
      );
      break;
    case 'fuchsia-light':
      stylebuilder.push(
        'border-2 border-fuchsia-500 bg-white hover:bg-fuchsia-200 text-fuchsia-500',
      );
      break;
    case 'orange':
      stylebuilder.push(
        'border-2 border-orange-500 bg-orange-500 hover:bg-orange-700 text-white',
      );
      break;
    case 'orange-light':
      stylebuilder.push(
        'border-2 border-orange-500 bg-white hover:bg-orange-200 text-orange-500',
      );
      break;
    case 'yellow':
      stylebuilder.push(
        'border-2 border-yellow-500 bg-yellow-500 hover:bg-yellow-700 text-white',
      );
      break;
    case 'yellow-light':
      stylebuilder.push(
        'border-2 border-yellow-500 bg-white hover:bg-yellow-200 text-yellow-500',
      );
      break;
    case 'lime':
      stylebuilder.push(
        'border-2 border-lime-500 bg-lime-500 hover:bg-lime-700 text-white',
      );
      break;
    case 'lime-light':
      stylebuilder.push(
        'border-2 border-lime-500 bg-white hover:bg-lime-200 text-lime-500',
      );
      break;
    case 'violet':
      stylebuilder.push(
        'border-2 border-violet-500 bg-violet-500 hover:bg-violet-700 text-white',
      );
      break;
    case 'violet-light':
      stylebuilder.push(
        'border-2 border-violet-500 bg-white hover:bg-violet-200 text-violet-500',
      );
      break;
    case 'link':
      stylebuilder = [
        'text-cyan-500 hover:text-cyan-700 visited:text-cyan-500;',
      ];
      break;
    case 'cyan':
    default:
      break;
  }
  let buttonStyle = '';
  if (className) {
    buttonStyle = twMerge(stylebuilder.join(' '), className);
  } else {
    buttonStyle = stylebuilder.join(' ');
  }

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type || 'button'}
      className={`${buttonStyle} ${isLoading ? 'cursor-progress' : ''} ${
        disabled ? 'cursor-not-allowed bg-opacity-50' : 'cursor-pointer'
      }`}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <div className="flex space-x-2 items-center justify-center">
        {!isLoading ? (
          <>
            <Conditional showWhen={beforeIcon}>{beforeIcon}</Conditional>
            {children && <div>{children}</div>}
            <Conditional showWhen={afterIcon}>{afterIcon}</Conditional>
          </>
        ) : (
          <>
            <svg className="animate-spin w-5 h-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </>
        )}
      </div>
    </button>
  );
}
