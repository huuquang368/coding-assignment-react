import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Ticket } from '@acme/shared-models';
import styles from './tickets.module.css';
import FilterDropdown from '../filter-dropdown/filter-dropdown';
import { backendURL, filterOptions } from '../constants/index';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SelectChangeEvent, Stack } from '@mui/material';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import styled from '@emotion/styled';

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [description, setDescription] = useState<string>('');
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: () =>
      axios.get(`${backendURL}/tickets`).then((res) => {
        setTickets(res.data);
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (description: string) =>
      axios.post(`${backendURL}/tickets`, { description }),
    onSuccess: () => refetch(),
    onError: () => alert('something went wrong'),
  });

  const onCreateTicket = () => {
    mutation.mutate(description);
    setDescription('');
  };

  const onFilter = (e: SelectChangeEvent<string>) => {
    switch (e.target.value) {
      case 'completed':
        setTickets(data?.filter((ticket: Ticket) => ticket.completed));
        break;
      case 'uncompleted':
        setTickets(data.filter((ticket: Ticket) => !ticket.completed));
        break;
      default:
        setTickets(data);
    }
  };

  return (
    <div className={styles['tickets']}>
      <h1>Ticket List</h1>
      <Stack
        spacing={{ xs: 1 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        marginBottom="1rem"
      >
        <TextField
          label={mutation.isPending ? 'Creating...' : 'Create new ticket'}
          variant="outlined"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          size="small"
          disabled={mutation.isPending}
        />
        <Button
          className="btn btn-primary"
          variant="contained"
          onClick={onCreateTicket}
        >
          {mutation.isPending ? 'creating...' : 'create'}
        </Button>
      </Stack>
      <FilterDropdown value={filterOptions} onFilter={onFilter} />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data && (
          <List component="nav">
            {tickets?.map((ticket) => (
              <ListStyled
                key={ticket.id}
                data-testid={`ticket-${ticket.id}`}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                primary={ticket.description}
              />
            ))}
          </List>
        )
      )}
    </div>
  );
}

const ListStyled = styled(ListItemText)({
  cursor: 'pointer',
  border: '1px solid black',
  borderRadius: 5,
  padding: 5,
  ':hover': {
    backgroundColor: 'lightgray',
  },
});

export default Tickets;
