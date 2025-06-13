import { ChevronRight } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { breadcrumbMap, rootBreadcrumb } from './config';

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumbs from current location
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs = [rootBreadcrumb];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const breadcrumbInfo = breadcrumbMap[segment];
      if (breadcrumbInfo) {
        breadcrumbs.push({
          label: breadcrumbInfo.label,
          path: currentPath,
          icon: breadcrumbInfo.icon
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ color: 'text.secondary', fontSize: 16 }} />}
      sx={{ 
        '& .MuiBreadcrumbs-ol': { 
          alignItems: 'center' 
        }
      }}
    >
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isActive = location.pathname === breadcrumb.path;
        
        return isLast || isActive ? (
          <Box
            key={breadcrumb.path}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: breadcrumb.isRoot ? 'primary.main' : 'text.primary',
              fontWeight: breadcrumb.isRoot ? 'bold' : 'medium'
            }}
          >
            {breadcrumb.icon}
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                fontWeight: breadcrumb.isRoot ? 'bold' : 'medium',
                color: breadcrumb.isRoot ? 'primary.main' : 'text.primary'
              }}
            >
              {breadcrumb.label}
            </Typography>
          </Box>
        ) : (
          <Link
            key={breadcrumb.path}
            component="button"
            variant="body2"
            onClick={() => navigate(breadcrumb.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: breadcrumb.isRoot ? 'primary.main' : 'text.secondary',
              textDecoration: 'none',
              fontWeight: breadcrumb.isRoot ? 'bold' : 'normal',
              '&:hover': {
                color: breadcrumb.isRoot ? 'primary.dark' : 'text.primary',
                textDecoration: 'none'
              },
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {breadcrumb.icon}
            <Typography
              variant="body2"
              sx={{
                ml: 0.5,
                fontWeight: breadcrumb.isRoot ? 'bold' : 'normal'
              }}
            >
              {breadcrumb.label}
            </Typography>
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs; 