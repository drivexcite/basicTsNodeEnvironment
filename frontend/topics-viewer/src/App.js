import * as React from 'react';
import { useEffect, useState } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { getTopics } from './server/httpUtils';

function TopicTable() {
  const [skip, setSkip] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    const result = await getTopics(skip, rowsPerPage);
    const topics = result.topics;
    const pagination = result.pagination;

    setTopics(topics);
    setTotal(pagination.count);
  };

  useEffect(() => {
    fetchTopics();
  }, [page, rowsPerPage]);

  const columns = [
    { id: 'topicSurrogateId', label: 'Id', minWidth: 50, align: 'left' },
    { id: 'topicId', label: 'Hwid', minWidth: 100, align: 'center' },
    { id: 'title', label: 'Title', minWidth: 170, align: 'left' },
    { id: 'localization', label: 'Localization', minWidth: 170, align: 'center' },
    { id: 'topicTypeId', label: 'Topic Type', minWidth: 170, align: 'left' },
    { id: 'visibilityId', label: 'Visibility', minWidth: 170, align: 'left' },
    { id: 'moduleTypeId', label: 'Module Type', minWidth: 170, align: 'left' }
  ];

  const useStyles = makeStyles({
    root: {
      width: '80%',
    },
    container: {
      maxHeight: 660,
    },
  });

  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSkip(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {topics.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, 200]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </header>
    </div>
  );
}

function App() {
  return (
    <TopicTable />
  );
}

export default App;
