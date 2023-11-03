import { useRouter } from 'next/router';
import { HiOutlineSearch } from 'react-icons/hi';

export function SearchBar() {
  const router = useRouter();

  function searchHandler(event: any) {
    event.preventDefault();
    const enteredSearchTerm = event.target.elements.searchInput.value;
    if (!enteredSearchTerm) {
      return;
    }
    router.push(`/s?q=${encodeURIComponent(enteredSearchTerm)}`);
  }

  return (
    <div className="flex h-10 items-center justify-between relative">
      <form
        className="flex flex-1 h-10 md:inline-flex"
        onSubmit={searchHandler}
      >
        <input
          name="searchInput"
          className="w-full h-full rounded px-2 placeholder:text-sm text-base border border-tachGrey outline-none focus-visible:border-[2px]"
          type="text"
          placeholder="Search Tach Color Store products"
        />
        <button
          type="submit"
          className="w-12 h-full text-white bg-tachGrey text-2xl flex items-center justify-center absolute right-0 rounded-tr rounded-br"
        >
          <HiOutlineSearch />
        </button>
      </form>
    </div>
  );
}
