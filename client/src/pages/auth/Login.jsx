import React, { useEffect } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../../redux/user/userSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverlink } from "@/link";

export default function Login() {
  
  const navig = useNavigate();
  const Dispatch = useDispatch();
  const{load,error} = useSelector((state)=>state.user);
  const [message, setMessage] = useState({
    message: "Let's get started.",
    className: "",
  });
  const [current, setCurrent] = useState("");
  const [formData, setFormData] = useState({});
  const [signUpData, setSignUpData] = useState({});
  const [val, setVal] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (formData.password.length < 8) {
      setVal(60);
      setMessage({
        message: "password should be more than 8 characters",
        className: "text-red-600",
      });
      setCurrent(formData.password);
      return;
    }
    if (formData.password != formData.cpassword) {
      setVal(60);
      setMessage({
        message: "passwords do not match",
        className: "text-red-600",
      });
      setCurrent(formData.password);
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setVal(20);
      setMessage({
        message: "not a valid email",
        className: "text-red-600",
      });
      setCurrent(formData.email);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${serverlink}/auth/signup`, formData);
      setVal(0);
      setMessage({
        message: "user created successfully",
        className: "text-green-800",
      });
      setCurrent("");
      setFormData({});
      setLoading(false);
    } catch (err) {
      setMessage({
        message: err.response.data.message,
        className: "text-red-600",
      });
      setLoading(false);
    }
  };

  const handleNext = () => {
    switch (val) {
      case 0:
        if (current == "") {
          setMessage({
            message: "field cant be empty",
            className: "text-red-600",
          });
          break;
        }
        setCurrent(formData.email || "");
        setVal(20);
        setMessage({
          message: "Enter your email",
          className: "",
        });
        break;
      case 20:
        if (current == "") {
          setMessage({
            message: "field cant be empty",
            className: "text-red-600",
          });
          break;
        }
        setCurrent(formData.username || "");
        setVal(40);
        setMessage({
          message: "Enter your username",
          className: "",
        });
        break;
      case 40:
        if (current == "") {
          setMessage({
            message: "field cant be empty",
            className: "text-red-600",
          });
          break;
        }
        setCurrent(formData.password || "");
        setVal(60);
        setMessage({
          message: "Enter your password",
          className: "",
        });
        break;
      case 60:
        if (current == "") {
          setMessage({
            message: "field cant be empty",
            className: "text-red-600",
          });
          break;
        }
        setCurrent(formData.cpassword || "");
        setVal(80);
        setMessage({
          message: "Confirm your password",
          className: "",
        });
        break;
    }
  };
  const handlePrev = () => {
    switch (val) {
      case 20:
        setVal(0);
        setCurrent(formData.Name);
        setMessage({
          message: "Let's get started",
          className: "",
        });
        break;
      case 40:
        setVal(20);
        setCurrent(formData.email);
        setMessage({
          message: "Enter your email",
          className: "",
        });
        break;
      case 60:
        setVal(40);
        setCurrent(formData.username);
        setMessage({
          message: "Enter your username",
          className: "",
        });
        break;
      case 80:
        setVal(60);
        setCurrent(formData.password);
        setMessage({
          message: "Enter your password",
          className: "",
        });
        break;
    }
  };

  const handleChange = (e) => {
    setCurrent(e.target.value);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.id]: e.target.value,
    });
  };
  const handleLoginSubmit = async () => {
    if (!(signUpData.email && signUpData.password)) {
      setError("please fill in credentials");
      return;
    }
    try {
      Dispatch(signInStart());
      const response = await axios.post(`${serverlink}/auth/login`, {
        email: signUpData.email,
        password: signUpData.password,
      });
      if(response.success === false)
      {
        Dispatch(signInFailure(response.message));
        return;
      }
      const {token,...rest} = response.data;
      window.localStorage.setItem('token',token);
      Dispatch(signInSuccess(rest));
      navig("/");
    } catch (err) {
      console.log(err);
      Dispatch(signInFailure(err.response.data.message));
    }
  };
  return (
    <div className="flex">
      <div className="hidden lg:block w-1/3 bg-[url('/computer.jpg')] bg-cover bg-center bg-no-repeat bg-black"></div>
      <div className="bg-contain lg:w-2/3 w-full flex flex-col items-center justify-center h-screen gap-2 bg-black ">
        <Card className="p-3 sm:w-[600px] flex border-0 bg-black relative">
          <CardTitle className="flex text-6xl text-orange-500 justify-center w-full">
            <Link to="/">krets</Link>
          </CardTitle>
        </Card>
        <Tabs defaultValue="Sign-in" className="w-[300px] sm:w-[600px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Sign-in">Sign-in</TabsTrigger>
            <TabsTrigger value="Sign-up">Sign-up</TabsTrigger>
          </TabsList>
          <TabsContent value="Sign-in">
            <Card className="border-0 h-[300px] bg-black">
              <CardHeader className="text-white">
                <CardTitle>Sign-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Input
                    id="email"
                    value={signUpData.email}
                    placeholder="Email"
                    className="focus:ring-1 text-white"
                    onChange={handleSignUpChange}
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    id="password"
                    value={signUpData.password}
                    placeholder="Password"
                    type="password"
                    className="focus:ring-1 text-white"
                    onChange={handleSignUpChange}
                  />
                </div>
              </CardContent>
              <CardContent>
                <CardDescription className="">
                  <Link to="/">Forgot Password?</Link>
                </CardDescription>
              </CardContent>
              <CardFooter>
                  <Button onClick={handleLoginSubmit} className="w-full">
                    Login
                  </Button>
              </CardFooter>
              <CardContent className="text-red-600">{error}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="Sign-up">
            <Card className="h-[300px] border-0 bg-black">
              <CardHeader className="text-white">
                <CardTitle>Sign-up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={message.className}>
                  {message.message}
                </CardDescription>
              </CardContent>
              <CardContent>
                <Progress value={val} />
              </CardContent>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  {val == 0 && (
                    <Input
                      id="Name"
                      type="text"
                      className="focus:ring-1 text-white"
                      placeholder="Your name"
                      value={current}
                      onChange={handleChange}
                    />
                  )}
                  {val == 20 && (
                    <Input
                      id="email"
                      type="email"
                      className="focus:ring-1 text-white"
                      placeholder="Email"
                      value={current}
                      onChange={handleChange}
                    />
                  )}
                  {val == 40 && (
                    <Input
                      id="username"
                      type="text"
                      className="focus:ring-1 text-white"
                      placeholder="Username"
                      value={current}
                      onChange={handleChange}
                    />
                  )}
                  {val == 60 && (
                    <Input
                      id="password"
                      type="password"
                      className="focus:ring-1 text-white"
                      placeholder="Password"
                      value={current}
                      onChange={handleChange}
                    />
                  )}
                  {val == 80 && (
                    <Input
                      id="cpassword"
                      type="password"
                      className="focus:ring-1 text-white"
                      placeholder="Confirm Password"
                      value={current}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </CardContent>
              <CardContent className="flex flex-col justify-between gap-1">
                {!loading && val != 80 && (
                  <Button onClick={handleNext}>Next</Button>
                )}
                {!loading && val == 80 && (
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Sign-up
                  </Button>
                )}
                {loading && <Button disabled></Button>}
                {!loading && val != 0 && (
                  <Button onClick={handlePrev}>Prev</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
