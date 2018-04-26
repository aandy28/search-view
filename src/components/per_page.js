import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { KeyboardArrowUp, KeyboardArrowDown } from "material-ui-icons";

const ProductOptionsPerPage = styled.div`
  align-items: center;
  background-color: #fff;
  border: 2px solid #a2a4a3;
  color: #a2a4a3;
  display: flex;
  padding: 0 0.5rem 0 1rem;
  position: relative;
  width: 205px;

  > .products-options__per-page {
    align-items: center;
    display: flex;
    height: 34px;
    justify-content: space-between;
    width: 100%;
  }

  &:hover {
    cursor: pointer;
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    width: 180px;
  }
`;

const PerPageOptions = styled.ul`
  background-color: #fff;
  border: 2px solid #a2a4a3;
  border-top: 0;
  left: -2px;
  padding: 1rem;
  position: absolute;
  top: 36px;
  width: 205px;
  z-index: 10;

  .per-page__list-item:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .per-page__list-item__link {
    color: #a2a4a3;
    text-decoration: none;

    &:hover,
    &--selected {
      color: #2ecc40;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    width: 180px;
  }
`;

class ProductsPerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggled: false
    };

    this.toggleOptionsDisplay = this.toggleOptionsDisplay.bind(this);
  }

  toggleOptionsDisplay() {
    this.setState({
      toggled: !this.state.toggled
    });
  }

  render() {
    let options =
      this.state.toggled === true ? (
        <PerPageOptions className="no-bullet per-page__list">
          {this.props.per_page_options.map((option, index) => {
            return (
              <li key={index} className="per-page__list-item">
                <a
                  href="#"
                  className={
                    this.props.per_page === option
                      ? "per-page__list-item__link per-page__list-item__link--selected"
                      : "per-page__list-item__link"
                  }
                  onClick={e => {
                    e.preventDefault();
                    this.props.setPerPage(option);
                  }}
                >
                  {option} items per page
                </a>
              </li>
            );
          })}
        </PerPageOptions>
      ) : (
        ""
      );
    const arrow =
      this.state.toggled === true ? <KeyboardArrowUp /> : <KeyboardArrowDown />;
    return (
      <ProductOptionsPerPage>
        <div
          className="products-options__per-page"
          onClick={this.toggleOptionsDisplay}
        >
          <span className="product-options__per-page--selected">
            {this.props.per_page} items per page
          </span>
          {arrow}
        </div>
        {options}
      </ProductOptionsPerPage>
    );
  }
}

export default ProductsPerPage;
