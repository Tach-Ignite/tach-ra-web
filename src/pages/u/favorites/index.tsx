import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Session } from 'next-auth';
import { CenterContainer, ProductList, RootLayout } from '@/components';
import { RootState } from '@/rtk';
import { ProductViewModel } from '@/models';

export type MyFavoritesPageProps = {
  products: ProductViewModel[];
};

function MyFavoritesPage({ products }: MyFavoritesPageProps) {
  const { favorites } = useSelector((state: RootState) => state.favorites);
  return (
    <>
      <h1 className="text-xl mb-4">My Favorites</h1>
      {favorites && favorites.length > 0 ? (
        <ProductList products={favorites} />
      ) : (
        <div>You don&apos;t have any favorites.</div>
      )}
    </>
  );
}

MyFavoritesPage.getLayout = function getLayout(
  page: ReactElement,
  session: Session,
) {
  return (
    <RootLayout session={session}>
      <CenterContainer>{page}</CenterContainer>
    </RootLayout>
  );
};

export default MyFavoritesPage;
