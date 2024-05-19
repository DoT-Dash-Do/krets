import React from "react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { serverlink } from "@/link";
import { Postcard } from "@/components/Postcard";
import SideCard from "@/components/SideCard";
export const Search = () => {
  const navig = useNavigate("");
  const params = useParams();
  const [stype, setStype] = useState(params.type);
  const [search, setSearch] = useState(params.id);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const getSearch = async () => {
    try {
      const response = await axios.post(`${serverlink}/post/search`, {
        search,
        stype,
      });
      if (stype === "Post") {
        setPosts(response.data);
      }
      if (stype === "Community") {
        setCommunities(response.data);
      }
      if (stype === "User") {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    setSearch(params.id)
  },[params,stype])
  useEffect(() => {
    getSearch();
  }, [search,stype]);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="md:hidden w-full flex max-w-[400px] items-center border rounded-lg">
        <Input
          type="text"
          placeholder="Search"
          className="border-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Button
          type="submit"
          variant="primary"
          onClick={() => {
            if (search.trim()) navig(`/search/${stype}/${search}`);
          }}
        >
          <MagnifyingGlass size={20} />
        </Button>
      </div>
      <Tabs defaultValue={stype} className="w-full">
        <TabsList className="w-full bg-transparent">
          <TabsTrigger
            value="Post"
            onClick={() => {
              setStype("Post");
            }}
          >
            Post
          </TabsTrigger>
          <TabsTrigger
            value="Community"
            onClick={() => {
              setStype("Community");
            }}
          >
            Community
          </TabsTrigger>
          <TabsTrigger
            value="User"
            onClick={() => {
              setStype("User");
            }}
          >
            User
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Post">
          <div className="w-full">
            {posts.map((element) => {
              return <Postcard key={element._id} Post={element} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="Community">
          <div className="border-x-8 border-transparent flex flex-col gap-2">
            {communities.map((element) => {
              return <SideCard key={element._id} element={element} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="User">
          <div className="border-x-8 border-transparent flex flex-col gap-2">
            {users.map((element) => {
              return (
                <Card className="bg-gray-200 dark:bg-gray-900 h-[150px] border-none shadow-none">
                  <div className="flex w-full bg-cover h-[80px] border-x-8 border-t-8 rounded-lg dark:border-gray-900">
                    <img
                      src={element.cover === "" ? "/Combg.png" : element.cover}
                      className="object-cover w-full rounded-lg"
                      alt="hello"
                    />
                  </div>
                  <CardContent className="flex p-2 items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className=" bg-gray-900 h-14 w-14 border-2">
                        <AvatarImage src={element.avatar} alt="PFP" />
                        <AvatarFallback className="Dark:bg-white text-orange-600 font-bold">
                          u/
                        </AvatarFallback>
                      </Avatar>
                      <p className="max-w-[125px] truncate font-bold">
                        u/{element.username}
                      </p>
                    </div>
                    <Button
                      className=" text-black dark:text-white bg-tranperant shadow-none rounded-md py-1"
                      onClick={() => {
                        navig(`/user/${element._id}`);
                      }}
                    >
                      visit
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
