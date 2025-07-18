import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { AIDescriptionRequest, AIDescriptionResponse } from '@/types/planta-localizacao'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      area,
      usage,
      address,
      elements,
      zoning,
      orientation,
      customPrompt,
      includeCompliance = true,
      includeRecommendations = true,
      projetoId
    }: AIDescriptionRequest & {
      customPrompt?: string
      includeCompliance?: boolean
      includeRecommendations?: boolean
      projetoId?: string
    } = body

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key não configurada' },
        { status: 500 }
      )
    }

    // Construir prompt para a IA
    const systemPrompt = `
Você é um especialista em engenharia civil e arquitetura, especializado em plantas de localização e conformidade com normas brasileiras (ABNT).

Sua tarefa é gerar uma descrição técnica detalhada para uma planta de localização com base nas informações fornecidas.

Diretrizes:
1. Use terminologia técnica apropriada
2. Considere as normas ABNT relevantes
3. Inclua informações sobre acessibilidade quando aplicável
4. Mencione aspectos de sustentabilidade e meio ambiente
5. Forneça recomendações práticas
6. Seja preciso e objetivo

Formato de resposta:
- Descrição técnica principal
- Lista de especificações técnicas
- Recomendações (se solicitado)
- Status de conformidade com normas (se solicitado)
`

    const userPrompt = `
Gere uma descrição técnica para uma planta de localização com as seguintes características:

**Informações do Terreno:**
- Área: ${area} m²
- Tipo de uso: ${usage}
- Endereço: ${address}
- Zoneamento: ${zoning || 'Não especificado'}
- Orientação: ${orientation || 'Não especificada'}

**Elementos presentes:**
${elements.length > 0 ? elements.join(', ') : 'Nenhum elemento específico informado'}

**Instruções adicionais:**
${customPrompt || 'Nenhuma instrução adicional'}

**Requisitos:**
- ${includeCompliance ? 'Incluir' : 'Não incluir'} análise de conformidade
- ${includeRecommendations ? 'Incluir' : 'Não incluir'} recomendações técnicas

Por favor, forneça uma resposta estruturada em formato JSON com os seguintes campos:
{
  "description": "Descrição técnica principal",
  "specifications": ["Lista de especificações técnicas"],
  "recommendations": ["Lista de recomendações"],
  "compliance": {
    "abnt": boolean,
    "municipal": boolean,
    "environmental": boolean
  }
}
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('Resposta vazia da OpenAI')
    }

    // Tentar fazer parse do JSON
    let aiResponse: AIDescriptionResponse
    try {
      aiResponse = JSON.parse(responseContent)
    } catch (parseError) {
      // Se não conseguir fazer parse, criar resposta estruturada
      aiResponse = {
        description: responseContent,
        specifications: [],
        recommendations: [],
        compliance: {
          abnt: false,
          municipal: false,
          environmental: false
        }
      }
    }

    // Validar e garantir estrutura correta
    const validatedResponse: AIDescriptionResponse = {
      description: aiResponse.description || responseContent,
      specifications: Array.isArray(aiResponse.specifications) ? aiResponse.specifications : [],
      recommendations: Array.isArray(aiResponse.recommendations) ? aiResponse.recommendations : [],
      compliance: {
        abnt: Boolean(aiResponse.compliance?.abnt),
        municipal: Boolean(aiResponse.compliance?.municipal),
        environmental: Boolean(aiResponse.compliance?.environmental)
      }
    }

    return NextResponse.json(validatedResponse)

  } catch (error) {
    console.error('Erro na API de geração de descrição:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}