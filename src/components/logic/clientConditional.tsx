import React from 'react';

export function Conditional(conditionalProps: any): React.ReactNode {
  const { showWhen, children } = conditionalProps;
  if (showWhen) return children;
  return null;
}
