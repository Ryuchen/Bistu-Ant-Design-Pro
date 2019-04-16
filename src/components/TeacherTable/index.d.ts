import React from 'react';

export interface TeacherTableProps {
  displayAlert?: boolean;
  displaySearch?: boolean;
  displayRowsSelect?: boolean;
  defaultFilter?: (academy: string, tutor: string) => void;
}

export default class TeacherTable extends React.Component<TeacherTableProps, any> {}
