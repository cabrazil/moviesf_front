import React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
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
    
    // Manter - ícone de escudo/proteção (substituindo ⚖️)
    // Representa proteção e preservação do estado emocional atual
    'MAINTAIN': ShieldOutlinedIcon,        
    
    // Explorar - ícone de lâmpada/insight (substituindo 🔍)
    // Representa descoberta e compreensão de nuances emocionais
    'EXPLORE': LightbulbOutlinedIcon,         
  };

  const IconComponent = iconMap[intentionType] || HelpOutlineIcon;

  return <IconComponent sx={{ fontSize: size, mb: 1 }} />;
};

export default IntentionIcon; 