import React from 'react';

export interface StudentTableProps {
  displayAlert?: boolean;
  displaySearch?: boolean;
  displayRowsSelect?: boolean;
  defaultFilter?: (academy: string, tutor: string) => void;
}

export default class StudentTable extends React.Component<StudentTableProps, any> {}
