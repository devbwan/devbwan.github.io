import React from 'react';
import { StyleSheet } from 'react-native';

// lucide-react-native를 사용하되, 없으면 @expo/vector-icons로 대체
// Icon 컴포넌트는 Figma 디자인에 맞게 size=22, strokeWidth=2.4 고정

interface IconProps {
  name: string; // lucide icon name
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  style?: any;
}

export function Icon({ 
  name, 
  size = 22, 
  strokeWidth = 2.4, 
  color = '#FFFFFF',
  fill,
  style 
}: IconProps) {
  // lucide-react-native가 설치되면 사용, 아니면 MaterialCommunityIcons로 대체
  // 실제 구현은 lucide-react-native 사용 시 수정 필요
  const { MaterialCommunityIcons } = require('@expo/vector-icons');
  
  // lucide icon name을 MaterialCommunityIcons name으로 매핑
  const iconMap: Record<string, string> = {
    'zap': 'lightning-bolt',
    'clock': 'clock-outline',
    'activity': 'speedometer',
    'map-pin': 'map-marker',
    'award': 'trophy',
    'trophy': 'trophy',
    'trending-up': 'trending-up',
    'home': 'home-variant',
    'run': 'run',
    'users': 'account-group',
    'route': 'map',
    'user': 'account',
    'settings': 'cog-outline',
    'flame': 'fire',
    'target': 'target',
    'calendar': 'calendar-outline',
    'bell': 'bell-outline',
    'lock': 'lock-outline',
    'help-circle': 'help-circle-outline',
    'log-out': 'logout',
    'thumbs-up': 'thumb-up-outline',
    'message-circle': 'message-outline',
    'medal': 'medal-outline',
    'chevron-down': 'chevron-down',
    'lock': 'lock-outline',
    'volume-2': 'volume-high',
    'pause': 'pause',
    'square': 'stop',
    'target': 'target',
    'infinity': 'infinity',
    'headphones': 'headphones',
    'message-circle': 'message-outline',
    'chevron-right': 'chevron-right',
    'play': 'play',
  };

  const iconName = iconMap[name] || name;

  return (
    <MaterialCommunityIcons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
