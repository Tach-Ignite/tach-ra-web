function Page({ searchParams }: any) {
  return (
    <div>
      <p>Error</p>
      <p>{searchParams?.error}</p>
    </div>
  );
}

export const getServerSideProps = async ({ query }: any) => ({
  searchParams: query,
});

export default Page;
