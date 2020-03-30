import React, {useState, useEffect} from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Paper, TableContainer, Typography } from '@material-ui/core';

import {getUserTransactions} from "../api";
import PWTable from "../components/PWTable";
import HistoryFilter from "../components/HistoryFilter";
import {stableSort, getComparator} from "../components/utils";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tableContainer: {
    width: "100%",
    maxWidth: 800,
    maxHeight: window.innerHeight - 222
  },
  filter: {
    minWidth: "90%",
    marginBottom: theme.spacing(1)
  },
  table: {
    minWidth: "80%",
  }

}));

const History = inject("store")(
  observer(({store}) => {
    const classes = useStyles();

    const { id_token } = store;

    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState("");
    const [rawData, setRawData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filter, setFilter] = useState({});
    const [sort, setSort] = useState({
      orderBy: 'date',
      direction: 'desc'
    });

    function onSort(id) {
      let newSort = {...sort};
      if (id === sort.orderBy) {
        newSort.direction = sort.direction === "asc" ? "desc" : "asc";
      } else {
        newSort = {
          orderBy: id,
          direction: 'asc'
        }
      }
      setSort(newSort);
    };

    function onFilter(newFilter) {
      setFilter({...newFilter});
    }

    useEffect(() => {
      setInProgress(true);
      getUserTransactions(id_token)
        .then(result => {
          setInProgress(false);
          const { data, message } = result;
          if (data && Array.isArray(data.trans_token) && data.trans_token.length) {
            setRawData(data.trans_token);
          }
          if (message) {
            setError(message);
          }
        });
    }, []);

    const columns = [
      {id: 'date', label: "Date", sortable: true},
      {id: 'username', label: "Correspondent", sortable: true},
      {id: 'amount', label: "Amount", align: "right", sortable: true},
      {id: 'balance', label: "Balance", align: "right", sortable: false}
    ];

    const prepareData = () => {
      const resultData = applySort(applyFilter(rawData));
      setTableData(resultData);
    }

    const toDateOnly = (dateTimeString) => (
      new Date((new Date(dateTimeString)).toDateString())
    );

    const applyFilter = (data) => {
      return data.filter(row => {
        if (Object.keys(filter).length === 0) {
          return true;
        }
        let ok = true;
        if (filter.username) {
          ok = ok && row.username.toLowerCase().startsWith(filter.username.toLowerCase());
        }
        if (ok && 'minAmount' in filter) {
          ok = ok && row.amount >= filter.minAmount;
        }
        if (ok && 'maxAmount' in filter) {
          ok = ok && row.amount <= filter.maxAmount;
        }
        if (ok && filter.dateFrom) {
          console.log("~~ ", toDateOnly(row.date), filter.dateFrom, toDateOnly(row.date) >= filter.dateFrom);
          ok = ok && (toDateOnly(row.date) >= filter.dateFrom);
        }
        if (ok && filter.dateTo) {
          ok = ok && (toDateOnly(row.date) <= filter.dateTo);
        }
        return ok;
      });
    }
    const applySort = (data) => {
      let type = "";
      switch (sort.orderBy) {
        case "username":
          type = "string";
          break;
        case "date":
          type = "date";
          break;
      }
      return stableSort(data, getComparator(sort.direction, sort.orderBy, type));
    }

    useEffect(() => {
      prepareData();
    }, [rawData, sort, filter])

    return (
      <div className={classes.root}>
        <Typography variant="h3" gutterBottom>Transaction History</Typography>
        <Paper className={classes.filter}>
          <HistoryFilter onFilter={onFilter}/>
        </Paper>
        <Paper className={classes.table}>
          <TableContainer className={classes.tableContainer}>
            <PWTable columns={columns} data={tableData} sort={{...sort, onSort:onSort}}/>
          </TableContainer>
          {inProgress && <CircularProgress />}
          {error && <div className={classes.error}>{error}</div>}
        </Paper>
      </div>
      );
  })
);

export default History;
