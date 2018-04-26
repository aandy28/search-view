import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Add, Remove } from "material-ui-icons";
import ProductAggregateOption from "./aggregate_option.js";

const Aggregation = styled.ul`
  .aggregation__options {
    border: 1px solid #f4f4f4;
    margin-bottom: 0.25rem;
    padding: 1rem;

    .aggregate {
      color: #555555;

      &:not(:last-of-type) {
        margin-bottom: 1rem;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .aggregation__title--closed {
    margin-bottom: 0.25rem;
  }

  .aggregation__options--closed,
  .aggregation__view-all--closed {
    display: none;
  }

  .aggregation__options--view-all {
    border-bottom: 0;
    margin-bottom: 0;
    height: 200px;
    overflow: hidden;
  }

  .aggregation__options--show-all {
    height: auto;
  }
`;

const ViewAll = styled.div`
  border-bottom: 1px solid #f4f4f4;
  border-left: 1px solid #f4f4f4;
  border-right: 1px solid #f4f4f4;
  padding: 0 1rem 1rem;
  margin-bottom: 0.25rem;

  &:hover {
    cursor: pointer;
  }
`;

const AggregationTitle = styled.li`
  align-items: center;
  background-color: #f4f4f4;
  color: #555555;
  display: flex;
  font-size: 1.125rem;
  height: 50px;
  justify-content: space-between;
  padding: 0 1rem;

  &:hover {
    cursor: pointer;
  }
`;

const AggregationSearch = styled.li`
  display: flex;
`;

class ProductAggregate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      view_all: false,
      filter_value: "",
      original_options: this.props.agg.options,
      filtered_options: this.props.agg.options
    };

    this.toggleAggregation = this.toggleAggregation.bind(this);
    this.toggleViewAll = this.toggleViewAll.bind(this);
    this.handleFilterValue = this.handleFilterValue.bind(this);
    this.filterOptions = this.filterOptions.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        original_options: nextProps.agg.options
      },
      () => {
        this.filterOptions();
      }
    );
  }

  toggleAggregation(e) {
    this.setState({
      expanded: !this.state.expanded
    });
    const title = e.target.closest(".aggregation__title");
    title.classList.toggle("aggregation__title--closed");
    const aggOptions = title.nextSibling;
    aggOptions.classList.toggle("aggregation__options--closed");
    const viewAllToggle = aggOptions.nextSibling;
    if (viewAllToggle.nodeName === "DIV") {
      viewAllToggle.classList.toggle("aggregation__view-all--closed");
    }
  }

  toggleViewAll(e) {
    this.setState({
      view_all: !this.state.view_all
    });
    const aggOptions = e.target.previousSibling;
    aggOptions.classList.toggle("aggregation__options--show-all");
  }

  handleFilterValue(e) {
    this.setState(
      {
        filter_value: e.target.value
      },
      () => {
        this.filterOptions();
      }
    );
  }

  filterOptions() {
    let new_list = this.state.original_options.filter(option => {
      return option.key
        .toUpperCase()
        .includes(this.state.filter_value.toUpperCase()) === true
        ? option
        : false;
    });

    this.setState({ filtered_options: new_list });
  }

  resetSearch() {
    this.setState({ filter_value: "" }, () => {
      this.filterOptions();
    });
  }

  render() {
    const toggled = this.state.expanded === false ? <Add /> : <Remove />;
    const viewAllText =
      this.state.view_all === false ? "View All" : "View Less";
    const options =
      this.state.filtered_options.length === 0 ? (
        <strong>No Options found.</strong>
      ) : (
        this.state.filtered_options.map((option, index) => {
          return (
            <ProductAggregateOption
              key={index}
              option={option}
              agg_type={this.props.agg.title}
              toggleAggregate={this.props.toggleAggregate}
            />
          );
        })
      );

    return (
      <Aggregation className="no-bullet product-filter__aggregation">
        <AggregationTitle
          className="aggregation__title"
          onClick={this.toggleAggregation}
        >
          <span>{this.props.agg.title.replace("_", " ")}</span>
          {toggled}
        </AggregationTitle>
        <ul
          className={
            this.props.agg.options.length > 11
              ? "no-bullet aggregation__options aggregation__options--view-all"
              : "no-bullet aggregation__options"
          }
        >
          {this.props.agg.options.length > 11 ? (
            <AggregationSearch className="aggregation__search form-group">
              <input
                className="form-control"
                type="text"
                value={this.state.filter_value}
                placeholder={`Search ${this.props.agg.title.replace(
                  /_/g,
                  " "
                )}`}
                onChange={this.handleFilterValue}
              />
              <button className="btn--xsmall" onClick={this.resetSearch}>
                reset
              </button>
            </AggregationSearch>
          ) : (
            ""
          )}
          {options}
        </ul>
        {this.props.agg.options.length > 11 ? (
          <ViewAll
            className="aggregation__view-all"
            onClick={this.toggleViewAll}
          >
            {viewAllText}
          </ViewAll>
        ) : (
          ""
        )}
      </Aggregation>
    );
  }
}

export default ProductAggregate;
