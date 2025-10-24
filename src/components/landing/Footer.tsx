import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, Instagram, Twitter, Facebook, Github } from 'lucide-react';
import logoBlog from '../../assets/logo_header.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black bg-opacity-50 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src={logoBlog} 
                alt="VibesFilm Logo"
                className="h-8 w-auto max-w-32 object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Descubra filmes que ressoam com seus sentimentos. 
              Transforme sua experiência cinematográfica através de jornadas emocionais personalizadas.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Baixar App
            </Link>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/filmes" className="text-gray-400 hover:text-white transition-colors">
                  Filmes
                </Link>
              </li>
              <li>
                <Link to="/sentimentos" className="text-gray-400 hover:text-white transition-colors">
                  Sentimentos
                </Link>
              </li>
              <li>
                <Link to="/jornadas" className="text-gray-400 hover:text-white transition-colors">
                  Jornadas
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Conecte-se</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail className="w-4 h-4" />
              <span>contato@emofilms.com</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 vibesfilm. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacidade" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-gray-400 hover:text-white text-sm transition-colors">
              Termos de Serviço
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
