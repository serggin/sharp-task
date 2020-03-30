import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Modal, Typography} from '@material-ui/core';
import {IconButton, CircularProgress, TableContainer} from '@material-ui/core';
import { inject, observer } from "mobx-react";
import {Clear as ClearIcon} from "@material-ui/icons";

import {getUserTransactions} from "../api";
import {stableSort, getComparator} from "../components/utils";
import PWTable from "../components/PWTable";
import PropTypes from "prop-types";

const width = 500;
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableContainer: {
    width: "100%",
    maxWidth: width,
    maxHeight: window.innerHeight - 200
  },
  paper: {
    position: 'absolute',
    width: width,
    top: 64,
    left: (window.innerWidth - width) / 2,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  error: {
    height: 56,
    lineHeight: "56px",
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  },
}));

const TransListDialog = inject("store")(
  observer(({store, onRowClick}) => {
    const classes = useStyles();

    const { id_token } = store;
    const [open] = React.useState(true);
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState("");
    const [rawData, setRawData] = useState([]);
    const [tableData, setTableData] = useState([]);

    const onClose = () => {
      onRowClick(null);
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

    useEffect(() => {
      prepareData();
    }, [rawData])


    const prepareData = () => {
      let resultData = applySort(applyFilter(rawData));
      resultData = resultData.map(row => {
        const {id, date, username, amount} = row;
        return {id, date, username, amount: -amount};
      });
      setTableData(resultData);
    }
    const applyFilter = (data) => {
      return data.filter(row => {
        return row.amount < 0;
      });
    }
    const applySort = (data) => {
      return stableSort(data, getComparator("desc", "date", "date"));
    }

    const columns = [
      {id: 'date', label: "Date", sortable: false},
      {id: 'username', label: "Correspondent", sortable: false},
      {id: 'amount', label: "Amount", align: "right", sortable: false},
    ];

    const onRowClicked = (row) => {
      const {username, amount} = row;
      onRowClick({username, amount});
      onClose();
    }

    return (
      <div>
        <Modal open={open} onClose={onClose}>
          <div className={classes.paper}>
            <div className={classes.header}>
              <Typography variant="h4" gutterBottom>Similar Transactions</Typography>
              <IconButton
                edge="start"
                className={classes.clearButton}
                color="inherit"
                onClick = {onClose}
              >
                <ClearIcon />
              </IconButton>
            </div>
            <TableContainer className={classes.tableContainer}>
              <PWTable columns={columns} data={tableData} onRowClick={onRowClicked}/>
            </TableContainer>
            {inProgress && <CircularProgress />}
            {error && <div className={classes.error}>{error}</div>}
          </div>
        </Modal>
      </div>
    );
  })
);
TransListDialog.propTypes = {
  onRowClick: PropTypes.func.isRequired
}
export default TransListDialog;
