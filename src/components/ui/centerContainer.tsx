import { PropsWithChildren } from 'react';

export type CenterContainerProps = {
  type?: 'grid' | 'flex';
  className?: string;
};

export function CenterContainer({
  type,
  children,
  className,
}: PropsWithChildren<CenterContainerProps>) {
  let style = '';
  if (type === 'flex') {
    style = 'flex items-center justify-center';
  } else {
    style = 'grid place-items-center';
  }

  return (
    <div className={`py-10 ${style} ${className && className}`}>
      <div className="max-w-screen-lg w-full h-full px-4">{children}</div>
    </div>
  );
}
