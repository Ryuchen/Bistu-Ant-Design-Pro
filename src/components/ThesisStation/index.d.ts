import React from 'react';

export interface TesisStationProps {
  displayAlert?: boolean;
  displaySearch?: boolean;
  displayRowsSelect?: boolean;
  defaultFilter?: (academy: string, tutor: string) => void;
}

export default class ThesisStationTable extends React.Component<TesisStationProps, any> {}
