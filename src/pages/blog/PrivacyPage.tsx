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
                com nosso conteúdo, melhorando a experiência de navegação.
              </p>
              <p style={{ margin: 0 }}>
                Você pode configurar seu navegador para ser avisado sobre a recepção de cookies e impedir sua instalação. 
                As instruções estão disponíveis nas configurações do seu navegador.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Anúncios e Publicidade</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> pode utilizar serviços de publicidade de terceiros para exibir anúncios. 
                Esses serviços podem usar cookies e web beacons para personalizar anúncios baseados em suas visitas 
                a este e outros websites.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                Você pode desativar a publicidade personalizada acessando as 
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}> Configurações de anúncios do Google </a> 
                ou visitando <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>www.aboutads.info </a> 
                para desativar cookies de publicidade de terceiros.
              </p>
              <p style={{ margin: 0 }}>
                Não nos responsabilizamos pelo conteúdo, promessas ou veracidade das informações dos anúncios exibidos 
                por terceiros. Toda responsabilidade pelos anúncios é dos anunciantes.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Links para Sites Terceiros</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                O <strong>vibesfilm.com</strong> possui links para outros sites que podem conter informações úteis 
                para nossos visitantes. Nossa política de privacidade não se aplica a sites de terceiros.
              </p>
              <p style={{ margin: 0 }}>
                Não nos responsabilizamos pela política de privacidade ou conteúdo presente nesses sites. 
                Recomendamos ler a política de privacidade de cada site que visitar.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Analytics e Remarketing</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Utilizamos Google Analytics e serviços similares para analisar o uso do site e melhorar a experiência. 
                Esses serviços podem usar cookies para coletar informações sobre suas visitas.
              </p>
              <p style={{ margin: 0 }}>
                Para mais informações sobre como o Google gerencia dados em seus produtos de anúncios, 
                acesse <a href="https://www.google.com/policies/technologies/partner-sites/" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>este link</a>.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Como usamos seus dados</h2>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Melhorar a experiência de navegação e relevância do conteúdo</li>
                <li>Comunicar novidades e atualizações (quando você opta por receber)</li>
                <li>Responder suas mensagens enviadas via contato</li>
                <li>Analisar tendências de uso para aprimorar o site</li>
                <li>Personalizar recomendações de conteúdo</li>
              </ul>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Compartilhamento de Dados</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Não vendemos seus dados pessoais. Compartilhamos apenas com:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Provedores de serviços necessários (hospedagem, analytics)</li>
                <li>Parceiros de publicidade (quando você consente)</li>
                <li>Autoridades competentes (quando exigido por lei)</li>
              </ul>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Seus Direitos</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Você tem o direito de:
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px' }}>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de seus dados</li>
                <li>Retirar consentimento a qualquer momento</li>
                <li>Portabilidade de dados</li>
              </ul>
              <p style={{ margin: '8px 0 0 0' }}>
                Para exercer esses direitos, contate-nos em <a href="mailto:contato@vibesfilm.com" style={{ color: '#3B82F6' }}>contato@vibesfilm.com</a>.
              </p>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Segurança dos Dados</h2>
              <p style={{ margin: 0 }}>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados 
                contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#FDFFFC', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Atualizações desta Política</h2>
              <p style={{ margin: '0 0 8px 0' }}>
                Podemos atualizar esta Política periodicamente para refletir mudanças em nossas práticas 
                ou requisitos legais. Recomendamos revisar regularmente.
              </p>
              <p style={{ margin: 0 }}>
                O uso do <strong>vibesfilm.com</strong> pressupõe a aceitação desta política. 
                Reservamo-nos o direito de alterar este acordo sem aviso prévio.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


