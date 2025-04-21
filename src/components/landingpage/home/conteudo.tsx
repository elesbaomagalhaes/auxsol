import Image from "next/image"
import Link from "next/link"

export default function Solucao() {

    return (
        <>
         <div className="grid grid-cols-12 md:grid-cols-12 gap-2">

        <div className="col-span-6 md:col-span-6 sm:col-span-12 items-center md:pt-25 sm:pt-1">
        <h1 className="text-4xl md:text-4xl font-bold mb-4">Documentação pronta com seu novo jeito de agilizar projetos fotovoltaicos!</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Tudo muito fácil, rápido e seguro.
          </p>
          <br />
          <Link href={"/landingpage/precos"} className="bg-black text-white px-6 py-3 rounded-full font-medium">
      Começar agora
    </Link>
        </div>

        <div className="flex justify-center col-span-6 md:col-span-6 sm:col-span-12 pb-8 sm:mt-1">
        <Image 
        src="/images/modulo-auxsol.png" 
        alt="solucao" 
        width={400} 
        height={400}
         />
        </div>
         </div>
        </>
    )

}