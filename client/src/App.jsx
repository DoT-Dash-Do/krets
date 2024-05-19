import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./themes/ThemeProvider";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Sidebar from "./components/Sidebar";
import Popular from "./pages/Popular";
import CreateCommunity from "./pages/CreateCommunity";
import { serverlink } from "./link";
import Community from "./pages/Community";
import CreatePost from "./pages/CreatePost";
import SideCard from "./components/SideCard";
import UserProfile from "./pages/UserProfile";
import UpdateUser from "./pages/UpdateUser";
import NotFound from "./pages/NotFound";
import UserPostAndCommunity from "./pages/UserPostAndCommunity";
import EditCommunity from "./pages/EditCommunity";
import axios from "axios";
import { SinglePost } from "./pages/SinglePost";
import { Search } from "./pages/Search";
function App() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [nav, setNav] = useState("");
  const [pad, setPad] = useState("flex h-screen pt-14 w-full");
  const [view, setView] = useState("flex justify-center w-full");
  const [side, setSide] = useState("");
  const [sugg, setSugg] = useState("border-2 hidden lg:block max-h-screen");
  const [result, setResult] = useState([]);
  const [mainView, setMain] = useState(
    "mt-2 w-11/12 xl:w-full xl:max-w-[700px]"
  );
  useEffect(() => {
    if (location.pathname.startsWith("/login")) {
      setNav("hidden");
      setPad("h-screen w-full");
      setSide("hidden");
      setView("h-full w-full");
      setSugg("hidden");
      setMain("");
    } else {
      setNav("fixed top-0 z-10");
      setPad("flex h-full pt-14 w-full");
      setView("flex justify-center w-full");
      setSide("hidden lg:block");
      setSugg(
        "hidden xl:block mx-4 mt-4 w-[300px] dark:text-white max-h-screen overflow-auto style-3"
      );
      setMain(" w-full xl:w-full xl:max-w-[700px] overflow-auto style-3");
    }
  }, [location]);
  const getTenCommunities = async()=>{
    try {
      const response = await axios(
        `${serverlink}/community/getTenCommunities`
      );
      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    getTenCommunities();
  },[])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen">
        <div className={nav}>
          <Navbar />
        </div>
        <div className={pad}>
          <div className={side}>
            <Sidebar />
          </div>
          <div className={view}>
            <div className={mainView}>
              <Routes>
                {currentUser && (
                  <>
                    <Route path="/home" element={<Home />} />
                    <Route
                      path="/create-community"
                      element={<CreateCommunity />}
                    />
                    <Route path="/create-post/:id" element={<CreatePost />} />
                    <Route path="/update-user" element={<UpdateUser />} />
                    <Route
                      path="/user-posts-community/:id"
                      element={<UserPostAndCommunity />}
                    />
                    <Route
                      path="/edit-community/:id"
                      element={<EditCommunity />}
                    />
                  </>
                )}
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/search/:type/:id" element={<Search/>}/>
                <Route path="/community/:id" element={<Community />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Popular />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/post/:id" element={<SinglePost/>}/>
              </Routes>
            </div>
            <div className={sugg}>
              <p className="font-bold text-xl mb-2">Popular Communities</p>
              <div className="flex flex-col gap-2">
                {result.length > 0 && result.map((element,index)=>{
                  return (<SideCard element={element} key={index}/>)
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
