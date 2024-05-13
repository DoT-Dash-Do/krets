
import { HandWaving } from "@phosphor-icons/react";
import { Postcard } from "@/components/Postcard";
import { useSelector } from "react-redux";
import React, { useEffect,useState } from "react";
import axios from "axios";
import { serverlink } from "@/link";
export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverlink}/post/getUserFeed/${currentUser.rest._id}`);
      setLoading(false);
      setPosts(response.data);
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <>
      {loading && (
        <div className="flex justify-center min-h-full items-center text-2xl">
          loading...
        </div>
      )}
      {!loading && (
        <div className="flex flex-col items-center xl:border-0 border-x-8 border-col border-transparent">
          <div className="w-full p-2 flex gap-2 border-b">
            <HandWaving size={22} />
            <p>Hello,{currentUser.rest.username} </p>
          </div>
          <div className="w-full">
            {posts.map((element) => {
              return <Postcard key={element._id} Post={element} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}
