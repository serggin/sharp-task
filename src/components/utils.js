export function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

// after https://www.w3resource.com/javascript/form/email-validation.php
export function ValidateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

// from https://material-ui.com/components/tables/#table
export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stringDescendingComparator(a, b, orderBy) {
  a = a[orderBy].toLowerCase();
  b = b[orderBy].toLowerCase();
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

export function dateDescendingComparator(a, b, orderBy) {
  a = new Date(a[orderBy]);
  b = new Date(b[orderBy]);
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

// after https://material-ui.com/components/tables/#table
export function getComparator(order, orderBy, type= "") {
  switch (type) {
    case "string":
      return order === 'desc'
        ? (a, b) => stringDescendingComparator(a, b, orderBy)
        : (a, b) => -stringDescendingComparator(a, b, orderBy);
    case "date":
      return order === 'desc'
        ? (a, b) => dateDescendingComparator(a, b, orderBy)
        : (a, b) => -dateDescendingComparator(a, b, orderBy);
    default:
      return (a, b) => (order === 'desc' ? 1 : -1) * descendingComparator(a, b, orderBy);
  }
}

// from https://material-ui.com/components/tables/#table
export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}