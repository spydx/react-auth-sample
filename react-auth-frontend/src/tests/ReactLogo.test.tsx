
import { ReactLogo } from '../views/ReactLogo';
import { store } from '../state/store';
import { Provider } from 'react-redux';
import { create} from 'react-test-renderer';
import { render } from '@testing-library/react';

const component = <Provider store={store}><ReactLogo /></Provider>

describe('A snapshot test of ReactLogo', () => {
  test('Render ReactLogo', () => {
    let tree = create(component)
    expect(tree.toJSON()).toMatchSnapshot();
  })

  test('Render Logout', () => {
   const { getByText } = render(component)
   const logout  = getByText("Logout")
   expect(logout).toBeInTheDocument();

 })
})