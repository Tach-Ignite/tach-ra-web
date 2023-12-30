import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useClearCartMutation } from '@/rtk/apis/cartApi';

function SuccessPage() {
  const [clearCart] = useClearCartMutation();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex flex-col gap-3 items-center justify-center py-20">
      <h1 className="text-2xl text-hoverBg font-semibold">
        Thank you for shopping with Tach Color Store!
      </h1>
      <Link
        href="/"
        className="text-gray-500 underline underline-offset-4 decoration-[1px] hover:text-blue-600 duration-300"
      >
        <p>Continue shopping</p>
      </Link>
    </div>
  );
}

export default SuccessPage;
