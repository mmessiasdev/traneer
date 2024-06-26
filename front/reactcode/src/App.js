import { createTheme, ThemeProvider } from '@mui/material/styles';
import RoutesPage from './controller/routes/routes';

function App() {

  //   0
  // sm 600 
  // md 900   
  // lg 1200
  // xl 1536

  const Theme = createTheme({
    palette: {
      primary: {
        main: "#5CBBFF",
        dark: "#4563FF",
        light: "#4563FF",
        contrastText: '#fff',
      },
      secondary: {
        main: "#D9D9D9"
      },
      background: {
        main: "#FFFFFF",
        dark: "#000000",
        default: "#FFFFFF"
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#D9D9D9"
      }
    },
    typography: {
      fontFamily: "Montserrat",
      h1: {
        fontSize: 48,
        fontWeight: 'normal'
      },
      h2: {
        fontSize: 32,
        fontWeight: 'normal'
      },
      h3: {
        textTransform: "capitalize",
        fontSize: 20,
        fontWeight: 'bold'
      },  
      h4: {
        textTransform: "capitalize",
        fontSize: 15,
        fontWeight: 'normal'
      }


    }
  })


  return (
    <ThemeProvider theme={Theme}>
      <RoutesPage />
    </ThemeProvider>
  );
}

export default App;