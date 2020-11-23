import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Main Page has everything', () => {
  const { getByText } = render(<App />);
  const headingElement = getByText(/Project Manager/i);

  expect(headingElement).toBeInTheDocument();

});
