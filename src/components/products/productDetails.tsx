import { useDispatch, useSelector } from 'react-redux';
import { IoMdHeart, IoMdHeartDislike } from 'react-icons/io';
import { IoCartOutline } from 'react-icons/io5';
import { toggleFavorites, RootState } from '@/rtk';
import { ProductViewModel } from '@/models';
import { useAddItemToCartMutation } from '@/rtk/apis/cartApi';
import { Price } from '../price';

export type ProductDetailsProps = {
  product: ProductViewModel;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites,
  );
  const {
    _id,
    brand,
    description,
    friendlyId,
    imageUrls,
    name,
    oldPrice,
    price,
    categoryPropertyValues,
  } = product;
  const [addToCart] = useAddItemToCartMutation();

  return (
    <div key={friendlyId} className="flex flex-col sm:flex-row gap-8">
      <div className="">
        {imageUrls && imageUrls.length > 0 && (
          <img
            alt={`${name} Preview`}
            width={512}
            height={512}
            className="rounded cover"
            src={imageUrls[0]}
          />
        )}
      </div>
      <div className="max-w-lg">
        <div className="text-3xl font-semibold">{name}</div>
        <div className="text-base text-tachGrey">{brand}</div>
        <hr className="mb-4" />
        <div className="flex gap-3 items-center mb-4">
          <span className="text-sm text-tachGrey line-through">
            <Price amount={oldPrice} />
          </span>
          <span className="text-xl">
            <Price amount={price} />
          </span>
        </div>
        {/* properties */}
        <div className="mb-4">
          {categoryPropertyValues &&
            Object.keys(categoryPropertyValues).map((key) => (
              <div key={key} className="flex items-center">
                <div className="font-semibold text-sm basis-1/3">{key}</div>
                <div>{categoryPropertyValues?.[key].value}</div>
              </div>
            ))}
        </div>
        <div className="mb-8">{description}</div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addToCart({ productId: _id, quantity: 1 })}
            className="h-10 px-4 font-medium bg-tachGrey rounded hover:bg-tachPurple duration-300"
          >
            <div className="text-white flex-none flex items-center justify-center gap-3">
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
}
