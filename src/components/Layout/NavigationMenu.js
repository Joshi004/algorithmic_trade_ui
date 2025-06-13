import { Button, Stack, alpha, useTheme } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { navigationItems } from './config';

const NavigationMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            variant={isActive ? 'contained' : 'text'}
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              px: 2,
              py: 0.75,
              minWidth: 'auto',
              fontWeight: isActive ? 'bold' : 'medium',
              ...(isActive ? {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15)
                }
              } : {
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.5),
                  color: 'text.primary'
                }
              })
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

export default NavigationMenu; 