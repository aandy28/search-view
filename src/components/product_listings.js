import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Product from "./product";

const ProductsGrid = styled.div`
  display: flex;
  flex-direction: ${props => props.contentFlexDirection};
  flex-wrap: wrap;
`;

class ProductListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedProperties: [],
      comparedProducts: [],
      contentFlexDirection: "row"
    };

    this.switchLayout = this.switchLayout.bind(this);
    this.addToCompare = this.addToCompare.bind(this);
    this.addToFavourites = this.addToFavourites.bind(this);
  }

  chunkProperties(arr, n) {
    return arr
      .slice(0, ((arr.length + n - 1) / n) | 0)
      .map((c, i) => arr.slice(n * i, n * i + n));
  }

  switchLayout() {
    const newLayout =
      this.state.contentFlexDirection == "row" ? "column" : "row";
    this.setState({ contentFlexDirection: newLayout });
    localStorage.setItem("contentFlexDirection", newLayout);
  }

  componentWillMount() {
    const setContentFlexDirection = localStorage.getItem(
      "contentFlexDirection"
    );
    this.setState({ contentFlexDirection: setContentFlexDirection });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      formattedProperties: this.chunkProperties(nextProps.products, 3)
    });
  }

  addToFavourites(productId) {
    this.props.addToFavourites(productId);
  }

  addToCompare(product) {
    this.props.addToCompare(product);
  }

  render() {
    const products = this.props.products || [];
    return (
      <ProductsGrid
        className="products-grid"
        contentFlexDirection={this.state.contentFlexDirection}
      >
        {products.map((product, i) => {
          return (
            <Product
              key={i}
              data={product}
              contentFlexDirection={this.state.contentFlexDirection}
              addToFavourites={this.addToFavourites}
              addToCompare={this.addToCompare}
              config={this.props.config}
            />
          );
        })}
      </ProductsGrid>
    );
  }
}

export default ProductListings;
