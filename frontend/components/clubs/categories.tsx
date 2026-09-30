"use client";

import { useState } from "react";
import Input from "../ui/input";
import { FaXmark } from "react-icons/fa6";

interface CategoriesProps {
  categories: string[];
  setCategories: (c: string[]) => void;
}

function Categories({ categories, setCategories }: CategoriesProps) {
  const [category, setCategory] = useState<string>("");

  function handleAdd(e: React.SubmitEvent) {
    e.preventDefault();
    if (category.trim().length > 0 && !categories.includes(category.trim())) {
      setCategories([...categories, category.trim()]);
      setCategory("");
    }
  }

  return (
    <>
      <div className="flex gap-3 flex-wrap my-3">
        {categories.length > 0 ? (
          categories.map((c, i) => (
            <div
              key={i}
              className="bg-zinc-200 dark:bg-zinc-900 flex items-center px-2 py-1 w-fit text-zinc-700 dark:text-zinc-300 gap-x-2"
            >
              {c}
              <FaXmark
                size={15}
                onMouseDown={() =>
                  setCategories(categories.filter((ca) => ca !== c))
                }
                className="cursor-pointer"
                title="Remove category"
              />
            </div>
          ))
        ) : (
          <div className="text-center w-full text-zinc-700 dark:text-zinc-300">
            No categories added. Enter one below!
          </div>
        )}
      </div>
      <form onSubmit={handleAdd}>
        <Input
          placeholder="Enter category"
          value={category}
          setValue={(c) => setCategory(c)}
        />
      </form>
    </>
  );
}

export default Categories;
