import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pubsub } from "./pubsub.js";
import styled from "styled-components";

const ProductCompare = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: red;
`;

class ProductCompareComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productsToCompare: null,
      showCompare: false
    };
  }

  componentDidMount() {
    pubsub.subscribe("PRODUCT-COMPARE-SHOW", function(data, topic) {
      console.log(data);
      console.log(topic);
    });
  }

  componentWillMount() {
    const productsToCompare = JSON.parse(
      localStorage.getItem("productsToCompare")
    );
    if (productsToCompare.compare.length > 0) {
      this.setState({
        productsToCompare: productsToCompare.compare,
        showCompare: true
      });
    }

    // const _this = this;
    // // pubsub.subscribe("PRODUCT-COMPARE-SHOW", function(data, topic) {
    // //   console.log("here");
    // //   this.setState({
    // //     showCompare: true
    // //   });
    // // });
    // // const _this = this;
    // // const productsToCompare = JSON.parse(
    // //   localStorage.getItem("productsToCompare")
    // // );
    // // if (productsToCompare != null && productsToCompare.compare.length > 1) {
    // //   this.setState({
    // //     productsToCompare: productsToCompare,
    // //     showCompare: true
    // //   });
    // // }
    // pubsub.subscribe("PRODUCT-COMPARE-UPDATED", function(data, topic) {
    //   const productsToCompare = JSON.parse(
    //     localStorage.getItem("productsToCompare")
    //   );

    //   _this.setState({
    //     productsToCompare: productsToCompare.compare,
    //     showCompare: true
    //   });
    // });
  }

  render() {
    const showCompare = this.state.showCompare ? (
      <ProductCompare>
        {this.state.productsToCompare.map((product, i) => {
          return <p key={i}>{product.description}</p>;
        })}
      </ProductCompare>
    ) : (
      ""
    );

    return <div>{showCompare}</div>;
  }
}

export default ProductCompareComponent;
