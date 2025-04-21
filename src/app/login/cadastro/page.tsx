"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/landingpage/footer"
import { MenuNavbar } from "@/components/landingpage/menu"
import {FormCadastroUser} from "@/components/login/login-form-cadastro";

export default function LoginPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-neutral-100 to-neutral-100">
  
      <header className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <MenuNavbar />
      </header>
        {/* Hero Section */}
           {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-1">
        <Card className="w-full pt-15 pb-15 max-w-md border-2 border-gray-400  bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados abaixo para criar uma conta.
            </CardDescription>
          </CardHeader>
          <CardContent>   
            <FormCadastroUser />
          </CardContent>
        </Card>
      </main>
          {/** footer */}
          <Footer />
    </div>

  )
}

