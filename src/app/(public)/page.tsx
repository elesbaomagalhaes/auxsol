import ConteudoLanding from "@/components/landingpage/home/conteudo"
import Footer from "@/components/landingpage/footer"
import { MenuNavbar } from "@/components/landingpage/menu"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-neutral-100 to-neutral-100">
      <header className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <MenuNavbar />
      </header>
        {/* Hero Section */}
        <main className="flex flex-col items-center text-center mx-auto max-w-4xl min-h-[500px] flex-grow py-8">    
            <ConteudoLanding />
          {/* Features */}
        </main>
          {/** footer */}
          <Footer />
    </div>

  )
}

