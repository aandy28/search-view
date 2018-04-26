import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ProductSearchContainer = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  background: rgba(88, 88, 88, 0.7);
  z-index: 999;
  transition: all 0.25s ease-in-out;

  &.hidden {
    display: none;
  }
`;

const ProductSearchLoader = styled.div`
  position: fixed;
  height: 200px;
  width: 200px;
  margin-top: -100px;
  margin-left: -100px;
  top: 50%;
  left: 50%;
  padding: 2%;
  background: #fff;
  transition: all 0.25s ease-in-out;
  box-shadow: 0px 0px 39px 0px rgba(0, 0, 0, 0.31);

  .loader {
    border-left-color: #d12339;
    margin-top: 60px;
  }
`;

class ProductsLoading extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ProductSearchContainer
        className={
          "products--search-container" +
          (this.props.loading === false ? " hidden" : "")
        }
      >
        <ProductSearchLoader className="products--search-loader">
          <div className="loader">
            <h1>Loading</h1>
          </div>
        </ProductSearchLoader>
      </ProductSearchContainer>
    );
  }
}

export default ProductsLoading;
