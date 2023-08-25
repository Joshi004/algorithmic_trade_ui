import React from "react";
import { Table } from "semantic-ui-react";
import "./table.scss";

class GenericTable extends React.Component {
  snakeToTitleCase(str) {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  render() {
    const { data, columns } = this.props;

    return (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.HeaderCell key={column}>
                  {this.snakeToTitleCase(column)}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                {columns.map((column) => (
                  <Table.Cell key={`${row.id}-${column}`}>
                    {row[column]}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
    );
  }
}

export default GenericTable;
