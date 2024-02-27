import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../main";
import { Row } from "react-bootstrap";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
  const { product } = useContext(Context);
  const [sortedAlbums, setSortedAlbums] = useState([]);

  useEffect(() => {
    const sortAlbums = () => {
      const sorted = [...product.albums];

      switch (product.sortType) {
        case "asc":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "desc":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "alphA-Z":
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "alphZ-A":
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;

        default:
          break;
      }
      return sorted;
    };

    setSortedAlbums(sortAlbums());
  }, [product.albums, product.sortType]);
  return (
    <Row className="d-flex">
      {sortedAlbums?.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Row>
  );
});

export default ProductList;
