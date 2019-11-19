import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

import Form from '../component/form.component';

describe('<Form />', () => {
	it('Testing on React components, renders without crashing', () => {
		shallow(<Form />);
	});
});