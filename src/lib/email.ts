import { Resend } from 'resend';

// Inicializa o cliente Resend com a API key do ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um e-mail com código de verificação para redefinição de senha
 * @param email Email do destinatário
 * @param code Código de verificação de 6 dígitos
 * @returns Resultado do envio do e-mail
 */
export async function sendPasswordResetEmail(email: string, code: string) {
  try {
    console.log('📧 Iniciando envio de e-mail de redefinição de senha:');
    console.log(`📧 Destinatário: ${email}`);
    console.log(`📧 Código de verificação: ${code}`);
    
    // Verifica se o código tem 6 dígitos
    if (!/^\d{6}$/.test(code)) {
      console.error('❌ Erro de validação: O código de verificação deve ter 6 dígitos');
      throw new Error('O código de verificação deve ter 6 dígitos');
    }

    console.log('📧 Preparando envio via Resend API...');
    const { data, error } = await resend.emails.send({
      from: 'AuxSol Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Código de Verificação para Redefinição de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Redefinição de Senha</h2>
          <p>Olá,</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para confirmar:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Este código expirará em 1 hora.</p>
          <p>Se você não solicitou a redefinição de senha, por favor ignore este e-mail.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
            © ${new Date().getFullYear()} AuxSol. Todos os direitos reservados.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Erro ao enviar e-mail:', error);
      console.error(`❌ Detalhes do erro: ${JSON.stringify(error)}`);
      throw new Error(`Falha ao enviar e-mail: ${error.message}`);
    }

    console.log('✅ E-mail enviado com sucesso!');
    console.log(`✅ ID do e-mail: ${data?.id || 'N/A'}`);
    console.log(`✅ Dados completos: ${JSON.stringify(data)}`);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mail de redefinição de senha:');
    console.error(`❌ Mensagem: ${error.message || 'Erro desconhecido'}`);
    console.error(`❌ Destinatário: ${email}`);
    console.error(`❌ Detalhes completos: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    return { success: false, error };
  }
}