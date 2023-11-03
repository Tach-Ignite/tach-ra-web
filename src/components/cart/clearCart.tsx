import React from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/rtk';

export function ClearCart() {
  const dispatch = useDispatch();

  function handleClearCart() {
    const confirmReset = window.confirm(
      'Are you sure you want to clear all items from your cart?',
    );
    if (confirmReset) {
      dispatch(clearCart());
    }
  }

  return (
    <div
      onClick={handleClearCart}
      className="w-44 h-10 font-semibold rounded bg-tachGrey text-white hover:bg-red-600 flex justify-center items-center cursor-pointer duration-300"
    >
      Clear Cart
    </div>
  );
}
