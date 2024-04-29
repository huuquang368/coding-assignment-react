import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import styles from './filter-dropdown.module.css';
import { FilterOption } from '../constants';

interface FilterDropdownProps {
  value: FilterOption[];
  onFilter: (e: SelectChangeEvent) => void;
}

export function FilterDropdown({ value, onFilter }: FilterDropdownProps) {
  return (
    <>
      <span className={styles['show']}>Show ticket by: </span>
      <Select
        className="select select-bordered w-full max-w-xs"
        onChange={onFilter}
        defaultValue="all"
        style={{ minWidth: 120, height: 40 }}
      >
        {value.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default FilterDropdown;
