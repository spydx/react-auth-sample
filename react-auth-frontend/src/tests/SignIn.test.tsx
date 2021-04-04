
import { SignIn } from '../views/SignIn';
import { showRegisterView } from '../state/reducers/Account';
import { store } from '../state/store';
import { Provider } from 'react-redux';
import { create, act} from 'react-test-renderer';
import {  render} from '@testing-library/react';

describe('A snapshot test of App', () => {
  
  test('Render SignIn', () => {
    let tree = create(<Provider store={store}><SignIn /></Provider>);
    expect(tree.toJSON()).toMatchSnapshot();
  })


  test('Render so that Sign In fields are there', () => {

   const { getByText }= render(<Provider store={store}><SignIn /></Provider>);
   

   const signinbutton = getByText('Sign in')
   const registerbutton = getByText('Register')
   const emailfield = getByText('Email address')
   const passwordfield = getByText('Password')
   expect(emailfield).toBeInTheDocument();
   expect(passwordfield).toBeInTheDocument();
   expect(signinbutton).toBeInTheDocument();
   expect(registerbutton).toBeInTheDocument();
   
  })


  test('Render After pressed Register button', () => {
   const customstore = store;
   act( () => {
      customstore.dispatch(showRegisterView(true));
   })

   const { getByText }= render(<Provider store={customstore}><SignIn /></Provider>);
   
   
   const namefield = getByText('Name')
   const emailfield = getByText('Email address')
   const passwordfield = getByText('Password')
   expect(namefield).toBeInTheDocument();
   expect(emailfield).toBeInTheDocument();
   expect(passwordfield).toBeInTheDocument();
  })


})