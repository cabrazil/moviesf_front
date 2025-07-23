import React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface IntentionIconProps {
  intentionType: 'PROCESS' | 'TRANSFORM' | 'MAINTAIN' | 'EXPLORE';
  size?: number;
}

const IntentionIcon: React.FC<IntentionIconProps> = ({ intentionType, size = 24 }) => {
  const iconMap: { [key: string]: SvgIconComponent } = {
    // Processar - ícone de psicologia/mente (substituindo 🧠)
    // Representa a análise e processamento mental das emoções
    'PROCESS': PsychologyOutlinedIcon,      
    
    // Transformar - ícone de renovação/ciclo (substituindo 🔄)
    // Representa mudança e transformação do estado emocional
    'TRANSFORM': AutorenewOutlinedIcon,     
    
    // Manter - ícone de equilíbrio/balança (substituindo ⚖️)
    // Representa estabilidade e preservação do estado atual
    'MAINTAIN': BalanceOutlinedIcon,        
    
    // Explorar - ícone de exploração/bússola (substituindo 🔍)
    // Representa descoberta e exploração de novos sentimentos
    'EXPLORE': ExploreOutlinedIcon,         
  };

  const IconComponent = iconMap[intentionType] || HelpOutlineIcon;

  return <IconComponent sx={{ fontSize: size, mb: 1 }} />;
};

export default IntentionIcon; 