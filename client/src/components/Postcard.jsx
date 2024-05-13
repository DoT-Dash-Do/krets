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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
export const Postcard = ({ Post }) => {
  const navig = useNavigate();
  return (
    <div className="border-b w-full py-2">
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
              src={
                Post.community.avatar ||
                "/klogo.png"
              }
              alt="@shadcn"
            />
            <AvatarFallback>k/</AvatarFallback>
          </Avatar>
          <p className="font-bold">k/{Post.community.communityName}</p>
        </CardHeader>
        <CardContent>
          <p className="text-wrap text-xs font-bold">{Post.title}</p>
        </CardContent>
        <CardContent className="">
          {Post.description != "" && Post.media.length === 0 && (
            <CardDescription>{Post.description}</CardDescription>
          )}
          {Post.media.length != 0 && (
            <Carousel className="">
              <CarouselContent className="">
                {Post.media.map((element) => {
                  if (element.Type.startsWith("image/"))
                    return (
                      <CarouselItem className="flex justify-center items-center">
                        <img
                          src={element.Link}
                          className="object-cover md:max-h-[300px]"
                        />
                      </CarouselItem>
                    );
                  else {
                    return (
                      <CarouselItem className="flex justify-center items-center">
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
      </Card>
    </div>
  );
};
