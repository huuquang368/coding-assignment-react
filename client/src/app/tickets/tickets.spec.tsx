import { render, screen, waitFor } from '@testing-library/react';

import Tickets from './tickets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not...I'm not depending on the results so no need to put in a return value
}));

const queryClient = new QueryClient();
describe('Tickets', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <Tickets />
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByTestId('ticket-1')).toHaveTextContent(
        'Install a monitor arm'
      )
    );
  });
});
