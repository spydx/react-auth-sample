import { SignIn } from './views/SignIn';
import { ReactLogo } from './views/ReactLogo';
import { useSelector } from 'react-redux';
import { RootState } from './state/rootReducer';
import { Container } from '@material-ui/core';
import { Footer } from './components/Footer';

function App() {
  const auth = useSelector((state: RootState) => state.auth)

  return (
    <Container>
      {!auth.authenticated ? <SignIn /> : <ReactLogo/>}  
      <Footer/>
    </Container>
    
  );
}

export default App;