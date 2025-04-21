"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, ChevronRight, Play } from "lucide-react"

export default function Precos() {
    return ( 
        <>      
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Amigável, como tem que ser!</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Acreditamos que nosso sistema deve ser acessível a todas as empresas,<br /> não importa o tamanho.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-gray-100 border-2 border-gray-400 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Integrador</h2>
            <p className="text-gray-600 text-sm">Homologação sem dor de cabeça pra quem vende e instala</p>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-2xl">R$</span>
            <span className="text-5xl font-bold">169,99</span>
            <span className="text-gray-600 ml-2">por-projeto</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">FUNCIONALIDADES</h3>
            <p className="text-sm text-gray-600">Para você que não tem responsável técnico</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Memorial téc. descritivo + ART</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Formulários de solicitação  de orçamento</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Formulários de solicitação  de vistoria</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Relatório de comissionamento</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Diagramas de bloco e unifiliar</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Para potências até 10kWp</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Responsável técnico para assinaturas</span>
            </div>
          </div>
          <Button className="w-full bg-gray-900 hover:bg-gray-800">Quero começar</Button>
        </div>
        {/* Premium Plan */}
        <div className="bg-gray-100 border-2 border-gray-400  rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Técnico</h2>
            <p className="text-gray-600 text-sm">Gere e assine sua documentação ou envie para o Téc. responsável</p>
          </div>

          <div className="flex items-baseline mb-6">
            <span className="text-2xl">R$</span>
            <span className="text-5xl font-bold">49,99</span>
            <span className="text-gray-600 ml-2">por-projeto</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-2">FUNCIONALIDADES</h3>
            <p className="text-sm text-gray-600">Centralize seus projetos e diga adeus ao copiar e colar</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Memorial téc. descritivo</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Formulários de solicitação  de orçamento</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Formulários de solicitação  de vistoria</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Relatório de comissionamento</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Diagramas de bloco e unifiliar</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-gray-900 p-0.5 mt-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Para potências até 10kWp</span>
            </div>
          </div>
          <Button className="w-full bg-gray-900 hover:bg-gray-800">Quero começar</Button>
        </div>

        </div>
    </>


    )
}