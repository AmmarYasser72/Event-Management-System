import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // 👈 role selected on frontend

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password, role }, // 👈 send role too
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

if (response.data.success) {
  toast.success(response.data.message);

  const token = response.data.token;
  const user  = response.data.user; // ← comes from backend

  if (token) localStorage.setItem("userToken", JSON.stringify({ token }));
  if (user)  localStorage.setItem("user", JSON.stringify(user));

  const userRole = user.role;
  if (userRole !== role) {
    toast.error("Role mismatch! Please select the correct role.");
    return;
  }
  if (userRole === "admin") {
    navigate("/adminDashBoard");   // keep the casing consistent with App.jsx
  } else if (userRole === "user") {
    navigate("/userDashboard");
  } else {
    navigate("/");
  }
}
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-blue-600">EventX-studio</h1>
        </div>
        <div>
          <Link to={"/"} className="bg-blue-500 px-4 py-2 rounded-md text-white">
            Home
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="demo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 👇 Role Selection */}
          <div className="flex items-center gap-6 my-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>User</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>Admin</span>
            </label>
          </div>

          <button className="w-full bg-blue-700 text-white hover:bg-blue-900 p-2 rounded-md cursor-pointer mb-2">
            Login
          </button>

          <span>
            Don't have an account?{" "}
            <Link to={"/register"} className="text-blue-600 my-2">
              Sign up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
