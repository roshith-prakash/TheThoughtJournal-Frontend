import React, { useState } from "react";
import useDebounce from "../utils/useDebounce";
import { Footer, Navbar, OutlineButton } from "../components";

const Search = () => {
  const [search, setSearch] = useState();
  const debouncedSearch = useDebounce(search);

  console.log("Debounced : ", debouncedSearch);

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
        <div>
          <input
            value={search}
            type="text"
            className="border-2"
            onChange={(e) => setSearch(e.target.value)}
          />

          <p>{debouncedSearch}</p>
        </div>
      </div>
      <div className="hidden pt-20 lg:block">
        <Footer />
      </div>
    </>
  );
};

export default Search;
