"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CornerDownLeft, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

export default function SearchButton() {
  const [search, setSearch] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"white"} className="rounded-2xl font-semibold">
          <SearchIcon /> <span className="hidden md:block">Search Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex gap-2 items-center justify-center"
            >
              <SearchIcon />
              <Input
                placeholder="Search Product..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button type="submit">
                <CornerDownLeft />
              </Button>
              <DialogClose className="px-2" type="button" asChild>
                <XIcon className="w-12 h-12" />
              </DialogClose>
            </form>
            <DialogDescription></DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`grid  gap-4 min-h-24 max-h-64 bg-white overflow-y-auto rounded-md ${
            search.length > 0 ? "visible" : "invisible"
          }`}
        ></div>
      </DialogContent>
    </Dialog>
  );
}
