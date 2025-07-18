import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { projetoId } = await request.json()

    if (!projetoId) {
      return NextResponse.json(
        { success: false, error: 'ID do projeto é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar o projeto com informações de acesso (latitude e longitude)
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId },
      include: {
        acesso: true
      }
    })

    if (!projeto || !projeto.acesso) {
      return NextResponse.json(
        { success: false, error: 'Projeto ou dados de acesso não encontrados' },
        { status: 404 }
      )
    }

    const { latitudeUTM, longitudeUTM } = projeto.acesso

    if (!latitudeUTM || !longitudeUTM) {
      return NextResponse.json(
        { success: false, error: 'Coordenadas de latitude e longitude não encontradas' },
        { status: 400 }
      )
    }

    // Converter coordenadas UTM para decimal se necessário
    const latitude = parseFloat(latitudeUTM)
    const longitude = parseFloat(longitudeUTM)

    // Consultar NASA POWER API
    const nasaUrl = `https://power.larc.nasa.gov/api/temporal/monthly/point`
    const params = {
      parameters: 'ALLSKY_SFC_SW_DWN',
      community: 'RE',
      longitude: longitude,
      latitude: latitude,
      start: '2020',
      end: '2023',
      format: 'JSON'
    }

    const response = await axios.get(nasaUrl, { params })
    
    if (!response.data || !response.data.properties || !response.data.properties.parameter) {
      return NextResponse.json(
        { success: false, error: 'Dados não encontrados na NASA POWER API' },
        { status: 500 }
      )
    }

    const solarData = response.data.properties.parameter.ALLSKY_SFC_SW_DWN
    
    // Calcular médias mensais dos anos disponíveis
    const monthlyAverages: { [key: string]: number } = {}
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    
    months.forEach(month => {
      const monthlyValues: number[] = []
      
      // Coletar valores do mês de todos os anos
      Object.keys(solarData).forEach(yearMonth => {
        if (yearMonth.endsWith(month)) {
          const value = solarData[yearMonth]
          if (value !== null && value !== undefined && value > 0) {
            monthlyValues.push(value)
          }
        }
      })
      
      // Calcular média
      if (monthlyValues.length > 0) {
        const average = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length
        monthlyAverages[month] = Math.round(average * 100) / 100 // Arredondar para 2 casas decimais
      } else {
        monthlyAverages[month] = 0
      }
    })

    // Mapear para nomes dos meses em português
    const hspData = {
      jan: monthlyAverages['01'],
      fev: monthlyAverages['02'],
      mar: monthlyAverages['03'],
      abr: monthlyAverages['04'],
      mai: monthlyAverages['05'],
      jun: monthlyAverages['06'],
      jul: monthlyAverages['07'],
      ago: monthlyAverages['08'],
      set: monthlyAverages['09'],
      out: monthlyAverages['10'],
      nov: monthlyAverages['11'],
      dez: monthlyAverages['12']
    }

    return NextResponse.json({
      success: true,
      data: hspData,
      coordinates: { latitude, longitude }
    })

  } catch (error) {
    console.error('Erro ao consultar NASA POWER API:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}