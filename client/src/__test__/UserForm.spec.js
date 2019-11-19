import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { render } from 'react-dom'

jest.mock('react-dom')
// jest.mock('../src/store/index', () => () => ({
//     subscribe: jest.fn(),
//     dispatch: jest.fn(),
//     getState: jest.fn()
// }))

import Form from '../component/form.component';

configure({adapter: new Adapter()});

describe("App Entry Point - /src/index.js", () => {

    it("renders app wihtout error", () => {
        require('../index.js')
    })

})




describe('<Form />', () => {
	it('Testing on React components, renders without crashing', () => {
		shallow(<Form />);
	});
});