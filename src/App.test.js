// App.test.js

import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('navigates to home page by default', () => {
    render(<App />);
    // Update this line with the actual text or element that appears on your home page
    expect(screen.getByText('ATS Application')).toBeInTheDocument();
  });

  // Add more tests here for other routes and functionalities
});
