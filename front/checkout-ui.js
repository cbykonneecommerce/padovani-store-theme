window.addEventListener("DOMContentLoaded", (e) => {
  const App = {
    removeWidthHeader() {
      if (
        document.querySelector("#checkoutMainContainer > div:nth-child(10)")
      ) {
        document.querySelector(
          "#checkoutMainContainer > div:nth-child(10)"
        ).className = "container-header";
        document
          .querySelector("#checkoutMainContainer > div:nth-child(10)")
          .insertAdjacentHTML(
            "afterend",
            '<header class="main-header-custom"></header>'
          );
      }
    },
    appendStyledHead() {
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href =
        "https://fonts.googleapis.com/css2?family=Exo+2:wght@100;300;500;700;800;900&display=swap";
      document.head.append(linkElement);
    },
  };

  setTimeout(() => {
    App.removeWidthHeader();
    App.appendStyledHead();
  }, 1000);
});

var resizeImages = function () {
  setTimeout(function () {
    document.querySelectorAll(".product-item img").forEach(function (img) {
      img.src = img.src.replace("-55-55", "-120-120");
    });
  }, 2000);
};

var changeLocaleCep = function () {
  if (window.innerWidth > 1024) {
    var changeCep = setInterval(function () {
      $(".full-cart .cart-template-holder .cart-more-options").addClass(
        "correct"
      );
      if (
        $(".full-cart .summary-template-holder .cart-more-options.correct")
          .length == 0
      ) {
        $(
          ".full-cart .cart-template-holder .cart-more-options.correct"
        ).prependTo(".full-cart .summary-template-holder");
      }
    }, 500);

    setTimeout(function () {
      if (
        $(".full-cart .summary-template-holder .cart-more-options.correct")
          .length > 0
      ) {
        clearInterval(changeCep);
      }
    }, 5000);
  }
};

$("body").on("click", function () {
  changeLocaleCep();
});

$(window).on(
  "hashchange load orderFormUpdated.vtex",
  function (evt, orderForm) {
    changeLocaleCep();
    resizeImages();
  }
);
