import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const SearchTitle = styled.h1`
  color: #252729;
  margin: 3rem 0;
`;

class ProductsSearchTitle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let title =
      this.props.mode === "search" ? (
        <SearchTitle className="product-listings__title">
          Search Results for <span>&#x27;{this.props.q}&#x27;</span>
        </SearchTitle>
      ) : (
        <SearchTitle className="product-listings__title">
          {this.props.title}
        </SearchTitle>
      );
    return <div className="container">{title}</div>;
  }
}

export default ProductsSearchTitle;
