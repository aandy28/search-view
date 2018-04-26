import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Pagination = styled.ul`
  display: flex;
  margin-bottom: 1.25rem;

  @media only screen and (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const PaginationLink = styled.li`
  align-items: center;
  color: #656565;
  display: flex;
  height: 30px;
  justify-content: center;
  width: 30px;

  &:first-child {
    margin-right: 0.5rem;
    width: auto;
  }

  &:last-child {
    margin-left: 0.5rem;
    width: auto;
  }

  &.products-pagination__link--selected {
    background-color: #2ecc40;
    color: #fff;
    padding: 0.5rem;

    &:hover {
      color: #fff;
    }
  }

  &:hover {
    color: #2ecc40;
    cursor: pointer;
    text-decoration: underline;
  }
`;

class ProductPagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pagination_links_to_show: 4,
      page_input_error: false
    };

    this.goToPage = this.goToPage.bind(this);
  }

  goToPage(e) {
    if (e.key === "Enter") {
      let inputNumber = parseInt(e.target.value);
      if (inputNumber >= 1 && inputNumber <= this.props.number_of_pages) {
        this.props.setPage(inputNumber, true);
        this.setState({
          page_input_error: false
        });
      } else {
        this.setState({
          page_input_error: true
        });
      }
    }
  }

  render() {
    let paginationLinks = [];

    for (let i = 0; i < this.props.number_of_pages; i++) {
      let page = i + 1;
      paginationLinks.push(
        <PaginationLink
          className={
            "products-pagination__link " +
            (this.props.current_page == page
              ? "products-pagination__link--selected"
              : "")
          }
          key={i}
          onClick={e => {
            e.preventDefault();
            this.props.setPage(page, true);
          }}
        >
          {page}
        </PaginationLink>
      );
    }

    paginationLinks =
      this.props.number_of_pages - 1 > this.state.pagination_links_to_show
        ? paginationLinks.slice(
            this.props.current_page - 1,
            this.props.current_page + this.state.pagination_links_to_show
          )
        : paginationLinks;

    const first_link =
      this.props.current_page !== 1 && this.props.number_of_pages > 3 ? (
        <PaginationLink
          className="pagination--link"
          key={"first-link"}
          onClick={e => {
            e.preventDefault();
            this.props.setPage(1, true);
          }}
        >
          1 ..
        </PaginationLink>
      ) : (
        ""
      );

    const last_link =
      this.props.current_page !== 0 &&
      this.props.number_of_pages > 3 &&
      this.props.current_page !== this.props.number_of_pages ? (
        <PaginationLink
          className="product-pagination__link"
          key={"last-link"}
          onClick={e => {
            e.preventDefault();
            this.props.setPage(this.props.number_of_pages, true);
          }}
        >
          .. {this.props.number_of_pages}
        </PaginationLink>
      ) : (
        ""
      );
    return (
      <Pagination className="no-bullet products-pagination">
        {paginationLinks.length > 0 ? (
          <React.Fragment>
            {this.props.current_page !== 1 ? (
              <PaginationLink
                className="products-pagination__link"
                key={"previous-link"}
                onClick={e => {
                  e.preventDefault();
                  if (this.props.current_page > 1) {
                    this.props.setPage(this.props.current_page - 1, true);
                  }
                }}
              >
                Prev
              </PaginationLink>
            ) : (
              ""
            )}

            {first_link}

            {paginationLinks}

            {last_link}

            {this.props.current_page !== this.props.number_of_pages ? (
              <PaginationLink
                className="products-pagination__link"
                key={"next-link"}
                onClick={e => {
                  e.preventDefault();
                  if (this.props.current_page !== this.props.number_of_pages) {
                    this.props.setPage(this.props.current_page + 1, true);
                  }
                }}
              >
                Next
              </PaginationLink>
            ) : (
              ""
            )}
          </React.Fragment>
        ) : (
          ""
        )}
      </Pagination>
    );
  }
}

export default ProductPagination;
