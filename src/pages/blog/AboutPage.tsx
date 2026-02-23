import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

// Adicionar estilos CSS para a animação
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

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Hash scrolling ou topo
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Pequeno delay para garantir o render
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #011627 0%, #022c49 50%, #011627 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite'
      }}>
        {/* Back Button */}
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: isMobile ? '16px 16px 0' : '32px 40px 0'
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#E0E0E0',
              textDecoration: 'none',
              marginBottom: '32px',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#3B82F6'}
            onMouseOut={(e) => e.currentTarget.style.color = '#E0E0E0'}
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Blog</span>
          </Link>
        </div>

        {/* Header */}
        <header style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: isMobile ? '0 16px 24px' : '0 40px 24px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            {/* Category Badge */}
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: '500',
              borderRadius: '9999px',
              backgroundColor: 'rgba(46, 196, 182, 0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(46, 196, 182, 0.2)',
              marginBottom: '16px'
            }}>
              Sobre o Projeto
            </span>

            {/* Title */}
            <h1 style={{
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 'bold',
              color: '#FDFFFC',
              marginBottom: isMobile ? '12px' : '16px',
              lineHeight: '1.2'
            }}>
              Vibesfilm
            </h1>

            <h2 style={{
              fontSize: isMobile ? '1.25rem' : '1.5rem',
              color: '#E0E0E0',
              fontWeight: '400',
              marginBottom: isMobile ? '24px' : '32px',
              lineHeight: '1.4'
            }}>
              Encontre o filme perfeito para sua vibe!
            </h2>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: isMobile ? '0 16px 32px' : '0 40px 48px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}>
          {/* Founder Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '32px',
            color: '#E0E0E0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            marginBottom: isMobile ? '16px' : '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '16px' : '24px',
              flexWrap: 'wrap',
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              {/* Foto do fundador */}
              <div style={{
                flex: '0 0 120px',
                minWidth: '120px',
                alignSelf: isMobile ? 'center' : 'flex-start'
              }}>
                <img
                  src="/images/blog/carlos_brasil_silva.jpg"
                  alt="Carlos B Silva - Fundador do Vibesfilm"
                  style={{
                    width: isMobile ? '100px' : '120px',
                    height: isMobile ? '100px' : '120px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #3B82F6',
                    boxShadow: '0 4px 12px rgba(46, 196, 182, 0.3)'
                  }}
                />
              </div>

              {/* Texto sobre o fundador */}
              <div style={{ flex: 1, minWidth: isMobile ? '200px' : '300px' }}>
                <h3 style={{
                  color: '#FDFFFC',
                  fontSize: isMobile ? '18px' : '20px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  Sobre Carlos B Silva
                </h3>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: isMobile ? '14px' : '16px',
                  lineHeight: '1.6',
                  margin: 0,
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  Fundador e curador do Vibesfilm. Apaixonado por cinema e pela forma como a tecnologia pode nos ajudar a entender as emoções que os filmes despertam. Carlos acredita que existe um filme perfeito para cada sentimento e dedica-se a construir as pontes entre a arte cinematográfica e a experiência humana.
                </p>
              </div>
            </div>
          </div>

          <article id="o-projeto" style={{
            backgroundColor: 'rgba(2, 44, 73, 0.3)',
            borderRadius: '16px',
            padding: isMobile ? '24px' : '48px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Título da seção */}
            <h2 style={{
              color: '#FDFFFC',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '600',
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              O Projeto
            </h2>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              O cinema vai além de espelhar seu estado de espírito: ele pode te ajudar a processar uma emoção,
              transformar seu humor, manter uma boa energia ou explorar novas sensações.
            </div>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              Quantas vezes você já passou mais tempo procurando um filme do que assistindo? A paralisia da
              escolha é real. Rolamos por catálogos infinitos em serviços de streaming, recebendo sugestões
              baseadas em um único critério: o gênero. "Você gostou de Ação? Aqui tem mais ação". Mas e se a
              sua necessidade não for um gênero, mas sim uma emoção?
            </div>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              É exatamente essa a lacuna que o Vibesfilm preenche. Trata-se de uma inovadora plataforma que
              recomenda filmes com base no seu estado emocional atual. A proposta é mais humana e precisa,
              entendendo que o cinema é, antes de tudo, sobre os sentimentos que ele nos provoca. É como ter
              um amigo cinéfilo que sabe exatamente qual filme você precisa assistir baseado no seu humor e no
              que você quer sentir depois.
            </div>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: isMobile ? '24px' : '32px'
            }}>
              O Vibesfilm reconhece que as pessoas gostam de assistir filmes para se emocionar, seja para rir
              ou para chorar. É uma ferramenta que devolve o poder da escolha ao espectador, de uma forma
              muito mais conectada e significativa. Em um mundo de conteúdo infinito, encontrar o filme que
              dialoga com a nossa alma é o verdadeiro luxo. E o Vibesfilm promete ser a bússola para essa descoberta.
            </div>
          </article>

          {/* Features */}
          <section id="como-funciona" style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h3 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold',
              color: '#FDFFFC',
              textAlign: 'center',
              marginBottom: isMobile ? '12px' : '16px'
            }}>
              Como Funciona
            </h3>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              color: '#E0E0E0',
              textAlign: 'center',
              marginBottom: isMobile ? '24px' : '32px',
              lineHeight: '1.6'
            }}>
              O processo de busca no Vibesfilm é estruturado em uma "jornada emocional" de três etapas:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: isMobile ? '12px' : '16px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  borderRadius: '50%',
                  padding: isMobile ? '8px' : '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px'
                }}>
                  <Heart size={isMobile ? 20 : 24} color="#3B82F6" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    fontWeight: '600',
                    color: '#FDFFFC',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    1. Sentimento Base
                  </h4>
                  <p style={{
                    color: '#E0E0E0',
                    margin: 0,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: '1.6',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    O usuário começa escolhendo seu sentimento principal atual (ex: "Estou feliz," "Estou triste," "Estou ansioso," "Calmo(a)"). O sentimento base define o estado inicial do usuário.
                  </p>
                  <p style={{
                    color: '#B0B0B0',
                    margin: 0,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                  }}>
                    Exemplo: O sentimento "Calmo(a)" é associado a palavras-chave como "tranquilidade," "paz" e "serenidade".
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: isMobile ? '12px' : '16px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  borderRadius: '50%',
                  padding: isMobile ? '8px' : '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px'
                }}>
                  <Users size={isMobile ? 20 : 24} color="#3B82F6" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    fontWeight: '600',
                    color: '#FDFFFC',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    2. Intenção
                  </h4>
                  <p style={{
                    color: '#E0E0E0',
                    margin: 0,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: '1.6',
                    marginBottom: isMobile ? '8px' : '12px'
                  }}>
                    Em seguida, o usuário define o que ele quer fazer com essa emoção. Existem quatro intenções emocionais principais:
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: isMobile ? '8px' : '12px'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(46, 196, 182, 0.05)',
                      padding: isMobile ? '6px 10px' : '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(46, 196, 182, 0.1)',
                      color: '#E0E0E0',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      <strong style={{ color: '#3B82F6' }}>Explorar:</strong> Entender as causas ou nuances da emoção.
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(46, 196, 182, 0.05)',
                      padding: isMobile ? '6px 10px' : '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(46, 196, 182, 0.1)',
                      color: '#E0E0E0',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      <strong style={{ color: '#3B82F6' }}>Manter:</strong> Viver essa emoção sem mudá-la.
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(46, 196, 182, 0.05)',
                      padding: isMobile ? '6px 10px' : '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(46, 196, 182, 0.1)',
                      color: '#E0E0E0',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      <strong style={{ color: '#3B82F6' }}>Processar:</strong> Elaborar a emoção de forma ativa.
                    </div>
                    <div style={{
                      backgroundColor: 'rgba(46, 196, 182, 0.05)',
                      padding: isMobile ? '6px 10px' : '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(46, 196, 182, 0.1)',
                      color: '#E0E0E0',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      <strong style={{ color: '#3B82F6' }}>Transformar:</strong> Mudar para um estado emocional diferente.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: isMobile ? '12px' : '16px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  borderRadius: '50%',
                  padding: isMobile ? '8px' : '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isMobile ? '40px' : '48px',
                  height: isMobile ? '40px' : '48px'
                }}>
                  <Lightbulb size={isMobile ? 20 : 24} color="#3B82F6" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    fontWeight: '600',
                    color: '#FDFFFC',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    3. Opções de Filmes
                  </h4>
                  <p style={{
                    color: '#E0E0E0',
                    margin: 0,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: '1.6',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    Cada intenção abre 4 caminhos ou opções específicas de filmes, que representam o destino final da jornada (o tipo de experiência que o usuário busca). É nesta etapa que os filmes são sugeridos.
                  </p>
                  <p style={{
                    color: '#B0B0B0',
                    margin: 0,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                  }}>
                    Exemplo: "Ansioso(a) - Manter" oferece uma imersão total para que o filme absorva a ansiedade do usuário (catarse), desviando o foco da preocupação pessoal para a tensão da trama.
                  </p>
                </div>
              </div>
            </div>
          </section>



          {/* Mission */}
          <section>
            <div style={{
              backgroundColor: 'rgba(2, 44, 73, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FDFFFC',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                Nossa Missão
              </h3>
              <p style={{
                fontSize: '1.125rem',
                lineHeight: '1.8',
                fontStyle: 'italic',
                color: '#E0E0E0',
                margin: 0
              }}>
                "Transformar a experiência de escolha de filmes, conectando pessoas com histórias que
                realmente importam para seus corações e mentes."
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
