import React, { Component, PropTypes } from 'react';


const style = {
  focus: {
    border: { fg: 'cyan' },
  },
  blur: {
    border: { fg: 'white' },
  },
};


export default class QueryResults extends Component {

  static propTypes = {
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    result: PropTypes.any,
  };

  constructor (props) {
    super(props);

    this.state = { focused: false };
  }

  handleFocus () {
    this.setState({ focused: true });
    if (this.props.onFocus) this.props.onFocus(this);
  }

  handleBlur () {
    this.setState({ focused: false });
    if (this.props.onBlur) this.props.onBlur(this);
  }

  render () {
    const { result } = this.props;
    let content = 'no results';

    if (result) {
      const { command, rows, fields } = result;
      if (command === 'SELECT') {
        const data = [];
        const colsMax = fields.map(() => 0);

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          data.push([]);
          for (let colIndex = 0; colIndex < fields.length; colIndex++) {
            const field = fields[colIndex];

            let value = row[field.name];
            if (value === null) value = 'null';
            if (value === undefined) value = 'undefined';
            value = value.toString();

            colsMax[colIndex] = colsMax[colIndex] < value.length
              ? value.length
              : colsMax[colIndex];

            data[rowIndex].push(value);
          }
        }
        data.unshift([]);
        for (let colIndex = 0; colIndex < fields.length; colIndex++) {
          const field = fields[colIndex];
          const value = field.name;
          data[0].push(value);
          colsMax[colIndex] = colsMax[colIndex] < value.length
            ? value.length
            : colsMax[colIndex];
        }
        content = data.map(row => {
          return row.map((col, index) => {
            const spaces = new Array(colsMax[index] - col.length + 2).join(' ');
            return col + spaces;
          }).join(' ');
        }).join('\n');
      }
    }

    return (
      <box
        border="line"
        label="Result"
        style={this.state.focused ? style.focus : style.blur }
      >
        <textarea
          mouse="true"
          keys="true"
          scrollbar={{
            ch: ' ',
            track: { bg: 'cyan' },
            style: { inverse: true },
          }}
          scrollable="true"
          alwaysScroll="true"
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          value={content}
        />
      </box>
    );
  }

}