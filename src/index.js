import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pubsub } from "./components/pubsub.js";
import parserURI from "uri-parse-lib";
import styled from "styled-components";
import ProductsLoading from "./components/products_loading.js";
import ProductPagination from "./components/pagination.js";
import ProductListings from "./components/product_listings.js";
import ProductsPerPage from "./components/per_page.js";
import ProductSorting from "./components/product_sorting.js";
import ProductAggregations from "./components/aggregations.js";
import ProductsSearchTitle from "./components/products_search_title.js";
import ProductCompareComponent from "./components/product_compare.js";
import PageDisplay from "./components/page_display.js";
import { KeyboardArrowDown } from "material-ui-icons";

const ProductListingsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductListingsMobileButtons = styled.div`
  display: flex;
  margin-bottom: 1.125rem;

  > button,
  .products-options__sort {
    flex: 1;
  }

  > button {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem 0 1rem;
  }

  .sort-options {
    left: auto;
    right: -2px;
    top: 38px;
  }

  @media only screen and (min-width: 768px) {
    display: none;
  }
`;

const ProductFilters = styled.aside`
  display: none;
  width: 100%;

  &.product-filters--open {
    background-color: #fff;
    display: block;
    height: 100vh;
    left: 0;
    overflow-x: scroll;
    position: absolute;
    top: 0;
    width: 100vw;
    z-index: 10;
  }

  @media only screen and (min-width: 768px) {
    display: block;
    width: 260px;
  }

  @media only screen and (min-width: 1025px) {
    width: 310px;
  }
`;

const ProductsList = styled.main`
  flex: 1;
  @media only screen and (min-width: 768px) {
    margin-left: 1.5rem;
  }
`;

const ProductsOptions = styled.div`
  display: none;

  @media only screen and (min-width: 768px) {
    align-items: center;
    background-color: #f4f4f4;
    display: flex;
    height: 50px;
    justify-content: space-between;
    margin-bottom: 1.125rem;
    padding: 0 1rem;
  }
`;

const ProductsDisplayOptions = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-right: 0.25rem;

  @media only screen and (max-width: 1024px) and (orientation: portrait) {
    .products-options__page-display {
      display: none;
    }
  }
