import React from 'react';

export type PriceProps = {
  amount: number;
};

export function Price({ amount }: PriceProps) {
  const formattedAmount = Number(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return <span>{formattedAmount}</span>;
}
