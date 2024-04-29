import { fireEvent, render, screen } from '@testing-library/react';

import Tickets from './tickets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not...I'm not depending on the results so no need to put in a return value
}));

describe('Tickets', () => {
  it('should render successfully', () => {
    const queryClient = new QueryClient();

    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <Tickets />
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
    const ticket = screen.getByTestId('ticket-0');
    expect(ticket).toHaveTextContent('Install a monitor arm');
    const input = screen.getByLabelText('ticket-input');
    fireEvent.change(input, { target: { value: 'new' } });
    const addButton = screen.getByRole('button', { name: 'add' });
    fireEvent.click(addButton);
    expect(screen.getByTestId('ticket-2')).toHaveTextContent('new');
  });
});
