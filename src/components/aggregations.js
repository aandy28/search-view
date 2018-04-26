import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Clear } from "material-ui-icons";
import ProductAggregate from "./aggregate.js";

const ProductFiltersHeader = styled.h2`
  align-items: center;
  background-color: #2ecc40;
  color: #fff;
  display: flex;
  font-size: 1.25rem;
  height: 50px;
  justify-content: space-between;
  margin: 0;
  padding: 0 1rem;

  .aggregations__close {
    margin-left: 1rem;

    &:hover {
      cursor: pointer;
    }
  }

  @media only screen and (min-width: 768px) {
    .aggregations__close {
      display: none;
    }
  }
`;

const ProductFiltersClear = styled.a`
  color: #fff;
  font-size: 0.875rem;

  &:hover {
    cursor: pointer;
  }
`;

const SelectedAggregations = styled.ul`
  border-bottom: 1px solid #f4f4f4;
  border-left: 1px solid #f4f4f4;
  border-right: 1px solid #f4f4f4;
  padding: 1rem;
  margin-bottom: 0.25rem;
`;

const SelectedAggregate = styled.li`
  color: #656565;
  display: flex;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
  }
`;

class ProductAggregations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aggregations: []
    };
    this.formatAggregations = this.formatAggregations.bind(this);
    this.formatAggregationTitle = this.formatAggregationTitle.bind(this);
    this.getDisplayValue = this.getDisplayValue.bind(this);
    this.closeFilters = this.closeFilters.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.formatAggregations(nextProps.aggregations);
  }

  closeFilters() {
    const filters = document.querySelector(".product-filters");
    filters.classList.remove("product-filters--open");
    document.body.classList.remove("no-scroll");
  }

  getDisplayValue(type, val) {
    let display = "";
    if (this.props.aggregations[type] !== undefined) {
      display = this.props.aggregations[type].buckets.filter(agg => {
        if (agg.value === val) {
          return agg;
        }
      })[0].key;
    }

    return display;
  }

  formatAggregationTitle(key) {
    return `${key.replace(/_/g, " ")}`;
  }

  formatAggregations(aggs) {
    let aggregations = [];
    Object.keys(aggs).forEach(key => {
      let options = aggs[key].buckets.length;
      if (options >= 1) {
        let formatted_options = [];

        aggs[key].buckets.forEach(agg => {
          agg["selected"] = false;
          if (this.props.applied_aggregates[key] !== undefined) {
            if (
              this.props.applied_aggregates[key].includes(agg["value"]) ===
                true ||
              this.props.applied_aggregates[key].includes(
                decodeURIComponent(agg["value"])
              ) === true
            ) {
              agg["selected"] = true;
            }
          }
          formatted_options.push(agg);
        });

        aggregations.push({
          title: this.formatAggregationTitle(key),
          options: formatted_options
        });
      }
    });

    aggregations.sort((a, b) => {
      let nameA = a.title.toUpperCase();
      let nameB = b.title.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    this.setState({ aggregations });
  }

  render() {
    let appliedAggregates = [];
    Object.keys(this.props.applied_aggregates).forEach(key => {
      this.props.applied_aggregates[key].forEach((val, index) => {
        let display_agg_title = val;
        let count = 0;
        if (this.props.aggregations[key] !== undefined) {
          let value = this.props.aggregations[key].buckets.filter(agg => {
            if (key === "category" || key === "brand") {
              return agg.value === val;
            } else {
              return agg.key === val || encodeURIComponent(agg.key) === val;
            }
          });
          count = value[0] === undefined ? 0 : value[0].doc_count;
        }

        if (key === "brand") {
          display_agg_title = this.getDisplayValue("brand", val);
        }

        if (key === "category") {
          display_agg_title = this.getDisplayValue("category", val);
        }

        if (count > 0) {
          appliedAggregates.push(
            <SelectedAggregate
              onClick={() => {
                this.props.toggleAggregate(key, val, true, true);
              }}
              key={`${val}-${index}`}
            >
              <span>
                {this.formatAggregationTitle(key)} -{" "}
                {decodeURIComponent(display_agg_title)} ({count})
              </span>
              <Clear />
            </SelectedAggregate>
          );
        }
      });
    });

    const aggsApplied =
      appliedAggregates.length > 0 ? (
        <SelectedAggregations className="no-bullet aggregation__options aggregation__options--selected">
          {appliedAggregates}
        </SelectedAggregations>
      ) : (
        ""
      );

    const clearAggregations =
      Object.keys(this.props.applied_aggregates).length > 0 ? (
        <ProductFiltersClear
          href="#"
          onClick={e => {
            e.preventDefault();
            this.props.resetAllAggregates();
          }}
        >
          Clear
        </ProductFiltersClear>
      ) : (
        ""
      );

    return (
      <React.Fragment>
        <ProductFiltersHeader className="aggregations__header">
          <span>Filters</span>
          <span>
            {clearAggregations}
            <Clear
              className="aggregations__close"
              onClick={this.closeFilters}
            />
          </span>
        </ProductFiltersHeader>
        {aggsApplied}
        {this.state.aggregations.map(agg => (
          <ProductAggregate
            key={agg.title}
            agg={agg}
            toggleAggregate={this.props.toggleAggregate}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default ProductAggregations;
