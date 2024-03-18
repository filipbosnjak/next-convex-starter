"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
// @ts-ignore

import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterInput } from "@/app/register/components/RegisterAuthForm";
import { redirect, useRouter } from "next/navigation";
import {SomethingWentWrongToast} from "@/components/ToastUtils";
import SingInWithGithubButton from "@/components/client-components/SingInWithGithubButton";
import SingInWithGoogleButton from "@/components/client-components/SingInWithGoogleButton";
import {api} from "@/convex/_generated/api";
import {useAction} from "convex/react";

export type LoginInput = {
  email: string;
  password: string;
};
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /*  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;*/
}

export function LoginAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<RegisterInput>();

  const login: SubmitHandler<RegisterInput> = async (data: LoginInput) => {
    let res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    console.log(res);
    switch (res?.status) {
      case 200:
        router.push("/");
        break;
      case 401:
        SomethingWentWrongToast("Invalid credentials");
        break;
      default:
        SomethingWentWrongToast("Error logging in");
        break;
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(login)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email", { required: true })}
            />
            <Input
              id="password"
              placeholder=""
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password", { required: true })}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <SingInWithGoogleButton isLoading={isLoading}  />
    </div>
  );
}
