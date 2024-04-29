import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useMutation, useQueries } from '@tanstack/react-query';
import { Ticket, User } from '@acme/shared-models';
import { backendURL } from '../constants';
import styled from '@emotion/styled';
import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material';

export function TicketDetails() {
  const { ticketId } = useParams();
  const [ticketQuery, userQuery] = useQueries({
    queries: [
      {
        queryKey: ['tickets'],
        queryFn: () =>
          axios
            .get(`${backendURL}/tickets/${ticketId}`)
            .then((res) => res.data),
      },
      {
        queryKey: ['users'],
        queryFn: () => axios.get(`${backendURL}/users`).then((res) => res.data),
      },
    ],
  });
  const mutation = useMutation({
    mutationKey: ['assignee'],
    mutationFn: (assigneeId: number) =>
      assigneeId === 0
        ? axios.put(`${backendURL}/tickets/${ticketId}/unassign`)
        : axios.put(`${backendURL}/tickets/${ticketId}/assign/${assigneeId}`),
    onSuccess: () => ticketQuery.refetch(),
  });

  const markStatusMutation = useMutation({
    mutationKey: ['complete'],
    mutationFn: (completed: boolean) =>
      !completed
        ? axios.put(`${backendURL}/tickets/${ticketId}/complete`)
        : axios.delete(`${backendURL}/tickets/${ticketId}/complete`),
    onSuccess: () => ticketQuery.refetch(),
    onError: () => alert('something went wrong'),
  });

  if (ticketQuery.isLoading) return <div>Loading...</div>;
  if (ticketQuery.error || userQuery.error)
    return <div>Oops! Something went wrong</div>;

  const ticket: Ticket = ticketQuery.data;

  const onAssigneeChange = (e: SelectChangeEvent<number>) => {
    mutation.mutate(Number(e.target.value));
  };

  const onMarkStatus = () => markStatusMutation.mutate(ticket.completed);

  return (
    <Container>
      <h1>Ticket Details</h1>
      <Item>
        <div>Description: </div>
        <div>{ticket.description}</div>
      </Item>
      <Item>
        <div>Assign to: </div>
        <Select
          className="select select-bordered w-full max-w-xs"
          onChange={onAssigneeChange}
          value={ticket.assigneeId || 0}
          style={{ minWidth: 120, height: 40 }}
        >
          <MenuItem value={0}>Unassigned</MenuItem>

          {userQuery.data?.map((option: User) => (
            <MenuItem
              key={option.id}
              value={option.id}
              selected={ticket.assigneeId === option.id}
            >
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </Item>
      <Item>
        <div>Completed: </div>
        <div
          style={{
            color: ticket.completed ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {ticket.completed ? 'Yes' : 'No'}
        </div>
      </Item>
      <Button
        variant="contained"
        color={ticket.completed ? 'error' : 'success'}
        onClick={onMarkStatus}
      >
        {ticket.completed ? 'Mark as uncompleted' : 'Mark as completed'}
      </Button>
    </Container>
  );
}

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'sans-serif',
  width: '30%',
});

const Item = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
});

export default TicketDetails;
