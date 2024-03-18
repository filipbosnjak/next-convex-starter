"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
// @ts-ignore
import { BuiltInProviderType } from "next-auth/providers";
import { SubmitHandler, useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { RegisterResponse } from "@/app/api/register/route";
import {SomethingWentWrongToast, SuccessfulRegistrationToast} from "@/components/ToastUtils";
import SingInWithGithubButton from "@/components/client-components/SingInWithGithubButton";
import {useAction, useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import SingInWithGoogleButton from "@/components/client-components/SingInWithGoogleButton";

export type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export function RegisterAuthForm({
  className,
  providers,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<RegisterInput>();

  const onSubmitHF: SubmitHandler<RegisterInput> = async (
    data: RegisterInput,
  ) => {
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (r) => {
      console.log(r)
      if (r.status === 200) {
        SuccessfulRegistrationToast(router, data);
      } else {
        const res = (await r.json()) as RegisterResponse;
        SomethingWentWrongToast(res.message);
      }
    });
  };

  return (
    <>
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmit(onSubmitHF)}>
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
                placeholder="********"
                type="password"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register("password", { required: true })}
              />
              <Input
                id="confirm-password"
                placeholder="********"
                type="password"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register("confirmPassword", { required: true })}
              />
            </div>
            <Button disabled={isLoading} type={"submit"}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Register with Email
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
        <SingInWithGoogleButton isLoading={isLoading} />
      </div>
    </>
  );
}
