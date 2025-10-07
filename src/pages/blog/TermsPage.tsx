import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

// Estilos do fundo animado (mesmo padrão das páginas do blog)
const styles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Injetar estilos no head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function TermsPage() {
  // Garantir scroll para o topo ao carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #011627, #0B2B40, #1B2A41)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 12s ease infinite',
        paddingBottom: '40px'
      }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#E0E0E0', textDecoration: 'none' }}>
              <ArrowLeft size={18} />
              <span>Voltar ao Blog</span>
            </Link>
          </div>

          {/* Header */}
          <header style={{ marginBottom: '28px' }}>
            <h1 style={{ color: '#FDFFFC', fontSize: '2rem', margin: 0, letterSpacing: '0.3px' }}>
              Termos de Uso
            </h1>
            <p style={{ color: '#B6C8D6', marginTop: '8px' }}>
              Termos e condições de uso do Vibesfilm.
            </p>
          </header>

          {/* Content Card */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '22px',
            color: '#E0E0E0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
          }}>
            <section style={{ marginBottom: '18px' }}>
              <p style={{ margin: '0 0 16px 0' }}>
                Bem-vindo ao <strong>vibesfilm.com</strong>! Ao acessar ou usar nosso site, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso e Condições.
              </p>
              <p style={{ margin: 0 }}>
                Caso não concorde com qualquer parte deste acordo, solicitamos que não utilize o site.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>1. Aceitação dos Termos</h2>
              <p style={{ margin: 0 }}>
                O uso do site <strong>vibesfilm.com</strong> está sujeito a estes Termos de Uso, que podem ser atualizados periodicamente sem aviso prévio. Você deve revisar regularmente esta página para estar ciente das alterações.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>2. Descrição do Serviço</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> é uma plataforma de curadoria cinematográfica que conecta pessoas com filmes baseados em suas emoções e estados de espírito.
              </p>
              <p style={{ margin: 0 }}>
                O site fornece conteúdo de maneira gratuita, incluindo recomendações personalizadas, artigos sobre cinema e análises emocionais de filmes.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>3. Uso do Site</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Você se compromete a utilizar o site de acordo com a legislação vigente, de maneira ética, respeitosa e sem prejudicar o funcionamento do site ou a experiência de outros usuários.
              </p>
              <p style={{ margin: 0 }}>
                Você é responsável por manter a confidencialidade de sua conta (caso crie uma) e pela segurança de sua senha, sendo responsável por todas as atividades realizadas em sua conta.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>4. Propriedade Intelectual</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Todo o conteúdo disponível no <strong>vibesfilm.com</strong>, incluindo, mas não se limitando a, textos, imagens, gráficos, logotipos, vídeos, e marcas registradas, são de propriedade do Vibesfilm ou de seus licenciadores e são protegidos por leis de direitos autorais e propriedade intelectual.
              </p>
              <p style={{ margin: 0 }}>
                Você não pode copiar, reproduzir, distribuir ou criar trabalhos derivados de qualquer conteúdo do site sem a devida permissão expressa do Vibesfilm.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>5. Responsabilidade do Usuário</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O usuário se compromete a não usar o site para fins ilícitos ou proibidos, incluindo, mas não se limitando a, violação de direitos de propriedade intelectual, difamação, disseminação de vírus ou outros conteúdos prejudiciais.
              </p>
              <p style={{ margin: 0 }}>
                O <strong>vibesfilm.com</strong> não se responsabiliza por danos diretos, indiretos, incidentais, consequenciais ou punitivos que possam resultar do uso ou da incapacidade de uso do site.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>6. Links para Terceiros</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> pode conter links para sites de terceiros, incluindo serviços de streaming, plataformas de filmes e outros recursos relacionados ao cinema. Esses links são fornecidos para conveniência dos usuários e não implicam endosso ou responsabilidade por parte do Vibesfilm.
              </p>
              <p style={{ margin: 0 }}>
                Ao acessar links para sites de terceiros, você está sujeito às políticas e termos de uso desses sites.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>7. Publicidade e Anúncios</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> pode exibir anúncios de terceiros, incluindo anúncios do Google AdSense. Esses anúncios são selecionados automaticamente e podem ser baseados em suas preferências e histórico de navegação.
              </p>
              <p style={{ margin: 0 }}>
                Não nos responsabilizamos pelo conteúdo, produtos ou serviços oferecidos pelos anunciantes. Qualquer transação realizada com anunciantes é de sua responsabilidade.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>8. Privacidade e Proteção de Dados</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                A sua privacidade é importante para nós. Consulte nossa <a href="/privacidade" style={{ color: '#2EC4B6' }}>Política de Privacidade</a> para obter informações sobre como coletamos, usamos e protegemos seus dados pessoais.
              </p>
              <p style={{ margin: 0 }}>
                Ao utilizar nosso site, você consente com o uso das informações conforme descrito em nossa Política de Privacidade.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>9. Modificações no Site</h2>
              <p style={{ margin: 0 }}>
                O <strong>vibesfilm.com</strong> reserva-se o direito de modificar ou descontinuar, temporária ou permanentemente, qualquer parte do site, com ou sem aviso prévio, e não será responsável por quaisquer danos decorrentes dessas modificações.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>10. Limitação de Responsabilidade</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> se esforça para fornecer informações precisas e atualizadas, mas não garante que todo o conteúdo seja isento de erros ou omissões.
              </p>
              <p style={{ margin: 0 }}>
                O Vibesfilm não será responsável por qualquer tipo de dano que possa surgir devido ao uso indevido ou interpretação incorreta das informações contidas no site.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>11. Conteúdo Gerado por Usuários</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Os usuários podem interagir com o conteúdo do site, incluindo a postagem de comentários, avaliações e outros conteúdos. O Vibesfilm reserva-se o direito de moderar, editar ou remover qualquer conteúdo considerado inadequado, ofensivo ou em desacordo com estes Termos de Uso.
              </p>
              <p style={{ margin: 0 }}>
                O usuário concede ao Vibesfilm uma licença irrevogável, não exclusiva e sem royalties para utilizar, exibir e modificar qualquer conteúdo gerado por ele, conforme necessário, para fins de operação do site.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>12. Foro e Legislação Aplicável</h2>
              <p style={{ margin: 0 }}>
                Estes Termos de Uso serão regidos e interpretados de acordo com as leis brasileiras.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>13. Disposições Finais</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Se qualquer disposição destes Termos de Uso for considerada inválida ou inexequível, as disposições remanescentes permanecerão em pleno vigor e efeito.
              </p>
              <p style={{ margin: 0 }}>
                O <strong>vibesfilm.com</strong> pode, a seu exclusivo critério, modificar estes Termos de Uso a qualquer momento. A continuação do uso do site após tais modificações implicará na aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>14. Contato</h2>
              <p style={{ margin: '0 0 16px 0' }}>
                Se tiver dúvidas ou precisar de mais informações, entre em contato conosco pelo e-mail: <a href="mailto:contato@vibesfilm.com" style={{ color: '#2EC4B6' }}>contato@vibesfilm.com</a>.
              </p>
              
              <p style={{ 
                color: '#B6C8D6', 
                fontSize: '14px', 
                margin: '16px 0 8px 0',
                fontStyle: 'italic'
              }}>
                Esses Termos de Uso e Condições foram elaborados para proteger tanto o Vibesfilm quanto seus usuários, garantindo uma navegação segura e legal dentro do site.
              </p>
              <p style={{ 
                color: '#B6C8D6', 
                fontSize: '14px', 
                margin: 0
              }}>
                Última atualização: 31 de dezembro de 2024
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
