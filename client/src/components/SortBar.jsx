import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { Form } from "react-bootstrap";
import "../css/typeBar.css";

const SortBar = observer(() => {
  const { product } = useContext(Context);
  const handleSortChange = (e) => {
    product.setSortType(e.target.value);
  };
  return (
    <Form className="mb-3">
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Sort by:</Form.Label>
        <Form.Control
          as="select"
          onChange={handleSortChange}
          value={product.sortType}
        >
          <option value="default">Default</option>
          <option value="asc">Ascending price</option>
          <option value="desc">Descending price</option>
          <option value="alphA-Z">Alphabetically A-Z</option>
          <option value="alphZ-A">Alphabetically Z-A</option>
        </Form.Control>
      </Form.Group>
    </Form>
  );
});

export default SortBar;