`;

class SearchViewComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      aggregations: [],
      applied_aggregates: {},
      loading: false,
      number_of_pages: 0,
      page: 1,
      per_page: 12,
      per_page_options: [12, 24, 48],
      sort: "",
      products: [],
      products_total: 0,
      q: this.props.config.searchTerm,
      query: {},
      productsToCompare: []
    };

    this.formatQuery = this.formatQuery.bind(this);
    this.freshSearch = this.freshSearch.bind(this);
    this.searchProducts = this.searchProducts.bind(this);

    // URL Parsing
    this.parseURL = this.parseURL.bind(this);
    this.parseURLAggregations = this.parseURLAggregations.bind(this);
    this.parseURLPageNumber = this.parseURLPageNumber.bind(this);
    this.parseURLPerPage = this.parseURLPerPage.bind(this);

    // Aggregations
    this.toggleAggregate = this.toggleAggregate.bind(this);
    this.resetAllAggregates = this.resetAllAggregates.bind(this);

    // Pagination
    this.setPage = this.setPage.bind(this);
    this.setPerPage = this.setPerPage.bind(this);
    this.validPageNumber = this.validPageNumber.bind(this);

    // Sorting
    this.setSort = this.setSort.bind(this);

    this.toggleFilters = this.toggleFilters.bind(this);

    // Favourites
    this.addToFavourites = this.addToFavourites.bind(this);

    //Compare
    this.addToCompare = this.addToCompare.bind(this);
  }

  toggleFilters() {
    const filters = document.querySelector(".product-filters");
    filters.classList.toggle("product-filters--open");
    document.body.classList.toggle("no-scroll");
  }

  freshSearch(first_page = true) {
    const page = first_page === true ? 1 : this.state.page;
    this.setState({ page }, () => {
      this.searchProducts();
    });
  }

  formatQuery() {
    const q =
      this.props.config.mode === "search" ? this.props.config.searchTerm : "*";

    let urlParameters = parserURI(window.location.search);
    let query = {
      q,
      per_page: this.state.per_page,
      page: this.state.page
    };

    if (this.state.sort !== "") {
      query["sort"] = this.state.sort;
    }

    if (this.props.mode === "category") {
      query["category"] = this.props.category_ids;
      query["force_category"] = true;
    }

    // TODO: Test / Implement
    if (this.props.mode === "brand") {
      query["brand"] = this.props.brand_id;
      query["force_brand"] = true;
    }

    for (const key of Object.keys(urlParameters.query)) {
      query[key] = urlParameters.query[key];
    }

    Object.keys(this.state.applied_aggregates).forEach(key => {
      query[key] = this.state.applied_aggregates[key];
    });

    return query;
  }

  setSort(value) {
    this.setState(
      {
        sort: value
      },
      () => {
        this.updateURLParam(value, "sort");
      }
    );
  }

  updateURLParam(value, param_name, perform_search = true) {
    let current_params =
      window.location.search !== ""
        ? window.location.search
        : window.location.pathname;
    const param = `${param_name}=${value}`;
    const param_regex = new RegExp(`[?&]${param_name}=([^&#]*)`);

    if (window.location.search === "") {
      current_params += `?${param}`;
    } else {
      current_params =
        param_regex.test(window.location.search) == true
          ? current_params.replace(param_regex, `&${param}`)
          : `${current_params}&${param}`;
    }

    if (current_params[0] === "&") {
      current_params = current_params.replace("&", "?");
    }

    history.pushState(null, null, current_params);
    if (perform_search) {
      this.parseURL();
    }
  }

  parseURL() {
    let urlParameters = parserURI(window.location.search);
    if (urlParameters.query.q !== "" || urlParameters.query.q !== undefined) {
      this.setState(
        {
          q: urlParameters.query.q,
          page: this.parseURLPageNumber(urlParameters.query),
          per_page: this.parseURLPerPage(urlParameters.query),
          sort: this.parseURLSorting(urlParameters.query)
        },
        () => {
          this.freshSearch(false);
        }
      );
    } else {
      this.setState({ error: true });
    }
  }

  parseURLAggregations(urlParameters) {
    let aggs = this.state.aggregations;
    this.setState({ applied_aggregates: {} }, () => {
      Object.keys(aggs).forEach(agg => {
        if (urlParameters[`${agg}[]`] !== undefined) {
          if (Array.isArray(urlParameters[`${agg}[]`])) {
            urlParameters[`${agg}[]`].forEach(agg_value => {
              this.toggleAggregate(agg, agg_value, false, false);
            });
          } else {
            this.toggleAggregate(agg, urlParameters[`${agg}[]`], false, false);
          }
        }
      });
    });
  }

  parseURLPageNumber(urlParameters) {
    return urlParameters.page !== undefined ? parseInt(urlParameters.page) : 1;
  }

  parseURLSorting(urlParameters) {
    return urlParameters.sort !== undefined ? urlParameters.sort : "";
  }

  parseURLPerPage(urlParameters) {
    let perPage =
      urlParameters.per_page !== undefined
        ? parseInt(urlParameters.per_page)
        : this.state.per_page;
    return this.state.per_page_options.includes(perPage) ? perPage : 24;
  }

  resetAllAggregates() {
    let current_params = window.location.search;
    Object.keys(this.state.aggregations).forEach(agg => {
      const param_array_regex = new RegExp(`[?&](${agg}[[]]=[^&#]*)`, "g");
      const param_regex = new RegExp(`[?&](${agg}=[^&#]*)`, "g");
      current_params = current_params.replace(param_array_regex, "");
      current_params = current_params.replace(param_regex, "");
    });

    history.pushState(null, null, current_params);
    this.parseURL();
  }

  toggleAggregate(
    agg_type,
    agg_value,
    perform_search = true,
    update_url = false
  ) {
    let formatted_key = agg_type.replace(/ /g, "_");
    const param_regex = new RegExp(`[?&](${formatted_key}\[]=${agg_value}*)`);
    let current = this.state.applied_aggregates;

    if (this.state.applied_aggregates[formatted_key] === undefined) {
      let applied = this.state.applied_aggregates;
      applied[formatted_key] = [agg_value];

      if (update_url) {
        this.addAggregateToURL(current, agg_value, formatted_key, true);
      }

      if (applied) {
        Object.keys(applied).forEach(key => {
          applied[key] = applied[key].filter((item, pos) => {
            return applied[key].indexOf(item) === pos;
          });
        });
      }

      this.setState(
        {
          applied_aggregates: applied
        },
        () => {
          if (perform_search) {
            this.freshSearch(false);
          }
        }
      );
    } else {
      current[formatted_key].includes(agg_value) === true
        ? this.removeAggregateFromURL(
            current,
            agg_value,
            formatted_key,
            update_url
          )
        : this.addAggregateToURL(current, agg_value, formatted_key, update_url);

      // Remove any empty values
      Object.keys(current).forEach(agg => {
        if (current[agg].length === 0) {
          delete current[agg];
        }
      });

      this.setState({ applied_aggregates: current }, () => {
        if (perform_search) {
          this.freshSearch(false);
        }
      });
    }
  }

  addAggregateToURL(current, agg_value, formatted_key, update_url) {
    if (update_url) {
      const current_params = `${
        window.location.search
      }&${formatted_key}[]=${agg_value}`;
      history.pushState(null, null, current_params);
    }
    current[formatted_key] = [...current[formatted_key], agg_value];
  }

  removeAggregateFromURL(current, agg_value, formatted_key, update_url) {
    if (update_url) {
      const param_regex = new RegExp(
        `[?&](${formatted_key}\[[]]=${agg_value}*)`
      );
      const current_params = window.location.search.replace(param_regex, "");
      history.pushState(null, null, current_params);
    }
    current[formatted_key] = current[formatted_key].filter(
      item => item !== agg_value
    );
  }

  validPageNumber() {
    return !(
      (this.state.page >
        Math.ceil(this.state.products_total / this.state.per_page) ||
        this.state.page <= 0 ||
        isNaN(this.state.page)) &&
      this.state.products_total > 0
    );
  }

  searchProducts() {
    this.setState({ loading: true });

    const query = this.formatQuery();

    axios({
      url: "/js_search",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      params: query
    })
      .then(response => {
        this.setState(
          {
            products_total: response.data.total,
            products: response.data.products,
            aggregations: response.data.aggregations,
            loading: false
          },
          () => {
            if (this.validPageNumber() === false) {
              this.setPage(1);
            }

            if (this.state.products_total === 0) {
              const er = new Error("Unable to find any products");
              return er;
            } else {
              let urlParameters = parserURI(window.location.search);
              this.parseURLAggregations(urlParameters.query);
              this.calculatePagination();
            }
          }
        );
      })
      .catch(response => {
        const er = new Error(response);
        return er;
      });
  }

  setPerPage(count) {
    this.updateURLParam(count, "per_page", false);
    this.updateURLParam(1, "page");
  }

  setPage(count) {
    this.setState({ page: count }, () => {
      this.updateURLParam(count, "page");
    });
  }

  addToFavourites(productId) {
    return productId;
  }

  addToCompare(product) {
    if (
      this.state.productsToCompare.length <= this.props.config.compareAmount
    ) {
      this.state.productsToCompare.push(product);
      let compareObj = {
        siteName: this.props.config.siteName,
        compare: this.state.productsToCompare
      };
      localStorage.setItem("productsToCompare", JSON.stringify(compareObj));
      pubsub.publish("PRODUCT-COMPARE-UPDATED", product);
    }
  }

  calculatePagination() {
    this.setState({
      number_of_pages: Math.ceil(
        this.state.products_total / this.state.per_page
      )
    });
  }

  componentDidMount() {
    this.parseURL();
    window.onpopstate = () => {
      this.parseURL();
    };
  }

  componentWillMount() {
    this.searchProducts();
    // const productsToCompare = JSON.parse(
    //   localStorage.getItem("productsToCompare")
    // );
    // pubsub.publish("PRODUCT-COMPARE-SHOW", productsToCompare);
  }

  render() {
    const showPagination =
      this.state.number_of_pages > 1 ? (
        <ProductPagination
          products_total={this.state.products_total}
          per_page={this.state.per_page}
          current_page={this.state.page}
          setPage={this.setPage}
          number_of_pages={this.state.number_of_pages}
        />
      ) : (
        ""
      );
    return (
      <React.Fragment>
        <ProductsSearchTitle
          mode={this.props.config.mode}
          title={this.props.title}
          q={this.state.q}
        />
        <ProductListingsWrapper className="container">
          <ProductsLoading loading={this.state.loading} />
          <ProductListingsMobileButtons>
            <button
              className="filter-toggle__button"
              onClick={this.toggleFilters}
            >
              Filters
              <KeyboardArrowDown />
            </button>
            <ProductSorting
              setSort={this.setSort}
              sorting_options={this.props.config.sorting_options}
            />
          </ProductListingsMobileButtons>
          <ProductFilters className="product-filters">
            <ProductAggregations
              aggregations={this.state.aggregations}
              applied_aggregates={this.state.applied_aggregates}
              toggleAggregate={this.toggleAggregate}
              resetAllAggregates={this.resetAllAggregates}
            />
          </ProductFilters>
          <ProductsList className="products-list">
            <ProductsOptions className="products-options">
              <ProductsDisplayOptions>
                <PageDisplay
                  current_page={this.state.page}
                  products_total={this.state.products_total}
                  per_page={this.state.per_page}
                />
                <ProductsPerPage
                  setPerPage={this.setPerPage}
                  per_page_options={this.state.per_page_options}
                  per_page={this.state.per_page}
                />
              </ProductsDisplayOptions>
              <ProductSorting
                setSort={this.setSort}
                sorting_options={this.props.config.sorting_options}
              />
            </ProductsOptions>
            {showPagination}
            <ProductListings
              products={this.state.products}
              data={this.props.config.data}
              config={this.props.config}
              addToFavourites={this.addToFavourites}
              addToCompare={this.addToCompare}
            />
            {showPagination}
          </ProductsList>
        </ProductListingsWrapper>
      </React.Fragment>
    );
  }
}

export default SearchViewComponent;
