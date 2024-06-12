import React from 'react';
import { CSVLink } from 'react-csv';

const ExportCSV = ({ data,filename,children }) => {
  if (!data) {
    return null;
  }

  return (
    <CSVLink data={data} filename={`${filename}.csv`}>
      {children}
    </CSVLink>
  );
};

export default ExportCSV;
