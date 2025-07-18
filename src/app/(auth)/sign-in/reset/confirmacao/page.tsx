
"use client"

import ConfirmacaoCodigoForm from "@/components/login/reset-password-request-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic'

function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <ConfirmacaoCodigoForm />
    </div>
  );
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmacaoContent />
    </Suspense>
  );
}