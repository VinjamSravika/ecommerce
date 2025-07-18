// 🔒 Redirect to login if not authenticated
function checkAuth() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "login.html";
  }
}

// 📝 Signup
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username]) {
      alert("User already exists!");
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful!");
      window.location.href = "login.html";
    }
  });
}

// 🔐 Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[username] && users[username] === password) {
      localStorage.setItem("loggedInUser", username);
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials!");
    }
  });
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// 🛒 Cart & Wishlist Setup
let cart = [];
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  setupCart();
});

// 🛒 Setup cart and wishlist buttons
function setupCart() {
  const cartButtons = document.querySelectorAll(".add-to-cart");
  const wishlistButtons = document.querySelectorAll(".add-to-wishlist");

  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      const name = item.getAttribute("data-name");
      const price = parseFloat(item.getAttribute("data-price"));

      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCart();
    });
  });

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      const name = item.getAttribute("data-name");

      if (!wishlist.includes(name)) {
        wishlist.push(name);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist(wishlist);
        alert(`${name} added to wishlist!`);
      } else {
        alert(`${name} is already in wishlist.`);
      }
    });
  });

  updateCart();
  renderWishlist(wishlist);
}

// 🛒 Update cart UI
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.quantity}x ${item.name} - ₹${(item.quantity * item.price).toFixed(2)}
      <button onclick="removeFromCart('${item.name}')">Remove</button>
    `;
    cartItems.appendChild(li);
    total += item.quantity * item.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

// 🗑️ Remove from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

// ✅ Place order and redirect
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("orderTotal", document.getElementById("cart-total").textContent);
  window.location.href = "order.html";
}

// 💖 Render wishlist with remove buttons
function renderWishlist(wishlistedProducts) {
  const wishlistElement = document.getElementById('wishlist-items');
  wishlistElement.innerHTML = ''; // Clear existing items

  wishlistedProducts.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = name + ' ';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '❌';
    removeBtn.className = 'remove-wishlist-btn';

    removeBtn.addEventListener('click', () => {
      // Remove item from wishlist array
      wishlistedProducts.splice(index, 1);
      // Update localStorage
      localStorage.setItem('wishlist', JSON.stringify(wishlistedProducts));
      // Re-render wishlist UI
      renderWishlist(wishlistedProducts);
    });

    li.appendChild(removeBtn);
    wishlistElement.appendChild(li);
  });
}
