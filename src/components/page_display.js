import React, { Component } from "react";

class PageDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_product: 0,
      last_product: 0
    };

    this.displayNumberOfProducts = this.displayNumberOfProducts.bind(this);
  }

  displayNumberOfProducts(nextProps) {
    let first = (nextProps.current_page - 1) * nextProps.per_page + 1;
    this.setState({
      first_product: first,
      last_product:
        first + nextProps.per_page > nextProps.products_total
          ? nextProps.products_total
          : first + nextProps.per_page - 1
    });
  }

  componentWillReceiveProps(nextProps) {
    this.displayNumberOfProducts(nextProps);
  }

  render() {
    return (
      <div className="products-options__page-display">
        Showing{" "}
        <strong>
          {this.state.first_product} - {this.state.last_product}
        </strong>{" "}
        of <strong>{this.props.products_total}</strong> Products
      </div>
    );
  }
}

export default PageDisplay;
