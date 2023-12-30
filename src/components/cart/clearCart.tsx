import { useClearCartMutation } from '@/rtk/apis/cartApi';
import React from 'react';
import { useDispatch } from 'react-redux';

export function ClearCart() {
  const [clearCart] = useClearCartMutation();

  function handleClearCart() {
    const confirmReset = window.confirm(
      'Are you sure you want to clear all items from your cart?',
    );
    if (confirmReset) {
      clearCart();
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
