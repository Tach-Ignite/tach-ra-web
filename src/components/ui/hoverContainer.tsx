import React, { useState } from 'react';

export type HoverContainerProps = {
  contents: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function HoverContainer({
  contents,
  children,
  className,
  contentClassName,
}: HoverContainerProps) {
  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);
  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`z-40 ${className}`}
      >
        {children}

        {isHovering && (
          <div className="relative">
            <div className={`absolute z-40 ${contentClassName ?? ''}`}>
              {contents}
            </div>
          </div>
        )}
      </div>
      <div
        className={`absolute top-0 left-0 bg-tachDark dark:bg-white opacity-30 w-screen h-screen z-30 ${
          isHovering ? '' : 'hidden'
        }`}
      />
    </>
  );
}
