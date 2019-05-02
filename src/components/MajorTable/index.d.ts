import React from 'react';

export interface MajorTableProps {
  defaultFilter?: (academy: string, tutor: string) => void;
}

export default class MajorTable extends React.Component<MajorTableProps, any> {}
