import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { RadioButtonChecked, RadioButtonUnchecked } from "material-ui-icons";

const Aggregate = styled.li`
  align-items: center;
  display: flex;

  > svg {
    fill: #a2a2a2;
    height: 16px;
    margin-right: 0.25rem;
    width: 16px;
  }
`;

class ProductAggregateOption extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const aggregate_status =
      this.props.option.selected === true ? (
        <RadioButtonChecked />
      ) : (
        <RadioButtonUnchecked />
      );

    if (this.props.option.key === "") {
      return null;
    } else {
      return (
        <Aggregate
          className="aggregate"
          onClick={() => {
            this.props.toggleAggregate(
              this.props.agg_type,
              this.props.option.value,
              true,
              true
            );
          }}
        >
          {aggregate_status}
          <span className="aggregate__title">
            {this.props.option.key}&nbsp;
          </span>
          <span className="aggregate__count">
            ({this.props.option.doc_count})
          </span>
        </Aggregate>
      );
    }
  }
}

export default ProductAggregateOption;
