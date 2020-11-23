import React from 'react';
import { render } from '@testing-library/react';

import Dashboard from './Dashboard';

test('renders learn react link', () => {
  const { getByText } = render(<Dashboard />);
  const headingElement = getByText(/Choose a project to work with:/i);
  expect(headingElement).toBeInTheDocument();
});
