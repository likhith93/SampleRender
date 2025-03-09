
      // Shopping cart
      let cart = [];

      // DOM elements
      const productsContainer = document.getElementById("productsContainer");
      const searchInput = document.getElementById("searchInput");
      const searchBtn = document.getElementById("searchBtn");
      const cartCountElement = document.getElementById("cartCount");
      const categoryButtons = document.querySelectorAll(".category-btn");
      const cartItemsContainer = document.getElementById("cartItems");
      const cartTotalElement = document.getElementById("cartTotal");

      // Display products
      function displayProducts(productsToShow) {
        productsContainer.innerHTML = "";

        if (productsToShow.length === 0) {
          productsContainer.innerHTML =
            '<div class="no-results">No products found matching your search.</div>';
          return;
        }

        productsToShow.forEach((product) => {
          const productCard = document.createElement("div");
          productCard.className = "product-card";

          // Generate star rating HTML
          const stars = Array(5)
            .fill("")
            .map((_, index) => {
              return `<span class="star">${
                index < Math.floor(product.rating) ? "★" : "☆"
              }</span>`;
            })
            .join("");

          // Determine category class for color
          const categoryClass = `${product.category}-category`;

          productCard.innerHTML = `
                    <img src="${product.image}" alt="${
            product.title
          }" class="product-image">
                    <div class="product-info">
                        <div class="product-category ${categoryClass}">${
            product.category
          }</div>
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price"><span class="currency">$</span>${product.price.toFixed(
                          2
                        )}</div>
                        <div class="product-rating">
                            ${stars}
                            <span>(${product.rating})</span>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" data-id="${
                              product.id
                            }">-</button>
                            <span class="quantity-display" id="quantity-${
                              product.id
                            }">1</span>
                            <button class="quantity-btn increase" data-id="${
                              product.id
                            }">+</button>
                        </div>
                        <button class="add-to-cart" data-id="${
                          product.id
                        }">Add to Cart</button>
                    </div>
                `;

          productsContainer.appendChild(productCard);
        });

        // Add event listeners for quantity controls
        document.querySelectorAll(".quantity-btn").forEach((button) => {
          button.addEventListener("click", handleQuantityChange);
        });

        // Add event listeners to Add to Cart buttons
        document.querySelectorAll(".add-to-cart").forEach((button) => {
          button.addEventListener("click", addToCart);
        });
      }

      // Filter products by category
      function filterProductsByCategory(category) {
        return category === "all"
          ? products
          : products.filter((product) => product.category === category);
      }

      // Filter products by search term
      function filterProductsBySearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        return products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Add to cart function
      function addToCart(e) {
        const productId = parseInt(e.target.getAttribute("data-id"));
        const product = products.find((p) => p.id === productId);
        const quantity = parseInt(
          document.getElementById(`quantity-${productId}`).textContent
        );

        if (product) {
          // Check if product is already in cart
          const existingItem = cart.find((item) => item.id === productId);

          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            cart.push({
              ...product,
              quantity: quantity,
            });
          }

          updateCartCount();
          updateCartDropdown();

          // Reset quantity to 1 after adding to cart
          document.getElementById(`quantity-${productId}`).textContent = "1";

          // Animation effect
          e.target.textContent = "Added! ✓";
          e.target.style.backgroundColor = "#00bfff";

          setTimeout(() => {
            e.target.textContent = "Add to Cart";
            e.target.style.backgroundColor = "#ff7b00";
          }, 1000);
        }
      }

      // Update cart count
      function updateCartCount() {
        const totalItems = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        cartCountElement.textContent = totalItems;

        // Add animation effect
        cartCountElement.classList.add("pulse");
        setTimeout(() => {
          cartCountElement.classList.remove("pulse");
        }, 300);
      }

      // Update cart dropdown
      function updateCartDropdown() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
          cartItemsContainer.innerHTML =
            '<div class="cart-empty">Your cart is empty</div>';
          cartTotalElement.innerHTML = "<span>Total:</span><span>$0.00</span>";
          return;
        }

        let totalPrice = 0;

        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          totalPrice += itemTotal;

          const cartItemElement = document.createElement("div");
          cartItemElement.className = "cart-item fade-in";
          cartItemElement.style.animationDelay = `${index * 0.05}s`;
          cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${
            item.title
          }" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(
                          2
                        )}</div>
                        <div class="cart-item-quantity">Qty: ${
                          item.quantity
                        }</div>
                    </div>
                `;

          cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotalElement.innerHTML = `
                <span>Total:</span>
                <span>$${totalPrice.toFixed(2)}</span>
            `;
      }

      // Event listeners
      searchBtn.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim();
        const filteredProducts = filterProductsBySearch(searchTerm);
        displayProducts(filteredProducts);

        // Reset category buttons
        categoryButtons.forEach((btn) => btn.classList.remove("active"));
        document.querySelector('[data-category="all"]').classList.add("active");
      });

      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          searchBtn.click();
        }
      });

      categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // Update active button
          categoryButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // Filter products
          const category = button.getAttribute("data-category");
          const filteredProducts = filterProductsByCategory(category);
          displayProducts(filteredProducts);

          // Clear search
          searchInput.value = "";
        });
      });

      // Add this new function to handle quantity changes
      function handleQuantityChange(e) {
        const productId = e.target.getAttribute("data-id");
        const quantityDisplay = document.getElementById(
          `quantity-${productId}`
        );
        let quantity = parseInt(quantityDisplay.textContent);

        if (e.target.classList.contains("increase")) {
          quantity = Math.min(quantity + 1, 99); // Maximum 99 items
        } else {
          quantity = Math.max(quantity - 1, 1); // Minimum 1 item
        }

        quantityDisplay.textContent = quantity;
      }

    // Initialize cart dropdown
    updateCartDropdown();

    // Initial display
    displayProducts(products);
