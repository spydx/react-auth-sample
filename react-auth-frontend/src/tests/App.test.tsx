
import App from '../App';
import {store} from '../state/store';
import { Provider } from 'react-redux';
import { create} from 'react-test-renderer';

describe('A snapshot test of App', () => {
  test('Render App', () => {
    let tree = create(<Provider store={store}><App /></Provider>)
    expect(tree.toJSON()).toMatchSnapshot();
  })
})