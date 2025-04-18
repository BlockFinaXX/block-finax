"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerUser(formData.email, formData.password);
      toast.success("Registration successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 mt-8">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
      </div>
      <Button className="w-full" onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </div>
  );
};

export default RegisterForm;
