import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Lightbulb, Brain, Sliders, GitFork, Sparkles } from 'lucide-react';
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
                  margin: '0 0 12px 0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  Sobre o Autor
                </h3>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: isMobile ? '14px' : '15px',
                  lineHeight: '1.6',
                  margin: '0 0 12px 0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  Fundador e curador do Vibesfilm, Carlos construiu sua carreira na área de tecnologia, trabalhando com análise, sistemas e resolução de problemas. Após se retirar da vida corporativa, passou a dedicar parte do seu tempo à união de duas paixões: cinema e tecnologia.
                </p>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: isMobile ? '14px' : '15px',
                  lineHeight: '1.6',
                  margin: 0,
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  O Vibesfilm nasceu da união entre cinema e tecnologia. A partir da análise de centenas de filmes, Carlos desenvolveu uma forma de organizar recomendações pela experiência que cada obra oferece, ajudando pessoas a encontrar o filme certo para o momento que estão vivendo. Seu objetivo é aproximar o cinema das emoções humanas, tornando a escolha de um filme mais significativa e pessoal.
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
              baseadas em um único critério: o gênero. Mas e se a sua real necessidade não for um gênero, mas sim uma emoção?
            </div>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              É exatamente essa a lacuna que o Vibesfilm preenche. Para tornar isso possível, o Vibesfilm organiza
              sentimentos, intenções e experiências emocionais em jornadas cuidadosamente mapeadas. Cada recomendação
              busca responder não apenas ao que você gosta de assistir, mas ao que você precisa sentir, compreender ou vivenciar naquele momento.
            </div>

            <div style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: '1.8',
              color: '#E0E0E0',
              marginBottom: 0
            }}>
              Cada jornada emocional foi construída a partir da análise de centenas de filmes e da identificação
              dos tipos de experiências emocionais que eles oferecem. Em vez de classificar filmes apenas por gênero,
              o Vibesfilm procura compreender como cada obra pode dialogar com diferentes estados emocionais,
              de forma muito mais conectada e significativa.
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
              O Vibesfilm é uma plataforma que recomenda filmes baseado no estado emocional atual do usuário.
              Em vez de você procurar filmes por gênero ou ator, você diz como está se sentindo e o modelo então te guia
              através de uma "jornada emocional" de três etapas:
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
                    O usuário começa escolhendo seu estado de espírito atual, como você está? Defina seu sentimento nesse momento
                    (ex: "Estou Feliz," "Estou Triste," "Estou Ansioso(a)," "Calmo(a)").
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
                    Em seguida, o usuário define o que ele quer fazer com essa emoção. Existem quatro intenções principais:
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

          {/* A Estrutura por Trás da Curadoria */}
          <section id="metodologia" style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h3 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold',
              color: '#FDFFFC',
              textAlign: 'center',
              marginBottom: isMobile ? '12px' : '16px'
            }}>
              A Estrutura por Trás da Curadoria
            </h3>
            <p style={{
              fontSize: isMobile ? '1rem' : '1.125rem',
              color: '#E0E0E0',
              textAlign: 'center',
              marginBottom: isMobile ? '24px' : '32px',
              lineHeight: '1.6'
            }}>
              O Vibesfilm não utiliza apenas algoritmos genéricos ou filtros simples de gênero. Há uma engrenagem dedicada e uma metodologia estruturada projetada para garantir que a indicação realmente ressoe com o seu momento:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* Card 1: Subsentimentos */}
              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain size={20} color="#3B82F6" />
                </div>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#FDFFFC',
                  margin: 0
                }}>
                  Subsentimentos e Nuances Emocionais
                </h4>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Não classificamos os filmes apenas como "alegres" ou "tristes". Nós mapeamos <strong>subsentimentos específicos</strong> (como nostalgia, superação, melancolia acolhedora ou calmaria reflexiva). Isso nos permite entender a real atmosfera de uma obra para conectá-la ao seu estado de espírito exato.
                </p>
              </div>

              {/* Card 2: Cálculo de Relevância */}
              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sliders size={20} color="#3B82F6" />
                </div>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#FDFFFC',
                  margin: 0
                }}>
                  Cálculo de Relevância (Intensidade vs Cobertura)
                </h4>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Utilizamos um modelo de pontuação próprio que cruza a <strong>Intensidade</strong> da emoção no filme com a sua <strong>Cobertura</strong> (o quanto desse sentimento está presente ao longo da narrativa). Dessa forma, separamos filmes que apenas tocam em um tema daqueles que verdadeiramente imergem o espectador nele.
                </p>
              </div>

              {/* Card 3: Jornadas de Transição */}
              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GitFork size={20} color="#3B82F6" />
                </div>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#FDFFFC',
                  margin: 0
                }}>
                  Jornadas de Transição
                </h4>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Reconhecemos que as emoções são dinâmicas. Nosso sistema é desenhado para ajudar você em quatro direções: <strong>Manter</strong> sua vibe atual, <strong>Processar</strong> uma emoção complexa, <strong>Transformar</strong> seu humor para um estado melhor, ou simplesmente <strong>Explorar</strong> novas sensações com segurança artística.
                </p>
              </div>

              {/* Card 4: Curadoria Assistida e Validação Humana */}
              <div style={{
                backgroundColor: 'rgba(2, 44, 73, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={20} color="#3B82F6" />
                </div>
                <h4 style={{
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  color: '#FDFFFC',
                  margin: 0
                }}>
                  Sensibilidade Humana com Rigor de Dados
                </h4>
                <p style={{
                  color: '#E0E0E0',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Nenhuma indicação é feita ao acaso por um algoritmo sem alma. Embora utilizemos uma estrutura analítica de dados e inteligência artificial para mapear os sentimentos, cada indicação passa por uma <strong>validação e curadoria fina manual</strong>. É a fusão da engenharia de dados com a paixão real pelo cinema.
                </p>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{
              backgroundColor: 'rgba(2, 44, 73, 0.3)',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 'bold',
                color: '#FDFFFC',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                A Alma do Projeto
              </h3>
              <p style={{
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                lineHeight: '1.8',
                color: '#E0E0E0',
                maxWidth: '800px',
                margin: '0 auto 20px auto',
                fontWeight: '300'
              }}>
                "Acreditamos que as pessoas raramente procuram apenas um filme. Elas procuram companhia, compreensão, inspiração, conforto, reflexão ou até mesmo um espaço seguro para sentir aquilo que estão vivendo."
              </p>
              <p style={{
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                lineHeight: '1.8',
                color: '#3B82F6',
                maxWidth: '800px',
                margin: '0 auto 20px auto',
                fontWeight: '500'
              }}>
                Por isso, o Vibesfilm não começa perguntando quais gêneros você gosta. Ele começa perguntando como você está.
              </p>
              <p style={{
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                lineHeight: '1.8',
                color: '#E0E0E0',
                maxWidth: '800px',
                margin: '0 auto',
                fontWeight: '300',
                fontStyle: 'italic'
              }}>
                "Porque o filme certo nem sempre é o mais popular, o mais premiado ou o mais recomendado. Muitas vezes, é simplesmente aquele que conversa com você no momento certo."
              </p>
            </div>
          </section>
          {/* TMDB Attribution */}
          <section style={{ marginTop: isMobile ? '32px' : '48px', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              opacity: 0.8
            }}>
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                alt="Powered by TMDB" 
                style={{ height: '20px' }}
              />
              <p style={{
                color: '#E0E0E0',
                fontSize: '0.85rem',
                margin: 0,
                maxWidth: '600px',
                lineHeight: '1.5'
              }}>
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
