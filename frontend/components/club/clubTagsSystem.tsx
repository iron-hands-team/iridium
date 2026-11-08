"use client";

import { cls } from "@/lib/clubStore";
import Btn from "@/components/ui/btn";
import Input from "@/components/ui/input";

type Tag = {
  name: string;
  color: string;
  isHidden: boolean;
};

export default function TagsSystemPopup() {
  const uf = cls((state) => state.updateFrame);

  const clubs = cls((state) => state.clubs);
  let tags = cls((state) => state.tags);

  const addTag = cls((state) => state.addTag);
  const deleteTag = cls((state) => state.deleteTag);
  const setTag = cls((state) => state.setTag);
  const setCanEditTags = cls((state) => state.setCanEditTags);

  const buttonColors: Record<string, string> = {
    blue: "bg-blue-400",
    red: "bg-red-400",
    green: "bg-green-400",
    yellow: "bg-yellow-500",
    purple: "bg-purple-400",
    gray: "bg-zinc-400",
  };

  function matchClubTags(previousTag: Tag, changedTag: Tag) {
    clubs.map((clubItem, _) =>
      clubItem.tags.map((tagItem, tagIndex) => {
        if (tagItem.name == previousTag.name) {
          clubItem.tags = setTag(
            clubItem.tags,
            tagIndex,
            "name",
            changedTag.name,
          );
          clubItem.tags = setTag(
            clubItem.tags,
            tagIndex,
            "color",
            changedTag.color,
          );
        }
      }),
    );
  }

  function deleteClubTags(previousTag: Tag) {
    clubs.map(
      (clubItem, _) =>
        (clubItem.tags = clubItem.tags.filter(
          (tagItem, tagIndex) => tagItem.name !== previousTag.name,
        )),
    );
  }

  return (
    <div
      className="z-100 fixed flex h-full w-full justify-center items-center bg-black/90 overflow-y-auto flex-col flex-wrap"
      onClick={() => setCanEditTags(false)}
    >
      <div
        className="bg-black/90 z-10 h-2/3 w-2/3 flex flex-col justify-between items-start border-1 border-zinc-400 overflow-y-auto p-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full items">
          <p className="text-[30px]">
            <b>Tags</b>
          </p>
          <br></br>
          <div className="w-[300px] flex items-center gap-[10px]">
            <p>Add a Tag!</p>
            <Btn
              onclick={() => {
                tags = addTag(tags, { name: "", color: "", isHidden: false });
                uf(clubs, tags);
              }}
              text="Add Tag"
            />
          </div>
          <br></br>
          <div className="flex flex-col w-full gap-[10px]">
            {tags.map((tagItem, tagIndex) => (
              <div
                key={tagIndex}
                className="flex w-full justify-start  gap-[10px]"
              >
                <div className="items-center flex gap-[10px]">
                  <p>Name: </p>
                  <Input
                    value={tagItem.name}
                    setValue={(e) => {
                      matchClubTags(tagItem, {
                        name: e,
                        color: tagItem.color,
                        isHidden: tagItem.isHidden,
                      });
                      tags = setTag(tags, tagIndex, "name", e);
                      uf(clubs, tags);
                    }}
                    placeholder={`Enter Tag Name`}
                  />
                </div>

                <div className=" flex items-center gap-[10px]">
                  <p>Color: </p>
                  <div className="flex gap-[10px]">
                    {!tagItem.isHidden &&
                      Object.entries(buttonColors).map(
                        ([name, value], index) => (
                          <div
                            key={index}
                            className=" w-[25px] h-[25px] flex items-center"
                          >
                            <button
                              className={`w-full h-full py-2 border-1 cursor-pointer ${tagItem.color == value ? value.slice(0, -3) + "200" : value} items-center rounded-md`}
                              onClick={() => {
                                matchClubTags(tagItem, {
                                  name: tagItem.name,
                                  color: value,
                                  isHidden: tagItem.isHidden,
                                });
                                tags = setTag(tags, tagIndex, "color", value);
                                uf(clubs, tags);
                              }}
                            ></button>
                          </div>
                        ),
                      )}
                  </div>
                </div>
                <Btn
                  onclick={() => {
                    deleteClubTags({
                      name: tagItem.name,
                      color: "",
                      isHidden: true,
                    });
                    tags = deleteTag(tags, tagIndex);
                    uf(clubs, tags);
                  }}
                  text="Delete Tag"
                />
              </div>
            ))}
          </div>
          <br></br>
          <p>
            Tags help you sort things out easier. Lets students find their
            clubs!
          </p>
        </div>
      </div>
    </div>
  );
}
