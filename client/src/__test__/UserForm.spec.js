// const apiCall = require('../src/service/apiCall');

// test('returns Object', () => {
//   expect(typeof(apiCall.getAnalysedData({
//       url: 'https://www.npmjs.com/package/jest'
//   }))).toBe("object");
// });


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