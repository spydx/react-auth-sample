

import React from 'react';

//import './App.css';
import { SignIn } from './views/SignIn';
import { ReactLogo } from './views/ReactLogo';
import { useSelector } from 'react-redux';
import { RootState } from './state/rootReducer';
import {Container} from '@material-ui/core';


function App() {
  const auth = useSelector((state: RootState) => state.auth)

  return (
    <Container>
      {!auth.authenticated ? <SignIn /> : <ReactLogo/>}  
    </Container>
  );
}


export default App;
