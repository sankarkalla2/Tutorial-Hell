"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMusic,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { AiOutlineStock } from "react-icons/ai";
import { IconType } from "react-icons";
import CategoryItem from "./category-item";
import SearchInput from "@/app/(dashboard)/_components/search-input";

interface CategoryProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Fitness: FcSportsMode,
  Accounting: FcSalesPerformance,
  Filming: FcFilmReel,
  Engeneering: FcEngineering,
  "Computer Science": FcMultipleDevices,
  "Stock Market": AiOutlineStock,
};

const Categories = ({ items }: CategoryProps) => {
  return (
    <>
    <div className="md:hidden mb-4 block"><SearchInput /></div>
    <div className="flex items-center justify-between gap-x-2 overflow-x-auto">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
    </>
  );
};

export default Categories;
