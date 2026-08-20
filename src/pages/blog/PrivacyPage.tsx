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

export default function PrivacyPage() {
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
              Política de Privacidade
            </h1>
            <p style={{ color: '#B6C8D6', marginTop: '8px' }}>
              Como coletamos, usamos e protegemos suas informações no vibesfilm.
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
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Introdução</h2>
              <p style={{ margin: 0 }}>
                Esta Política descreve como o <strong>vibesfilm.com</strong> coleta e trata dados pessoais.
                Nosso foco é editorial e de curadoria cinematográfica; coletamos o mínimo necessário para
                melhorar sua experiência de descoberta de filmes.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Dados que coletamos</h2>
              <p style={{ margin: '0 0 8px 0' }}>As informações pessoais que coletamos podem incluir:</p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Dados de navegação (páginas visitadas, tempo de permanência, origem de tráfego)</li>
                <li>E-mail, quando você se inscreve na newsletter</li>
                <li>Mensagens enviadas via formulário de contato</li>
                <li>Preferências de conteúdo e interações com o site</li>
              </ul>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Cookies e Web Beacons</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Utilizamos cookies para armazenar informações como suas preferências pessoais quando visita nosso website.
                Isso pode incluir configurações de interface, preferências de conteúdo ou dados de sessão.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Também utilizamos cookies de análise (como Google Analytics) para entender como os usuários interagem
                com nosso conteúdo, melhorando a experiência de navegação e desempenho da plataforma.
              </p>
              <p style={{ margin: 0 }}>
                Você pode configurar seu navegador para ser avisado sobre a recepção de cookies e impedir sua instalação.
                As instruções estão disponíveis nas configurações de privacidade do seu navegador.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Google AdSense e Publicidade de Terceiros</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> utiliza o <strong>Google AdSense</strong> e outros serviços de publicidade de terceiros para veicular anúncios quando você visita nosso website.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Como o Google e parceiros utilizam cookies:</strong>
              </p>
              <ul style={{ margin: '0 0 8px 0', paddingLeft: '18px' }}>
                <li>Fornecedores terceiros, incluindo o <strong>Google</strong>, utilizam cookies (como o cookie DoubleClick / DART) para veicular anúncios com base em visitas anteriores do usuário a este ou a outros websites na internet.</li>
                <li>Com o uso de cookies de publicidade, o Google e seus parceiros podem veicular anúncios personalizados para você com base nas suas visitas a este site e/ou a outros sites na Web.</li>
                <li>Outras redes de publicidade e fornecedores parceiros certificados pelo Google também podem utilizar cookies e web beacons para medir a eficácia das campanhas e personalizar anúncios.</li>
              </ul>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Como desativar a personalização de anúncios:</strong>
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Você pode optar por desativar a publicidade personalizada a qualquer momento acessando as{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>Configurações de Anúncios do Google</a>.
                Como alternativa, você pode visitar o portal{' '}
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>www.aboutads.info</a>{' '}
                para desativar o uso de cookies de publicidade personalizada de fornecedores terceiros.
              </p>
              <p style={{ margin: 0 }}>
                Para mais informações sobre como o Google gerencia e processa dados em seus produtos de publicidade, acesse{' '}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>
                  Como o Google usa dados quando você usa sites ou aplicativos de nossos parceiros
                </a>.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Links para Sites Terceiros</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> possui links para outros sites que podem conter informações úteis
                para nossos visitantes (incluindo plataformas oficiais de streaming e serviços de catálogo). Nossa política de privacidade não se aplica a sites de terceiros.
              </p>
              <p style={{ margin: 0 }}>
                Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses sites externos.
                Recomendamos ler a política de privacidade de cada site que visitar.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Analytics e Estatísticas de Uso</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Utilizamos o Google Analytics e ferramentas similares para analisar anonimamente o tráfego e o uso do site, permitindo aprimorar a experiência de curadoria e usabilidade.
              </p>
              <p style={{ margin: 0 }}>
                Essas ferramentas coletam dados agregados e anônimos sobre padrões de navegação e páginas mais acessadas.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Como usamos seus dados</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Melhorar a experiência de navegação e relevância do conteúdo editorial</li>
                <li>Comunicar novidades e atualizações da plataforma (quando você opta por receber)</li>
                <li>Responder mensagens enviadas via formulário de contato ou e-mail</li>
                <li>Analisar tendências de uso para aprimorar o sistema de curadoria emocional</li>
                <li>Personalizar recomendações de filmes e jornadas</li>
              </ul>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Newsletter</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Quando você se inscreve em nossa newsletter, coletamos e armazenamos seu endereço de email
                para enviar comunicações relacionadas ao conteúdo do VibesFilm.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Finalidade do armazenamento:</strong> Utilizamos seu email exclusivamente para enviar
                artigos, análises e conteúdo sobre cinema e emoções. Os envios iniciarão em breve, assim que
                tivermos conteúdo suficiente para compartilhar.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Prazo de retenção:</strong> Mantemos seu email em nossa base enquanto você permanecer
                inscrito. Você pode solicitar a exclusão a qualquer momento.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Seus direitos:</strong> Você pode descadastrar-se da newsletter a qualquer momento
                entrando em contato conosco em <a href="mailto:contato@vibesfilm.com" style={{ color: '#3B82F6' }}>contato@vibesfilm.com</a> ou através do link de descadastro que será incluído em cada email enviado.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Dados adicionais:</strong> Podemos armazenar informações técnicas como endereço IP e
                navegador utilizado no momento da inscrição para fins de segurança e conformidade com a LGPD.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Compartilhamento de Dados</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Não vendemos nem comercializamos seus dados pessoais. Compartilhamos apenas com:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Provedores de serviços essenciais de infraestrutura (hospedagem em nuvem, ferramentas de análise)</li>
                <li>Parceiros de publicidade homologados (como o Google AdSense, mediante consentimento)</li>
                <li>Autoridades competentes quando estritamente exigido por determinação legal ou regulatória</li>
              </ul>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Seus Direitos e Encarregado de Dados (LGPD)</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), você tem o direito de:
              </p>
              <ul style={{ margin: '0 0 8px 0', paddingLeft: '18px' }}>
                <li>Confirmar a existência de tratamento e acessar seus dados pessoais</li>
                <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Revogar seu consentimento a qualquer momento</li>
                <li>Solicitar a portabilidade dos dados</li>
              </ul>
              <p style={{ margin: 0 }}>
                Para exercer qualquer um desses direitos ou esclarecer dúvidas sobre o tratamento de seus dados, contate nosso Encarregado de Proteção de Dados / Curador Editorial pelo e-mail: <a href="mailto:contato@vibesfilm.com" style={{ color: '#3B82F6' }}>contato@vibesfilm.com</a>.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Segurança dos Dados</h2>
              <p style={{ margin: 0 }}>
                Implementamos medidas de segurança técnicas e organizacionais adequadas (incluindo tráfego criptografado via HTTPS/SSL) para proteger seus dados contra acessos não autorizados, perdas ou incidentes.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Uso no Aplicativo Móvel</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Esta Política de Privacidade também se aplica ao aplicativo móvel VibesFilm.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Atualmente, o aplicativo não coleta, armazena ou compartilha dados pessoais sensíveis do usuário, nem realiza rastreamento invasivo de uso.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                O aplicativo processa exclusivamente informações técnicas temporárias necessárias para a busca de recomendações cinematográficas e conexão com nossos servidores seguros.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Fontes de Dados e Atribuição</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Este produto utiliza a API do The Movie Database (TMDB) para metadados e imagens, mas não é endossado ou certificado pelo TMDB.
              </p>
              <p style={{ margin: 0 }}>
                O VibesFilm atua exclusivamente como uma ferramenta de curadoria editorial e recomendação, não hospedando nem transmitindo reproduções audiovisuais.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Atualizações desta Política</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Esta política pode ser revisada periodicamente para refletir melhorias no projeto ou atualizações regulatórias.
              </p>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem' }}>
                <em>Última atualização: 20 de Agosto de 2026.</em>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


