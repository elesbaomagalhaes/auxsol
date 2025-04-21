

import Footer from "@/components/landingpage/footer"
import { MenuNavbar } from "@/components/landingpage/menu"
import { ResetPasswordForm } from "@/components/login/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-neutral-100 to-neutral-100">
  
      <header className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <MenuNavbar />
      </header>
        {/* Hero Section */}
        <main className="flex flex-col items-center text-center mx-auto max-w-4xl min-h-[500px] flex-grow py-8">   
        <Card className="w-full pt-15 pb-15 max-w-md border-2 border-gray-400  bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Resetar senha</CardTitle>
            <CardDescription className="text-center">
              Preencha com seu e-mail abaixo para criar receber um código.
            </CardDescription>
          </CardHeader>
          <CardContent>   
          <ResetPasswordForm />
          </CardContent>
        </Card> 
            
          {/* Features */}
        </main>
          {/** footer */}
          <Footer />
    </div>

  )
}

