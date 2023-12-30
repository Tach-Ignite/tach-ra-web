import React from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { HiOutlineTrash } from 'react-icons/hi2';
import { CartItemViewModel } from '@/models';
import {
  useDecreaseCartItemQuantityMutation,
  useIncreaseCartItemQuantityMutation,
  useRemoveItemFromCartMutation,
} from '@/rtk/apis/cartApi';
import { Price } from '../price';

export type CartListItemProps = {
  cartItem: CartItemViewModel;
};

export function CartListItem({ cartItem }: CartListItemProps) {
  const { product, quantity } = cartItem;
  const [increaseQuantity] = useIncreaseCartItemQuantityMutation();
  const [decreaseQuantity] = useDecreaseCartItemQuantityMutation();
  const [deleteFromCart] = useRemoveItemFromCartMutation();

  return (
    <div className="rounded border border-tachGrey flex flex-col md:flex-row items-center gap-3 px-4 py-3">
      <img
        src={
          product.imageUrls && product.imageUrls.length > 0
            ? product.imageUrls[0]
            : ''
        }
        className="object-cover"
        width={150}
        height={150}
        alt={product.name}
      />
      <div className="flex items-center flex-col lg:flex-row px-2 gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{product.name}</p>
          <p className="text-sm">{product.description}</p>
          <p className="text-sm">
            Unit Price{' '}
            <span className="font-semibold">
              <Price amount={product.price} />
            </span>
          </p>
          <div className="flex items-center flex-col lg:flex-row gap-6">
            <div className="flex items-center mt-1 justify-between border border-tachGrey px-4 py-1 rounded-full w-28">
              <span
                onClick={() =>
                  increaseQuantity({ productId: cartItem.product._id })
                }
                className={`w-6 h-6 flex items-center justify-center rounded-full text-base bg-transparent hover:bg-tachGrey duration-300 ${
                  cartItem.quantity < cartItem.product.quantity
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                }`}
              >
                <LuPlus />
              </span>
              <span>{quantity}</span>
              <span
                onClick={() =>
                  decreaseQuantity({ productId: cartItem.product._id })
                }
                className="w-6 h-6 flex items-center justify-center rounded-full text-base bg-transparent hover:bg-tachGrey cursor-pointer duration-300"
              >
                <LuMinus />
              </span>
            </div>
            <div
              onClick={() =>
                deleteFromCart({ productId: cartItem.product._id })
              }
              className="flex items-center text-sm font-medium text-tachGrey hover:text-red-600 cursor-pointer duration-300"
            >
              <HiOutlineTrash className="w-6 h-6" />
              <p className="ml-[2px]">Remove</p>
            </div>
          </div>
        </div>
        <div className="text-lg font-semibold">
          <Price amount={product.price * quantity} />
        </div>
      </div>
    </div>
  );
}
