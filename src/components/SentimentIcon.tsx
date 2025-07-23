import React from 'react';
import { SvgIconComponent } from '@mui/icons-material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WavesIcon from '@mui/icons-material/Waves';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import Battery3BarIcon from '@mui/icons-material/Battery3Bar';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface SentimentIconProps {
  sentimentId: number;
  size?: number;
}

const SentimentIcon: React.FC<SentimentIconProps> = ({ sentimentId, size = 24 }) => {
  const iconMap: { [key: number]: SvgIconComponent } = {
    13: WbSunnyOutlinedIcon,      // Feliz / Alegre
    14: WaterDropOutlinedIcon,    // Triste / Melancólico(a)
    15: WavesIcon,                // Calmo(a) / Relaxado(a)
    16: MonitorHeartIcon,         // Ansioso(a) / Nervoso(a)
    17: FlashOnOutlinedIcon,      // Animado(a) / Entusiasmado(a)
    18: Battery3BarIcon,          // Cansado(a) / Desmotivado(a)
  };

  const IconComponent = iconMap[sentimentId] || HelpOutlineIcon;

  return <IconComponent sx={{ fontSize: size, mb: 1 }} />;
};

export default SentimentIcon;
