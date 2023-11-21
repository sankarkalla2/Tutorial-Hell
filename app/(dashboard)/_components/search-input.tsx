"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState("");

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: value,
          categoryId: currentCategoryId,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    const timer = setTimeout(() => {
      //do nothing
    }, 1000);

    clearTimeout(timer);

    router.push(url);
  }, [value, router, pathname, currentCategoryId]);

  return (
    <div className="relative items-center flex">
      <Search className="absolute left-3 text-slate-600 w-4 h-4" />
      <Input
        placeholder="search for course..."
        className="w-full pl-9 rounded-full md:w-[300px] bg-slate-100 focus-visible:ring-slate-200"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
