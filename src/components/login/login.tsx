"use client";

import { loginSchema, LoginSchemaType } from "@/app/schemas/login";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "cn";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

 async function onSubmit(data: LoginSchemaType) {
  try {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log('Login Of Response:::',response);

    if (response?.ok && !response?.error) {
      toast.success("Login successful!");

      const session = await getSession();
      const role = session?.user?.role?.toUpperCase();

      // Role check (optional – for logging / future use)
      console.log("Logged in as:", role);

      // Single dashboard for all roles
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error("Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong. Please try again.");
  }
}

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-10 flex flex-col gap-6",
        className
      )}
      {...props}
    >
      {/* Logo */}
      <div className="flex justify-center">
         <LockKeyhole className="h-8 w-8" />
      </div>

      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-xl font-semibold text-gray-900">SING IN</h1>
        <p className="text-sm text-gray-500 leading-snug">
          Drive growth with intelligent automation
          <br />
          and effortless teamwork
        </p>
      </div>

      {/* EMAIL */}
      <Field className="space-y-1.5">
        <FieldLabel htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </Field>

      {/* PASSWORD */}
      <Field className="space-y-1.5">
        <div className="flex items-center justify-between">
          <FieldLabel
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </FieldLabel>
          <Link
            href="/forgot-password"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </Field>

      {/* SIGN IN BUTTON */}
     <Button
  type="submit"
  disabled={isSubmitting}
  className="h-11 w-full rounded-lg bg-[#0D9488] hover:bg-gradient-to-r hover:from-[#0F766E] hover:to-[#0D9488] text-white font-medium text-sm shadow-sm transition-all duration-300"
>
  {isSubmitting ? "Signing in..." : "Sign In"}
</Button>

      {/* SOCIAL BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium gap-2"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          Github
        </Button>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-gray-900 hover:text-teal-600 inline-flex items-center gap-0.5"
        >
          Sign Up <span className="text-base leading-none">›</span>
        </Link>
      </p>
    </form>
  );
}