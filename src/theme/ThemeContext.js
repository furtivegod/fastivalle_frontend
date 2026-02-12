import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Fastivalle Festival Theme - Based on Figma designs
  const theme = {
    colors: {
      // Primary - Vibrant Green (used in hero cards, feature sections)
      primary: '#20643B',
      primaryLight: '#AED581',
      primaryDark: '#689F38',
      
      // Accent - Orange/Coral (CTAs, links, highlights)
      accent: '#FF6B35',
      accentLight: '#FF8A5C',
      accentDark: '#E55A2B',
      
      // Forest Green (dark green for overlays, gradients)
      forest: '#2D4739',
      forestLight: '#3D5A4A',
      forestDark: '#1E3328',
      
      // Backgrounds
      background: isDark ? '#121212' : '#F2EFEB',
      backgroundAlt: isDark ? '#1A1A1A' : '#F5F5F0',
      surface: isDark ? '#1E1E1E' : '#FFFFFF',
      surfaceElevated: isDark ? '#2A2A2A' : '#FFFFFF',
      
      // Card backgrounds
      cardBackground: isDark ? '#1E1E1E' : '#FFFFFF',
      heroCard: '#8BC34A',
      heroCardGradientStart: '#A8D98A',
      heroCardGradientEnd: '#7CB663',
      
      // Support/Feature section (lime green)
      supportSection: '#8BC34A',
      supportSectionText: '#FFFFFF',
      
      // Text colors
      text: isDark ? '#FFFFFF' : '#1A1A1A',
      textSecondary: isDark ? '#A0A0A0' : '#666666',
      textMuted: isDark ? '#707070' : '#999999',
      textOnPrimary: '#FFFFFF',
      textOnAccent: '#FFFFFF',
      textLink: '#FF6B35',
      textAction: '#FF6B35',
      
      // Event card specific
      eventDate: '#FF6B35',
      eventAction: '#FF6B35',
      eventTitle: isDark ? '#FFFFFF' : '#1A1A1A',
      
      // Borders
      border: isDark ? '#333333' : '#E8E8E8',
      borderLight: isDark ? '#2A2A2A' : '#F0F0F0',
      
      // Tab bar
      tabBarBackground: isDark ? '#1A1A1A' : '#FFFFFF',
      tabBarActive: '#1A1A1A',
      tabBarInactive: '#999999',
      tabBarBorder: '#E8E8E8',
      
      // Status colors
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      info: '#007AFF',
      soldOut: '#FF6B35',
      
      // Ticket types
      ticketStandard: '#1A1A1A',
      ticketFan: '#FF6B35',
      ticketVIP: '#8BC34A',
      
      // Buttons
      buttonPrimary: '#1A1A1A',
      buttonPrimaryText: '#FFFFFF',
      buttonSecondary: '#FFFFFF',
      buttonSecondaryText: '#1A1A1A',
      buttonSecondaryBorder: '#E8E8E8',
      buttonDisabled: '#CCCCCC',
      
      // Overlays
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(255, 255, 255, 0.95)',
      
      // Heart/favorite icon
      heartActive: '#FF6B35',
      heartInactive: '#CCCCCC',
      
      // Toggle/Segment control
      segmentActive: '#1A1A1A',
      segmentActiveText: '#FFFFFF',
      segmentInactive: 'transparent',
      segmentInactiveText: '#1A1A1A',
      segmentBorder: '#E8E8E8',
    },
    
    // Gradient definitions (for use with LinearGradient or layered views)
    gradients: {
      heroCard: ['#A8D98A', '#8BC34A', '#7CB663'],
      greenFeature: ['#AED581', '#8BC34A'],
      greenDark: ['#8BC34A', '#2D4739'],
      orange: ['#FF8A5C', '#FF6B35'],
      warmOverlay: ['rgba(255, 107, 53, 0.2)', 'rgba(255, 183, 77, 0.1)'],
    },
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      xxl: 24,
      round: 9999,
    },
    
    typography: {
      // Large titles
      h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40, letterSpacing: -0.5 },
      h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32, letterSpacing: -0.3 },
      h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
      h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
      
      // Body text
      body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
      bodyMedium: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
      bodyBold: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
      
      // Smaller text
      caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
      captionMedium: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
      small: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
      smallMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
      tiny: { fontSize: 10, fontWeight: '400', lineHeight: 14 },
      
      // Special
      button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
      buttonSmall: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
      label: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
      price: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
      priceSmall: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
      eventDate: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    },
    
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
      card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
