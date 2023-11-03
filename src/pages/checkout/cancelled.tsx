import Link from 'next/link';
import React from 'react';

function CancelledPage() {
  return (
    <div>
      <p>The checkout process has been cancelled.</p>
      <Link href="/cart">
        <button
          type="button"
          className="w-52 h-10 bg-tachDark text-white rounded text-sm fond-semibold hover:bg-tachLime hover:text-black"
        >
          Return to cart
        </button>
      </Link>
    </div>
  );
}

export default CancelledPage;
