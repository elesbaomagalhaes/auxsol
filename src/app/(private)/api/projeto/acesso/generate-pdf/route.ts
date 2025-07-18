import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import prisma from '@/lib/prisma'
import { calcularPotencia, converterCoordenadasParaUTM, verificarCriterioGeracao } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { projetoId } = await request.json()

    if (!projetoId) {
      return NextResponse.json(
        { error: 'ID do projeto é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar dados do acesso e cliente relacionado
    const acesso = await prisma.acesso.findFirst({
      where: {
        numProjeto: projetoId
      },
      include: {
        client: true
      }
    })

    // Buscar dados do projeto para acessar disjuntorPadrao e técnico
    const projeto = await prisma.projeto.findUnique({
      where: {
        numProjeto: projetoId
      },
      include: {
        tecnico: true
      }
    })

    // Buscar dados do kit para acessar módulos
    const kits = await prisma.kit.findMany({
      where: {
        numProjeto: projetoId,
        tipo: 'modulo',
        status: 'a'
      }
    })

    // Buscar dados do módulo se existir kit
    let modulo = null
    if (kits.length > 0) {
      modulo = await prisma.modulo.findUnique({
        where: {
          id: kits[0].itemId
        }
      })
    }

    // Buscar dados do kit de inversor
    const kitsInversor = await prisma.kit.findMany({
      where: {
        numProjeto: projetoId,
        tipo: 'inversor',
        status: 'a'
      }
    })

    // Buscar dados do inversor se existir kit
    let inversor = null
    if (kitsInversor.length > 0) {
      inversor = await prisma.inversor.findUnique({
        where: {
          id: kitsInversor[0].itemId
        }
      })
    }

    // Buscar e calcular a soma das potências da carga instalada
    const cargasInstaladas = await prisma.cargaInstalada.findMany({
      where: {
        numProjeto: projetoId,
        status: 'a'
      }
    })

    const cargaInstalada = cargasInstaladas.reduce((total, carga) => {
      return total + (Number(carga.potenciaW) * Number(carga.qtd))
    }, 0) / 1000

    if (!acesso) {
      return NextResponse.json(
        { error: 'Dados de acesso não encontrados para este projeto' },
        { status: 404 }
      )
    }

    // Função para formatar data no padrão dd/mm/yyyy
    const formatDate = (dateInput: string | Date | null | undefined): string => {
      if (!dateInput) return ''
      
      try {
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
        if (isNaN(date.getTime())) return dateInput.toString() // Retorna original se não for uma data válida
        
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        
        return `${day}/${month}/${year}`
      } catch (error) {
        return dateInput?.toString() || '' // Retorna original em caso de erro
      }
    }

    // Função para extrair apenas o primeiro número antes da vírgula
    const extractFirstContractNumber = (contractNumber: string | null | undefined): string => {
      if (!contractNumber) return ''
      
      // Se houver vírgula, pega apenas a parte antes da primeira vírgula
      if (contractNumber.includes(',')) {
        return contractNumber.split(',')[0].trim()
      }
      
      // Se não houver vírgula, retorna o valor original
      return contractNumber.trim()
    }

    // Função para formatar potência com vírgulas e casas decimais
    const formatPotencia = (potencia: any): string => {
      if (!potencia) return 'N/A'
      
      try {
        const num = Number(potencia)
        if (isNaN(num)) return 'N/A'
        return num.toFixed(2).replace('.', ',')
      } catch (error) {
        return 'N/A'
      }
    }

    // Função para formatar a data atual no formato dd/mm/yyyy
    const formatDataAtual = (): string => {
      const hoje = new Date()
      const dia = hoje.getDate().toString().padStart(2, '0')
      const mes = (hoje.getMonth() + 1).toString().padStart(2, '0')
      const ano = hoje.getFullYear()
      return `${dia}/${mes}/${ano}`
    }

    // Gerar HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Solicitação de Acesso - ${acesso.numProjeto} -  ${acesso.client?.nome}</title>
        <style>@page{size:A4;margin:0.0cm;}body{font-family:Arial,sans-serif;line-height:1.4;color:#333;}p{line-height:0.5;text-transform:uppercase;font-size:8px;color:green;}.quadrado{width:85.5%;height:97.9vh;box-sizing:border-box;background-image:url('https://res.cloudinary.com/dlqvus7jx/image/upload/v1752103972/solicitacao-acesso-EQTL_vv8vxc.png');background-size:98% 100%;background-repeat:no-repeat;margin:3px 2px 2px 65px;position:relative;}.quadrado div{position:absolute;}.destaque{color:black!important;font-weight:600!important;}.nomeCli{top:71px;left:20px;}.cpf{top:71px;left:390px;}.rg{top:61px;left:582px;}.rgData{top:71px;left:582px;}.endereco{top:95px;left:20px;}.celular{top:95px;left:410px;}.cep{top:109px;left:45px;}.cidade{top:109px;left:175px;}.uf{top:109px;left:350px;}.email{top:109px;left:445px;}.email p{text-transform:lowercase!important;}.tipoOrcamento{top:124px;left:120px;}.CC{top:124px;left:530px;}.infoCC{top:153px;left:15px;}.tipoSolicitacao{top:139px;left:130px;}.cargaEsp{top:167px;left:106px;}.ramoAtiv{top:196px;left:113px;}.tipoLigacao{top:196px;left:400px;}.tensaoUC{top:196px;left:585px;}.cI{top:210px;left:118px;}.disjuntor{top:210px;left:335px;}.ptcDispn{top:210px;left:565px;}.tipoRamal{top:225px;left:118px;}.long{top:248px;left:335px;line-height:0.5;font-size:8px;}.lat{top:248px;left:505px;line-height:0.5;font-size:8px;}.tecNome{top:278px;left:35px;}.tecTit{top:278px;left:285px;}.tecRegist{top:278px;left:505px;}.tecUF{top:280px;left:625px;}.tecEmail{top:310px;left:35px;line-height:0.5;font-size:8px;}.tecCel{top:302px;left:400px;}.tecEndereco{top:326px;left:20px;}.tecBairro{top:317px;left:327px;}.tecCidade{top:326px;left:327px;}.tecUFEnd{top:317px;left:580px;}.tecCEP{top:326px;left:580px;}.tipoFont{top:365px;left:130px;}.tipoGeracao{top:384px;left:130px;font-size:7px;}.modalidade{top:394px;left:180px;}.infoModalidade{top:408px;left:80px;}.potGerOrcamento{top:394px;left:595px;}.potGerTotal{top:408px;left:595px;}.potMaxInjetavel{top:422px;left:595px;}.modalidade7-5{top:856px;left:616px;font-size:6.5px;}.dataAssinatura{top:1056px;left:435px;font-size:6.5px;}.cidadeAssinatura{top:1061px;left:300px;font-size:6.5px;}.page-break{page-break-before:always;}
        
        .quadrado-page2{width:82.5%;height:97.9vh;box-sizing:border-box;background-image:url('https://res.cloudinary.com/dlqvus7jx/image/upload/v1752180830/solicitacao-acesso-EQT-0_c2cfpi.png');background-size:98% 100%;background-repeat:no-repeat;margin:15px 2px 2px 80px;}.quadrado-page2 div{position:absolute;}
        .ptcModulo{top:1185px;left:160px;}.qtdModulo{top:1185px;left:260px;}.ptcTotalModulo{top:1185px;left:340px;}.areaModulo{top:1185px;left:420px;}.fabModulo{top:1185px;left:520px;}.modelModulo{top:1185px;left:610px;}.fabInversor{top:1353px;left:160px;}.modelInversor{top:1353px;left:260px;}.potInversor{top:1353px;left:340px;}.faixaOpInversor{top:1353px;left:415px;}.corrNomInversor{top:1353px;left:490px;}.fatorPotencia{top:1353px;left:550px;}.eficiencia{top:1353px;left:600px;}.dht{top:1353px;left:670px;}.potTotalInversor{top:1353px;left:6350px;}

        .quadrado-page3{width:82.5%;height:97.9vh;box-sizing:border-box;background-image:url('https://res.cloudinary.com/dlqvus7jx/image/upload/v1752234537/solicitacao-acesso-EQTL-2_hw30ye.png');background-size:98% 100%;background-repeat:no-repeat;margin:15px 2px 2px 80px;}.quadrado-page3 div{position:absolute;}.ccUc{top:1400px;left:160px;}.enquadRateio{top:1400px;left:160px;}.enderecoRateio{top:1400px;left:160px;}.formAlocCredito{top:1400px;left:160px;}.infoRateio{top:1400px;left:160px;}.cc1{top:1400px;left:160px;}.cc2{top:1400px;left:160px;}cc3{top:1400px;left:160px;}cc4{top:1400px;left:160px;}cc6{top:1400px;left:160px;}cc7{top:1400px;left:160px;}.cc8{top:1400px;left:160px;}cc3{top:1400px;left:160px;}cc9{top:1400px;left:160px;}cc10{top:1400px;left:160px;}.classeConsumo1{top:1400px;left:160px;}.classeConsumo{top:1400px;left:160px;}.classeConsumo2{top:1400px;left:160px;}.classeConsumo3{top:1400px;left:160px;}.classeConsumo4{top:1400px;left:160px;}.classeConsumo5{top:1400px;left:160px;}.classeConsumo6{top:1400px;left:160px;}.classeConsumo7{top:1400px;left:160px;}.classeConsumo8{top:1400px;left:160px;}.classeConsumo9{top:1400px;left:160px;}.classeConsumo10{top:1400px;left:160px;}.endRateio1{top:1440px; left:140px}.endRateio2{top:1440px; left:140px}.endRateio3{top:1440px; left:140px}.endRateio4{top:1440px; left:140px}.endRateio5{top:1440px; left:140px}.endRateio6{top:1440px; left:140px}.endRateio7{top:1440px; left:140px}.endRateio8{top:1440px; left:140px}.endRateio9{top:1440px; left:140px}            
        .quadrado-page3{width:82.5%;height:97.9vh;box-sizing:border-box;background-image:url('https://res.cloudinary.com/dlqvus7jx/image/upload/v1752234537/solicitacao-acesso-EQTL-2_hw30ye.png');background-size:98% 100%;background-repeat:no-repeat;margin:15px 2px 2px 80px;}.quadrado-page3 div{position:absolute;}
        
        .ccUC{top:2300px;left:310px;}.enquadRateio{top:2300px;left:485px;}.enderecoRateio{top:1400px;left:160px;}.alocacaoCredito{top:1400px;left:160px;}.infoRateio{top:1400px;left:160px;}.cc1{top:1400px;left:160px;}.cc2{top:1400px;left:160px;}cc3{top:1400px;left:160px;}cc4{top:1400px;left:160px;}cc6{top:1400px;left:160px;}cc7{top:1400px;left:160px;}.cc8{top:1400px;left:160px;}cc3{top:1400px;left:160px;}cc9{top:1400px;left:160px;}cc10{top:1400px;left:160px;}.classeConsumo1{top:1400px;left:160px;}.classeConsumo{top:1400px;left:160px;}.classeConsumo2{top:1400px;left:160px;}.classeConsumo3{top:1400px;left:160px;}.classeConsumo4{top:1400px;left:160px;}.classeConsumo5{top:1400px;left:160px;}.classeConsumo6{top:1400px;left:160px;}.classeConsumo7{top:1400px;left:160px;}.classeConsumo8{top:1400px;left:160px;}.classeConsumo9{top:1400px;left:160px;}.classeConsumo10{top:1400px;left:160px;}.endRateio1{top:1440px; left:140px}.endRateio2{top:1440px; left:140px}.endRateio3{top:1440px; left:140px}.endRateio4{top:1440px; left:140px}.endRateio5{top:1440px; left:140px}.endRateio6{top:1440px; left:140px}.endRateio7{top:1440px; left:140px}.endRateio8{top:1440px; left:140px}.endRateio9{top:1440px; left:140px}.endRateio10{top:1440px; left:140px}            

        </style>
      </head>
      <body>
      <div class="quadrado">
      <div class="nomeCli">
      <p>${acesso.client?.nome}</p>
      </div>
      <div class="cpf">
      <p>${acesso.client?.cpf}</p>
      </div>
      <div class="rg">
      <p>${acesso.client?.rgCnh}</p>
      </div>
      <div class="rgData">
      <p>${formatDate(acesso.client?.rgCnhDataEmissao)}</p>
      </div>
      <div class="endereco">
      <p>${acesso.client?.rua}, ${acesso.client?.numero}, ${acesso.client?.bairro} | ${acesso.client?.complemento}</p>
      </div>
      <div class="celular">
      <p>${acesso.client?.fone}</p>
      </div>
      <div class="cep">
      <p>${acesso.client?.cep}</p>
      </div>
      <div class="cidade">
      <p>${acesso.client?.cidade}</p>
      </div>
      <div class="uf">
      <p>${acesso.client?.uf}</p>
      </div>
      <div class="email">
      <p>${acesso.client?.email}</p>
      </div>
      <div class="tipoOrcamento">
      <p class="destaque">ORÇAMENTO DE CONEXÃO</p>
      </div>
      <div class="tipoSolicitacao">
      <p class="destaque">${acesso.tipoSolicitacao}</p>
      </div>
      <div class="infoCC">
      <p class="destaque">INFORMAR O NÚMERO DA CONTA CONTRATO</p>
      </div>
      <div class="CC">
      <p>${extractFirstContractNumber(acesso.contractNumber)}</p>
      </div>
      <div class="cargaEsp">
      <p class="destaque">NÃO</p>
      </div>
      <div class="ramoAtiv">
      <p class="destaque">${acesso.ramoAtividade}</p>
      </div>
      <div class="tipoLigacao">
      <p class="destaque">${acesso.tipoConexao}</p>
      </div>
      <div class="tensaoUC">
      <p class="destaque">${acesso.tensaoRede}</p>
      </div>
      <div class="cI">
      <p class="destaque">${cargaInstalada.toFixed(2).replace('.', ',')}</p>
      </div>
      <div class="tipoRamal">
      <p class="destaque">${acesso.tipoRamal}</p>
      </div>
      <div class="disjuntor">
      <p class="destaque">${projeto?.disjuntorPadrao || 'N/A'}</p>
      </div>
      <div class="ptcDispn">
       <p class="destaque">${(() => {
         try {
           if (acesso.tipoConexao && acesso.tensaoRede && projeto?.disjuntorPadrao) {
             const potencia = calcularPotencia(
               acesso.tipoConexao,
               Number(acesso.tensaoRede),
               Number(projeto.disjuntorPadrao)
             );
             return potencia.toFixed(2).replace('.', ',');
           }
           return 'N/A';
         } catch (error) {
           return 'N/A';
         }
       })()}</p>
      </div>
      <div class="long">
      <span class="destaque">${(() => {
        try {
          if (acesso.longitudeUTM && acesso.latitudeUTM) {
            const longitude = parseFloat(acesso.longitudeUTM);
            const latitude = parseFloat(acesso.latitudeUTM);
            const coordUTM = converterCoordenadasParaUTM(longitude, latitude);
            return coordUTM.longitudeUTM;
          }
          return 'N/A';
        } catch (error) {
          return 'N/A';
        }
      })()}.00 m E</span>
      </div>
      <div class="lat">
      <span class="destaque">${(() => {
        try {
          if (acesso.longitudeUTM && acesso.latitudeUTM) {
            const longitude = parseFloat(acesso.longitudeUTM);
            const latitude = parseFloat(acesso.latitudeUTM);
            const coordUTM = converterCoordenadasParaUTM(longitude, latitude);
            return coordUTM.latitudeUTM;
          }
          return 'N/A';
        } catch (error) {
          return 'N/A';
        }
      })()}.00 m S</span>
      </div>
      <div class="tecNome">
      <p class="destaque">${projeto?.tecnico?.nome || 'N/A'}</p>
      </div>
      <div class="tecTit">
      <p class="destaque">${projeto?.tecnico?.tipoProfissional === "eng" ? 'ENGENHEIRO(A) ELETRICISTA' : "ELETROTÉCNICO"}</p>
      </div>
      <div class="tecRegist">
      <p class="destaque">${projeto?.tecnico?.registro || 'N/A'}</p>
      </div>
      <div class="tecUF">
      <p class="destaque">${projeto?.tecnico?.uf || 'N/A'}</p>
      </div>
      <div class="tecEmail">
      <span class="destaque">${projeto?.tecnico?.email || 'N/A'}</span>
      </div>
      <div class="tecCel">
      <p class="destaque">${projeto?.tecnico?.fone || 'N/A'}</p>
      </div>
      <div class="tecEndereco">
      <p class="destaque">${projeto?.tecnico?.logradouro || 'N/A'}</p>
      </div>
      <div class="tecBairro">
      <p class="destaque">${projeto?.tecnico?.bairro || 'N/A'}</p>
      </div>
      <div class="tecCidade">
      <p class="destaque">${projeto?.tecnico?.cidade || 'N/A'}</p>
      </div>
      <div class="tecUFEnd">
      <p class="destaque">${projeto?.tecnico?.uf || 'N/A'}</p>
      </div>
      <div class="tecCEP">
      <p class="destaque">${projeto?.tecnico?.cep || 'N/A'}</p>
      </div>
      <div class="tipoFont">
      <p class="destaque">SOLAR FOTOVOLTAICA</p>
      </div>
      <div class="tipoGeracao">
      <span class="destaque">${acesso?.tipoGeracao || 'N/A'}</span>
      </div>  
      <div class="modalidade">
      <p class="destaque">${acesso?.enquadramentoGeracao || 'N/A'}</p>
      </div>
      <div class="infoModalidade">
      <p class="destaque">${acesso?.tipoConexao === "AUTOCONSUMO LOCAL" ? 'NÃO É NECESSÁRIO PREENCHER A LISTA DE RATEIO' : "PREENCHER LISTA DE RATEIO DE CLIENTES NA GUIA 2 (OPCIONAL)"}</p>
      </div>
      <div class="potGerOrcamento">
      <p class="destaque">${formatPotencia(projeto?.potenciaInversor)}</p>
      </div>
      <div class="potGerTotal">
      <p class="destaque">${formatPotencia(projeto?.potenciaInversor)}</p>
      </div>   
      <div class="potMaxInjetavel">
      <p class="destaque">${formatPotencia(projeto?.potenciaInversor)}</p>
      </div>
      <div class="modalidade7-5">
      <span class="destaque">${verificarCriterioGeracao(acesso?.enquadramentoGeracao, projeto?.potenciaGerador)}</span>
      </div>
      <div class="cidadeAssinatura">
      <span class="destaque">${acesso.client?.cidade}, ${acesso.client?.uf}</span>
      </div>   
      <div class="dataAssinatura">
      <p class="destaque">${formatDataAtual()}</p>
      </div>  
      </div>
      
      <!-- Segunda Página -->
      <div class="page-break"></div>
      <div class="quadrado-page2">     
        <!-- Aqui você pode adicionar novos elementos para a segunda página -->
      <div class="ptcModulo">
      <p class="destaque">${modulo?.potenciaNominal ? `${modulo.potenciaNominal}` : 'N/A'}</p>
      </div>
      <div class="qtdModulo">
      <p class="destaque">${(() => {
        if (kits.length > 0) {
          const totalQtd = kits.reduce((total, kit) => total + Number(kit.qtd), 0);
          return totalQtd;
        }
        return 'N/A';
      })()}</p>
      </div>
      <div class="ptcTotalModulo">
      <p class="destaque">${(() => {
        if (modulo?.potenciaNominal && kits.length > 0) {
          const totalQtd = kits.reduce((total, kit) => total + Number(kit.qtd), 0);
          const totalPotencia = Number(modulo.potenciaNominal) * totalQtd;
          return `${totalPotencia}`;
        }
        return 'N/A';
      })()}</p>
      </div>
      <div class="areaModulo">
      <p class="destaque">${(() => {
        if (modulo?.area && kits.length > 0) {
          const totalQtd = kits.reduce((total, kit) => total + Number(kit.qtd), 0);
          const areaTotal = Number(modulo.area) * totalQtd;
          return `${areaTotal.toFixed(2).replace('.', ',')}`;
        }
        return 'N/A';
      })()}</p>
      </div>
      <div class="fabModulo">
      <p class="destaque">${modulo?.fabricante || 'N/A'}</p>
      </div>
      <div class="modelModulo">
      <p class="destaque">${modulo?.modelo || 'N/A'}</p>
      </div>
      <div class="fabInversor">
      <p class="destaque">${inversor?.fabricante || 'N/A'}</p>
      </div>
      <div class="modelInversor">
      <p class="destaque">${inversor?.modelo || 'N/A'}</p>
      </div>
      <div class="potInversor">
      <p class="destaque">${inversor?.potenciaNomSai ? `${Number(inversor.potenciaNomSai).toFixed(2).replace('.', ',')}` : 'N/A'}</p>
      </div>
      <div class="tensaoInversor">
      <p class="destaque">${inversor?.tensaoNomSai || 'N/A'}</p>
      </div>
      <div class="faixaOpInversor">
      <p class="destaque">${inversor?.tensaoInic || 'N/A'} - ${inversor?.tensaoMaxEnt || 'N/A'}</p>
      </div>
      <div class="corrNomInversor">
      <p class="destaque">${inversor?.correnteNomSai || 'N/A'}</p>
      </div>
      <div class="fatorPotencia">
      <p class="destaque">${inversor?.fatorPotencia ? Number(inversor.fatorPotencia).toFixed(2).replace('.', ',') : 'N/A'}</p>
      </div>
      <div class="eficiencia">
      <p class="destaque">${inversor?.eficiencia ? `${Number(inversor.eficiencia).toFixed(2).replace('.', ',')}%` : 'N/A'}</p>
      </div>
      <div class="dht">
      <p class="destaque">${inversor?.THD || 'N/A'}</p>
      </div>
        <!-- fim da página 2 -->
        </div>
      <div class="page-break"></div>   
      <!-- Terceira Página -->
      <div class="quadrado-page3">     
        <!-- Aqui você pode adicionar novos elementos para a terceira página -->
        <div class="ccUC">
        <p class="destaque">${acesso.contractNumber}</p>
        </div>
        <div class="enquadRateio">
        <p class="destaque">${acesso.enquadramentoGeracao}</p>
        </div>
        <div class="alocacaoCredito">
        <p class="destaque">${acesso.alocacaoCredito}</p>
        </div>
        <div class="infoRateio">
        <p class="destaque">Não preencher as porcentagens, será considerada a ordem</p>
        </div>
        <div class="cc1">
        <p class="destaque">${acesso.contractNumber}</p>
        </div>
        <div class="classeConsumo1">
        
        </>
        <div class="endRateio1">
        <p>${acesso.client?.rua}, ${acesso.client?.numero}, ${acesso.client?.bairro} | ${acesso.client?.complemento}</p>
        </div>
        
      </div>
      </body>
      </html>
    `

    // Gerar PDF com Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0cm',
        right: '0cm',
        bottom: '0cm',
        left: '0cm'
      }
    })

    await browser.close()

    // Retornar o PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="solicitacao-acesso-${acesso.numProjeto}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar PDF' },
      { status: 500 }
    )
  }
}