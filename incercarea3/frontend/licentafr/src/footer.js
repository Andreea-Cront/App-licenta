// footer.js
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="text.secondary">
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }


const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '10vh',
        }}
      >
        <Box
          component="footer"
          sx={{
            py: 2,
            px: 1,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              <section className='footer-content_name'>
               <h5> Suport Clienți</h5>
              </section>
              <section className='footer-content_returns'>
                <p>
                  <Link href="https://anpc.ro/?ref=footer_3_6">
                    ANPC
                  </Link><br />
                  <Link href="https://anpc.ro/ce-este-sal/?ref=footer_3_5">
                    ANPC-SAL
                  </Link><br />
                  <Link href="/TermsAndConditions">Termeni și Condiții</Link> {/* Link către pagina TermsAndConditions */}
                </p>
              </section>
            </Typography>
            {/* <Copyright /> */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
