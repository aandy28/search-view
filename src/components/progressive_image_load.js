import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

function animationFade() {
  const progressiveReveal = keyframes`
    0% { transform: scale(1.05); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  `;
  return progressiveReveal;
}
// Here we create a component that will rotate everything we pass in over two seconds

// Use .withComponent together with .extend to both change the tag and use additional styles
const Progressive = styled.a`
  position: relative;
  display: block;
  overflow: hidden;
  outline: none;

  img {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    border: 0 none;
  }

  img.preview {
    filter: blur(2vw);
    transform: scale(1.05);
  }

  img.reveal {
    position: absolute;
    left: 0;
    top: 0;
    will-change: transform, opacity;
    animation: ${animationFade()} 1s ease-out;
  }
`;

let pItem = document.getElementsByClassName("progressive replace"),
  pCount,
  timer;

class ProgressiveImageLoad extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.inView = this.inView.bind(this);
    this.scroller = this.scroller.bind(this);
    this.addImg = this.addImg.bind(this);
    this.loadFullImage = this.loadFullImage.bind(this);
  }

  scroller() {
    let _this = this;
    timer =
      timer ||
      setTimeout(function() {
        timer = null;
        _this.inView(pItem);
      }, 50);
  }

  inView(pItem) {
    let _this = this;

    if (pItem.length)
      requestAnimationFrame(function() {
        let wT = window.pageYOffset,
          wB = wT + window.innerHeight,
          cRect,
          pT,
          pB,
          p = 0;
        while (p < pItem.length) {
          cRect = pItem[p].getBoundingClientRect();
          pT = wT + cRect.top;
          pB = pT + cRect.height;

          if (wT < pB && wB > pT) {
            _this.loadFullImage(pItem[p]);
            pItem[p].classList.remove("replace");
          } else p++;
        }

        pCount = pItem.length;
      });
  }

  loadFullImage(item) {
    let href = item && (item.getAttribute("data-full-size") || item.href);
    if (!href) return;

    // load image
    let img = new Image();
    if (item.dataset) {
      img.srcset = item.dataset.srcset || "";
      img.sizes = item.dataset.sizes || "";
    }
    img.src = href;
    img.className = "reveal";
    if (img.complete) this.addImg(item, href, img);
    else img.onload = this.addImg(item, href, img);
  }

  addImg(item, href, img) {
    requestAnimationFrame(function() {
      // disable click
      if (href === item.href) {
        item.style.cursor = "default";
        item.addEventListener(
          "click",
          function(e) {
            e.preventDefault();
          },
          false
        );
      }

      // add full image
      item.appendChild(img).addEventListener("animationend", function(e) {
        // remove preview image

        let pImg = item.querySelector && item.querySelector("img.preview");
        if (pImg) {
          e.target.alt = pImg.alt || "";
          item.removeChild(pImg);
          e.target.classList.remove("reveal");
        }
      });
    });
  }
  componentDidMount() {
    const _this = this;
    if (
      window.addEventListener &&
      window.requestAnimationFrame &&
      document.getElementsByClassName
    )
      window.addEventListener("load", function() {
        // start

        // scroll and resize events
        window.addEventListener("scroll", _this.scroller.bind(_this), false);
        window.addEventListener("resize", _this.scroller.bind(_this), false);

        // DOM mutation observer
        if (MutationObserver) {
          let observer = new MutationObserver(function() {
            if (pItem.length !== pCount) _this.inView.bind(_this);
          });
          observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            characterData: true
          });
        }

        // initial check
        _this.inView;
      });
  }
  render() {
    return (
      <Progressive
        href={this.props.url}
        data-full-size={this.props.full_size}
        className="progressive replace"
      >
        <img src={this.props.thumbnail} className="preview" alt="image" />
      </Progressive>
    );
  }
}

export default ProgressiveImageLoad;
