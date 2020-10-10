import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
  }
}

export default createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: { height: '100%' },
        body: { height: '100%' },
      },
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#F22F46',
    },
    secondary: {
      main: '#F7C77B',
    },
  },
  sidebarWidth: 260,
  sidebarMobileHeight: 90,
});
