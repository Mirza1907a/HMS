import React from 'react';
import numeral from 'numeral';

const NumberFormatter = ({ value }) => {
  const formattedNumber = numeral(value).format('0a');
  return <span>{formattedNumber}</span>;
};

export default NumberFormatter;
