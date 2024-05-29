import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactPlayer from "react-player";
import { PlugsConnected, ChatCentered, ShareFat } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
export const Postcard = ({ Post }) => {
  console.log(Post.description.includes("youtube.com"));
  const navig = useNavigate();
  return (
    <div className="border-b w-full py-2 relative">
      <Card className="border-none shadow-none hover:bg-gray-200 dark:hover:bg-black">
        <CardHeader className="flex-row gap-2">
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => {
              navig(`/community/${Post.community._id}`);
            }}
          >
            <AvatarImage
              className="object-cover"
              src={Post.community.avatar || "/klogo.png"}
              alt="@shadcn"
            />
            <AvatarFallback>k/</AvatarFallback>
          </Avatar>
          <p className="font-bold">k/{Post.community.communityName}</p>
        </CardHeader>
        <CardContent>
          <p className="text-wrap text-xs font-bold">{Post.title}</p>
        </CardContent>
        <CardContent className="flex flex-col ">
          {Post.description != "" &&
            Post.media.length === 0 &&
            typeof Post.description === "string" &&
            Post.description.includes("https://") && Post.description.includes("you") && (
            <div className="flex items-center h-[400px] w-full justify-center">
              <ReactPlayer
                url={Post.description}
                width="90%"
                height="100%"
                controls
              />
            </div>   
            )}
          {Post.description != "" && Post.media.length === 0 && (
            <CardDescription>{Post.description}</CardDescription>
          )}
          {Post.media.length != 0 && (
            <Carousel className="">
              <CarouselContent className="">
                {Post.media.map((element, index) => {
                  if (element.Type.startsWith("image/"))
                    return (
                      <CarouselItem
                        className="flex justify-center items-center"
                        key={index}
                      >
                        <img
                          src={element.Link}
                          className="object-cover md:max-h-[300px]"
                        />
                      </CarouselItem>
                    );
                  else {
                    return (
                      <CarouselItem
                        className="flex justify-center items-center"
                        key={index}
                      >
                        <video
                          className="md:max-h-[300px]"
                          controls
                          src={element.Link}
                        ></video>
                      </CarouselItem>
                    );
                  }
                })}
              </CarouselContent>
              {Post.media.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          )}
        </CardContent>
        <CardFooter className="bg-grey flex justify-between">
          <div className="flex gap-1 sm:gap-4 sm:w-1/2 justify-between">
            <div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer text-sm sm:text-xl">
              <PlugsConnected
                className="hover:text-orange-600"
                size={32}
                onClick={() => {
                  navig(`/post/${Post._id}`);
                }}
              />
              <p>{Post.totalLikes}</p>
            </div>
            <div className="flex items-center hover:bg-slate-200 dark:hover:bg-black p-2 rounded-lg select-none cursor-pointer">
              <ChatCentered
                size={32}
                onClick={() => {
                  navig(`/post/${Post._id}`);
                }}
                className="hover:text-orange-600"
              />
              <p className="text-sm sm:text-xl">{Post.totalComments}</p>
            </div>
            <div className="flex items-center absolute top-9 right-4 sm:relative sm:top-0 sm:right-0">
              <Dialog>
                <DialogTrigger className="text-center">
                  <ShareFat size={32} className="hover:text-orange-600" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Shareable-Link</DialogTitle>
                    <DialogDescription>
                      <Input
                        value={`https://krets-alpha.vercel.app/post/${Post._id}`}
                      />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex justify-end w-full truncate">
            <Link to={`/user/${Post.user._id}`} className="text-sm sm:text-lg">
              <span className="hover:text-orange-600 text-sm sm:text-lg">
                u/{Post.user.username}
              </span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
