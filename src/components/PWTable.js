import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  headRow: {
    backgroundColor: theme.palette.primary.light,
  },
  rowHover: {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      cursor: "pointer"
    }
  }
}));


const PWTableCell = (props) => {
  const className = props.className ? {className: props.className} : {};
  const padding = props.padding ? {padding: props.padding} : {};
  const align = props.align ? {align: props.align} : {};
  const sortDirection = props.sort ? {sortDirection: props.sort.direction} : {};
  return (
    <TableCell {...className} {...padding} {...align} {...sortDirection} >
      {props.sort &&
        <TableSortLabel
          active={props.sort.active}
          direction={props.sort.direction}
          onClick={() => {props.sort.onSort(props.id)}}
        >
          {props.content}
        </TableSortLabel>
      }
      {!props.sort && props.content}
    </TableCell>
  );
}
PWTableCell.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  padding:PropTypes.oneOf(['default', 'checkbox', 'none']),
  align:PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
  sort: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSort: PropTypes.func.isRequired
  })
}

const PWTableHead = (props) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow className={classes.headRow}>
        {props.columns.map(column => {
          let sort = {};
          if (props.sort && column.sortable) {
            sort = {
              sort: {
                active: column.id === props.sort.orderBy,
                direction: props.sort.direction,
                onSort: props.sort.onSort
              }
            };
          }
            const align = column.align ? {align: column.align} : {};
            return (
            <PWTableCell key={column.id} id={column.id}
                         className={classes.headRow}
                         content={column.label}
                         {...align}
                         {...sort} />
          );
        }
        )}
      </TableRow>
    </TableHead>
  );
};
PWTableHead.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    align: PropTypes.string,
    sortable: PropTypes.bool
  })).isRequired,
  sort: PropTypes.shape({
    orderBy: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSort: PropTypes.func.isRequired
  })
}

const PWTable = (props) => {
  const classes = useStyles();
  const hoverClass = props.onRowClick ? classes.rowHover : "";

  const onRowClick = (row) => {
    if (props.onRowClick) {
      props.onRowClick(row);
    }
  }

  return (
    <Table stickyHeader size="small">
      <PWTableHead columns={props.columns} {...(props.sort ? {sort: props.sort} : {})}/>
      <TableBody>
        {true && props.data.map((row) => (
          <TableRow key={row.id} onClick={() => {onRowClick(row)}}>
            {props.columns.map(column => {
              const align = column.align ? {align: column.align} : {};
              return (
                <PWTableCell key={column.id} {...align} content={row[column.id]} className={hoverClass}/>
              )
            })}
           </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
PWTable.propTypes ={
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  sort: PropTypes.shape({
    orderBy: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    onSort: PropTypes.func.isRequired
  }),
  onRowClick: PropTypes.func
}

export default PWTable;
