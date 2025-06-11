import {
  Assessment,
  AutoGraph,
  Business,
  Home,
  Person,
  TrendingUp
} from '@mui/icons-material';

// Breadcrumb path mapping configuration
export const breadcrumbMap = {
  'home': { label: 'Dashboard', icon: <Home sx={{ fontSize: 18 }} /> },
  'profile': { label: 'Profile', icon: <Person sx={{ fontSize: 18 }} /> },
  'trade-management': { label: 'Trade Management', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
  'stock-management': { label: 'Stock Management', icon: <Assessment sx={{ fontSize: 18 }} /> },
  'broker-registration': { label: 'Broker Registration', icon: <Business sx={{ fontSize: 18 }} /> }
};

// Root breadcrumb configuration
export const rootBreadcrumb = {
  label: 'ATS',
  path: '/home',
  icon: <AutoGraph sx={{ fontSize: 18 }} />,
  isRoot: true
};

// Main navigation items configuration
export const navigationItems = [
  { label: 'Dashboard', path: '/home', icon: <Home sx={{ fontSize: 18 }} /> },
  { label: 'Trade Management', path: '/trade-management', icon: <TrendingUp sx={{ fontSize: 18 }} /> },
  { label: 'Stock Management', path: '/stock-management', icon: <Assessment sx={{ fontSize: 18 }} /> },
]; 