import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { KeyboardArrowUp, KeyboardArrowDown } from "material-ui-icons";

const SortBy = styled.div`
  align-items: center;
  background-color: #fff;
  border: 2px solid #a2a4a3;
  color: #a2a4a3;
  display: flex;
  padding: 0 0.5rem 0 1rem;
  position: relative;
  width: 205px;

  > .products-options__sort-options {
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

const SortOptions = styled.ul`
  background-color: #fff;
  border: 2px solid #a2a4a3;
  border-top: 0;
  left: -2px;
  padding: 1rem;
  position: absolute;
  top: 36px;
  width: 205px;
  z-index: 10;

  .sort-options__item:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .sort-options__item--selected,
  .sort-options__item:hover {
    color: #2ecc40;
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    width: 180px;
  }
`;

class ProductSorting extends Component {
  constructor(props) {
    super(props);

    this.setSortOption = this.setSortOption.bind(this);
    this.toggleOptionsDisplay = this.toggleOptionsDisplay.bind(this);

    this.state = {
      selected_sort: "Relevance",
      toggled: false
    };
  }

  setSortOption(index) {
    this.setState({ toggled: false });
    this.props.setSort(this.props.sorting_options[index]["value"]);
    this.setState({
      selected_sort: this.props.sorting_options[index]["display"]
    });
  }
  toggleOptionsDisplay() {
    this.setState({
      toggled: !this.state.toggled
    });
  }

  render() {
    let options =
      this.state.toggled === true ? (
        <SortOptions className="no-bullet sort-options">
          {this.props.sorting_options.map((option, index) => {
            return (
              <li
                className={
                  this.state.selected_sort === option.display
                    ? "sort-options__item sort-options__item--selected"
                    : "sort-options__item"
                }
                key={index}
                onClick={() => {
                  this.setSortOption(index);
                }}
              >
                {option.display}
              </li>
            );
          })}
        </SortOptions>
      ) : (
        ""
      );

    const arrow =
      this.state.toggled === true ? <KeyboardArrowUp /> : <KeyboardArrowDown />;
    return (
      <SortBy
        className="products-options__sort"
        onClick={this.toggleOptionsDisplay}
      >
        <div className="products-options__sort-options">
          <span className="product-options__sort-options--selected">
            {this.state.selected_sort}
          </span>
          {arrow}
        </div>
        {options}
      </SortBy>
    );
  }
}

export default ProductSorting;
