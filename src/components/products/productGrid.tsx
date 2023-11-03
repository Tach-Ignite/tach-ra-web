import { useDispatch, useSelector } from 'react-redux';
import { IoMdHeart, IoMdHeartDislike } from 'react-icons/io';
import { IoCartOutline } from 'react-icons/io5';
import Link from 'next/link';
import { RootState, addToCart, toggleFavorites } from '@/rtk';
import { ProductViewModel } from '@/models';
import { Price } from '../price';

export type ProductGridProps = {
  products: ProductViewModel[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites,
  );

  return (
    <div className="w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-3">
      {products &&
        products.map((product: ProductViewModel) => {
          const {
            _id,
            friendlyId,
            brand,
            name,
            description,
            categories,
            isNew,
            oldPrice,
            price,
            imageUrls,
          } = product;
          return (
            <div
              key={_id}
              className="w-full p-2 border border-tachGrey rounded group overflow-hidden"
            >
              <Link href={`/p/${friendlyId}/i/${_id}`}>
                <div className="w-full h-[260px] relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300"
                    width={300}
                    height={300}
                    src={imageUrls && imageUrls.length > 0 ? imageUrls[0] : ''}
                    alt={name}
                  />
                </div>
              </Link>

              <div className="border-tachGrey border-t w-full my-2" />
              <div className="flex flex-col gap-1">
                <div className="flex">
                  <div className="text-xs text-tachGrey">
                    {categories.map((c) => (
                      <div
                        key={c._id}
                        className="border border-tachGrey rounded p-1"
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Link
                    href={`/p/${friendlyId}/i/${_id}`}
                    className="text-base font-medium underline hover:text-tachPurple duration-300"
                  >
                    {name}
                  </Link>
                  <p className="flex items-center gap-3">
                    <span className="font-semibold">
                      <Price amount={price} />
                    </span>
                  </p>
                </div>
                <p className="flex-grow text-xs text-justify">
                  {description.substring(0, 120)}...
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch(addToCart(product))}
                    className="flex-grow h-10 bg-tachGrey text-white font-medium rounded hover:bg-tachPurple duration-300"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <IoCartOutline className="w-6 h-6" />
                      <div>Add to Cart</div>
                    </div>
                  </button>
                  <div className=" flex-none border border-gray-300 rounded h-10 w-10">
                    <button
                      type="button"
                      onClick={() => dispatch(toggleFavorites(product))}
                      className="w-full h-full flex items-center justify-center text-xl bg-transparent hover:bg-tachPurple duration-300"
                    >
                      {favorites.find((f) => f._id === _id) ? (
                        <IoMdHeartDislike className="" />
                      ) : (
                        <IoMdHeart className="" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
