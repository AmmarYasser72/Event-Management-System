import React, { useState } from "react";
import axios from "axios";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";

import { Loader2 } from "lucide-react";

function Signup() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        {
          username,
          email,
          phoneNumber: PhoneNumber,
          password,
          role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-blue-600">EventX-studio</h1>
        </div>
        <div>
          <Link to={"/"} className="bg-blue-500 px-4 py-2 rounded-md text-white">Home</Link>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          action=""
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label>username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              name="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="demo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-2">
            <Label>PhoneNumber</Label>
            <Input
              type="text"
              placeholder=""
              name="phonenumber"
              value={PhoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center gap-3">
                <Input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">User</Label>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="radio"
                  name="role"
                  value="admin"
                  className="cursor-pointer"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Label htmlFor="r2">Admin</Label>
              </div>
            </RadioGroup>
          </div>
          <button className="w-full bg-blue-700 text-white hover:text-white hover:bg-blue-900 p-2 rounded-md cursor-pointer mb-2">
            Signup
          </button>

          <span>
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-600 my-2">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
