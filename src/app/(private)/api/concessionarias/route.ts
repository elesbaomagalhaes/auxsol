import { auth } from "@/lib/auth"
import  prisma  from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar concessionárias ativas do banco de dados
    const concessionarias = await prisma.concessionaria.findMany({
      where: {
        status: "a"
      },
      select: {
        id: true,
        nome: true,
        sigla: true,
        estado: true
      },
      orderBy: {
        nome: "asc"
      }
    })

    return NextResponse.json(concessionarias)
  } catch (error) {
    console.error("Erro ao buscar concessionárias:", error)
    
    // Fallback estático em caso de erro (ordenado alfabeticamente)
    const concessionariasFallback = [

      { id: "1", sigla: "EQTMA", nome: "Equatorial Maranhão", estado: "MA" },
      { id: "2", sigla: "EQTPI", nome: "Equatorial Piauí", estado: "PI" },

    ]
    
    return NextResponse.json(concessionariasFallback)
  }
}