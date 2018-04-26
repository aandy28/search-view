import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProgressiveImageLoad from "./progressive_image_load";
import {
  FavoriteBorder as FavouriteBorder,
  Favorite as Favourite,
  RadioButtonChecked,
  RadioButtonUnchecked
} from "material-ui-icons";

const ProductItem = styled.div`
  border: 1px solid #dfdfdf;
  display: flex;
  flex-basis: calc((100% / 2) - 0.25rem);
  flex-direction: column;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.5rem;

  &:nth-of-type(2n) {
    margin-right: 0;
  }

  @media only screen and (min-width: 1025px) {
    flex-basis: calc((100% / 3) - 0.6666rem);
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 1rem;

    &:nth-of-type(2n) {
      margin-right: 1rem;
    }

    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }
`;

const AddToFavourites = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;

  .product__add-to-fav-icon {
    color: #2ecc40;

    &:hover {
      cursor: pointer;
    }
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0;

  .product__title__link {
    color: #363636;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  + div {
    margin-top: 1rem;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
`;

const ProductOptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Compare = styled.div`
  align-items: center;
  display: flex;

  svg {
    height: 14px;
    margin-right: 0.25rem;
    width: 14px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Price = styled.div`
  color: #2ecc40;
  font-size: 1.375rem;
  margin-top: 1.25rem;

  @media only screen and (min-width: 768px) {
    margin-top: 0;
  }
`;

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentFlexDirection: this.props.contentFlexDirection,
      addedToFavourite: false,
      addedToCompare: false
    };

    this.addToFavourites = this.addToFavourites.bind(this);
  }

  addToFavourites(productId) {
    this.props.addToFavourites(productId);
    this.setState({
      addedToFavourite: !this.state.addedToFavourite
    });
  }
  addToCompare(product) {
    this.props.addToCompare(product);
    this.setState({
      addedToCompare: !this.state.addedToCompare
    });
  }

  render() {
    const fullSize =
      this.props.data.image_medium == ":placeholder"
        ? "http://via.placeholder.com/400x400"
        : this.props.data.image_medium;
    const thumb =
      this.props.data.image_thumbnail == ":placeholder"
        ? "http://via.placeholder.com/60x60"
        : this.props.data.image_thumbnail;

    const addToFav =
      this.props.config.showAddToFavourites === true ? (
        <AddToFavourites className="product__add-to-fav">
          {this.state.addedToFavourite ? (
            <Favourite
              className="product__add-to-fav-icon product__add-to-fav-icon--added"
              onClick={this.addToFavourites.bind(this, this.props.data.id)}
            />
          ) : (
            <FavouriteBorder
              className="product__add-to-fav-icon"
              onClick={this.addToFavourites.bind(this, this.props.data.id)}
            />
          )}
        </AddToFavourites>
      ) : (
        ""
      );

    const addToCompare = this.state.addedToCompare ? (
      <RadioButtonChecked />
    ) : (
      <RadioButtonUnchecked />
    );
    return (
      <ProductItem className="product">
        {addToFav}
        <a href={"/products/" + this.props.data.id}>
          <img src={fullSize} className="preview" alt="image" />
        </a>
        <ProductDetails className="product-details">
          <ProductTitle className="product__title">
            <a
              className="product__title__link"
              href={"/products/" + this.props.data.id}
            >
              {this.props.data.description}
            </a>
          </ProductTitle>
          {this.props.config.showCompare ||
          this.props.config.showPrice ||
          this.props.config.showAddToBasket ? (
            <ProductInfo>
              {this.props.config.showCompare || this.props.config.showPrice ? (
                <ProductOptions className="product-options">
                  {this.props.config.showCompare ? (
                    <Compare
                      className="product-options__compare"
                      onClick={this.addToCompare.bind(this, this.props.data)}
                    >
                      {addToCompare}
                      <span>Compare</span>
                    </Compare>
                  ) : null}
                  {this.props.config.showPrice ? (
                    <Price className="product-options__price">
                      &pound;59.99
                    </Price>
                  ) : null}
                </ProductOptions>
              ) : (
                ""
              )}
              {this.props.config.showAddToBasket ? (
                <button className="btn--full-width product__add-to-basket">
                  Add to Basket
                </button>
              ) : (
                ""
              )}
            </ProductInfo>
          ) : (
            ""
          )}
        </ProductDetails>
      </ProductItem>
    );
  }
}

export default Product;
