
"use client"

import ConfirmacaoCodigoForm from "@/components/login/reset-password-request-form";

import { useSearchParams } from "next/navigation";

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <ConfirmacaoCodigoForm />
    </div>
  );
}