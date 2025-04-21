import Precos from "@/components/landingpage/precos/conteudo"
import Footer from "@/components/landingpage/footer"
import { MenuNavbar } from "@/components/landingpage/menu"

export default function Solucao() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-neutral-100 to-neutral-100">
      <header className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <MenuNavbar />
      </header>
        {/* Hero Section */}
        <main className="flex flex-col items-center text-center max-w-3xl mx-auto min-h-[350px] flex-grow">    
            <Precos />
          {/* Features */}
        </main>
          {/** footer */}
          <Footer />
    </div>
    
  )
}

