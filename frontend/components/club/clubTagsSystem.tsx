"use client";

import { cls } from "@/lib/clubStore";
import Modal from "../ui/modal";
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
    <Modal closeModal={() => setCanEditTags(false)}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">Manage tags</h2>
        <div>
          Tags help you sort things out and let students find their clubs more
          easily!
        </div>
        <div className="flex flex-col w-full gap-y-5">
          {tags.map((tagItem, tagIndex) => (
            <div key={tagIndex} className="flex flex-col gap-y-3">
              <div className="items-center flex gap-[10px]">
                Name:
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
                Color:
                <div className="flex gap-[10px]">
                  {!tagItem.isHidden &&
                    Object.entries(buttonColors).map(([name, value], index) => (
                      <div
                        key={index}
                        className=" w-[25px] h-[25px] flex items-center"
                      >
                        <button
                          className={`w-full h-full py-2 border-1 cursor-pointer ${tagItem.color == value ? value + " border-white" : value + " border-zinc-800"} items-center rounded-md`}
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
                    ))}
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
                styles="w-fit"
                text="Delete Tag"
              />
            </div>
          ))}
        </div>

        <div className="w-[300px] flex items-center gap-[10px]">
          <Btn
            onclick={() => {
              tags = addTag(tags, { name: "", color: "", isHidden: false });
              uf(clubs, tags);
            }}
            text="Add Tag"
          />
        </div>
        <Btn
          text="Save"
          onclick={() => setCanEditTags(false)}
          styles="w-fit"
          primary
        />
      </div>
    </Modal>
  );
}
