/* ============================================================
   Lo'ma — Cart System
   Handles: cart state, sidebar, badge, add/remove/qty
   ============================================================ */
(function () {
  // ── State ─────────────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem('lomaCart') || '[]');

  function saveCart() {
    localStorage.setItem('lomaCart', JSON.stringify(cart));
  }

  function totalItems() {
    return cart.reduce((s, i) => s + i.qty, 0);
  }

  function totalPrice() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  function totalOriginal() {
    return cart.reduce((s, i) => s + i.originalPrice * i.qty, 0);
  }

  function totalSaved() {
    return totalOriginal() - totalPrice();
  }

  // ── Badge update ──────────────────────────────────────────
  function updateBadge() {
    const badges = document.querySelectorAll('#cartBadge');
    const count = totalItems();
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // ── Build sidebar HTML ─────────────────────────────────────
  function buildSidebar() {
    const existing = document.getElementById('cartSidebar');
    if (existing) existing.remove();

    const sidebar = document.createElement('div');
    sidebar.id = 'cartSidebar';
    sidebar.innerHTML = `
      <div class="cart-backdrop" id="cartBackdrop"></div>
      <aside class="cart-panel" id="cartPanel">
        <div class="cart-header">
          <div class="cart-title">
            <i class="fas fa-shopping-basket"></i>
            Your Cart
            ${totalItems() > 0 ? `<span class="cart-count-pill">${totalItems()}</span>` : ''}
          </div>
          <button class="cart-close-btn" id="cartCloseBtn"><i class="fas fa-times"></i></button>
        </div>

        <div class="cart-body">
          ${cart.length === 0 ? `
            <div class="cart-empty">
              <div class="cart-empty-icon"><i class="fas fa-shopping-basket"></i></div>
              <h3>Your cart is empty</h3>
              <p>Browse our returned meals and add something delicious!</p>
              <a href="return_meal.html" class="cart-browse-btn">Browse Meals</a>
            </div>
          ` : `
            <div class="cart-items">
              ${cart.map((item, idx) => `
                <div class="cart-item" data-idx="${idx}">
                  <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-restaurant"><i class="fas fa-store"></i> ${item.restaurant}</div>
                    <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                  <div class="cart-item-controls">
                    <button class="qty-btn minus" data-idx="${idx}"><i class="fas fa-minus"></i></button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn plus" data-idx="${idx}"><i class="fas fa-plus"></i></button>
                    <button class="cart-remove-btn" data-idx="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${cart.length > 0 ? `
          <div class="cart-footer">
            <div class="cart-summary">
              <div class="cart-summary-row"><span>Subtotal</span><span>$${totalPrice().toFixed(2)}</span></div>
              ${totalSaved() > 0 ? `<div class="cart-summary-row saving"><span><i class="fas fa-tag"></i> You save</span><span>-$${totalSaved().toFixed(2)}</span></div>` : ''}
              <div class="cart-summary-row delivery"><span>Delivery</span><span>$2.99</span></div>
              <div class="cart-summary-row total"><span>Total</span><span>$${(totalPrice() + 2.99).toFixed(2)}</span></div>
            </div>
            <a href="checkout.html" class="cart-checkout-btn">
              <i class="fas fa-lock"></i> Proceed to Checkout
              <span class="cart-checkout-amount">$${(totalPrice() + 2.99).toFixed(2)}</span>
            </a>
            <button class="cart-clear-btn" id="cartClearBtn">Clear all items</button>
          </div>
        ` : ''}
      </aside>
    `;
    document.body.appendChild(sidebar);

    // Events
    document.getElementById('cartBackdrop').onclick = closeSidebar;
    document.getElementById('cartCloseBtn').onclick = closeSidebar;

    const clearBtn = document.getElementById('cartClearBtn');
    if (clearBtn) clearBtn.onclick = () => { cart = []; saveCart(); rebuildSidebar(); updateBadge(); };

    sidebar.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        if (cart[idx].qty > 1) { cart[idx].qty--; } else { cart.splice(idx, 1); }
        saveCart(); rebuildSidebar(); updateBadge();
      };
    });
    sidebar.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        cart[idx].qty++;
        saveCart(); rebuildSidebar(); updateBadge();
      };
    });
    sidebar.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = +btn.dataset.idx;
        cart.splice(idx, 1);
        saveCart(); rebuildSidebar(); updateBadge();
      };
    });

    // Keyboard close
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { closeSidebar(); document.removeEventListener('keydown', escClose); }
    });
  }

  function rebuildSidebar() {
    const isOpen = document.getElementById('cartSidebar')?.querySelector('.cart-panel')?.classList.contains('open');
    buildSidebar();
    if (isOpen) openSidebar(false);
  }

  function openSidebar(rebuild = true) {
    if (rebuild) buildSidebar();
    requestAnimationFrame(() => {
      document.getElementById('cartSidebar').classList.add('open');
      document.getElementById('cartPanel').classList.add('open');
      document.getElementById('cartBackdrop').classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeSidebar() {
    const sb = document.getElementById('cartSidebar');
    const panel = document.getElementById('cartPanel');
    const bd = document.getElementById('cartBackdrop');
    if (!sb) return;
    panel?.classList.remove('open');
    bd?.classList.remove('open');
    sb?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    const sb = document.getElementById('cartSidebar');
    if (sb && sb.classList.contains('open')) { closeSidebar(); } else { openSidebar(); }
  }

  // ── Add to cart ───────────────────────────────────────────
  function addToCart(item) {
    const existing = cart.find(i => i.name === item.name && i.restaurant === item.restaurant);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    saveCart();
    updateBadge();
    showAddFeedback(item.name);
  }

  function showAddFeedback(name) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${name}</span> added to cart`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 2400);
  }

  // ── Wire up Add to Cart buttons ───────────────────────────
  function wireButtons() {
    document.querySelectorAll('.add-btn, .add-to-cart-btn').forEach(btn => {
      if (btn.dataset.cartWired) return;
      btn.dataset.cartWired = '1';
      btn.addEventListener('click', function () {
        const card = this.closest('.meal-card') || this.closest('.card');
        if (!card) return;
        const name = card.querySelector('h3')?.textContent?.trim() || 'Meal';
        const restaurant = card.querySelector('.restaurant')?.textContent?.replace(/^\s*\S+\s*/,'').trim() || 'Lo\'ma';
        const newPriceEl = card.querySelector('.new-price') || card.querySelector('.price');
        const oldPriceEl = card.querySelector('.old-price');
        const price = parseFloat((newPriceEl?.textContent || '0').replace('$', '')) || 0;
        const originalPrice = parseFloat((oldPriceEl?.textContent || newPriceEl?.textContent || '0').replace('$', '')) || price;
        addToCart({ name, restaurant, price, originalPrice });

        // button feedback
        const origText = this.textContent;
        this.innerHTML = '<i class="fas fa-check"></i> Added!';
        this.style.background = 'var(--green-deep)';
        setTimeout(() => {
          this.textContent = origText;
          this.style.background = '';
        }, 1500);
      });
    });
  }

  // ── Inject CSS ────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cartStyles')) return;
    const s = document.createElement('style');
    s.id = 'cartStyles';
    s.textContent = `
      /* Cart icon in navbar */
      .cart-icon-btn {
        position: relative;
        width: 40px; height: 40px;
        border-radius: 10px;
        background: var(--bg);
        border: 1.5px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        color: var(--text);
        font-size: 1rem;
        transition: var(--transition);
        cursor: pointer;
        text-decoration: none;
        flex-shrink: 0;
      }
      .cart-icon-btn:hover { background: var(--green-light); border-color: var(--green-mid); color: var(--green-mid); }
      .cart-badge {
        position: absolute;
        top: -6px; right: -6px;
        width: 20px; height: 20px;
        border-radius: 50%;
        background: var(--orange);
        color: #fff;
        font-size: 0.68rem;
        font-weight: 700;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid var(--white);
        animation: badgePop 0.3s cubic-bezier(.4,0,.2,1);
      }
      @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

      /* Sidebar backdrop */
      #cartSidebar { position: fixed; inset: 0; z-index: 8000; pointer-events: none; }
      #cartSidebar.open { pointer-events: all; }
      .cart-backdrop {
        position: absolute; inset: 0;
        background: rgba(10,20,12,0.45);
        backdrop-filter: blur(3px);
        opacity: 0; transition: opacity 0.32s ease;
      }
      .cart-backdrop.open { opacity: 1; }

      /* Cart panel */
      .cart-panel {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: 400px;
        max-width: 95vw;
        background: var(--white);
        display: flex; flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        box-shadow: -8px 0 40px rgba(0,0,0,0.15);
      }
      .cart-panel.open { transform: translateX(0); }

      .cart-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
      }
      .cart-title {
        display: flex; align-items: center; gap: 10px;
        font-family: var(--font-display);
        font-size: 1.2rem; font-weight: 800;
        color: var(--dark);
      }
      .cart-title i { color: var(--green-mid); }
      .cart-count-pill {
        background: var(--orange); color: #fff;
        font-size: 0.72rem; font-weight: 700;
        padding: 2px 8px; border-radius: 50px;
        font-family: var(--font-body);
      }
      .cart-close-btn {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: var(--bg); border: 1px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        color: var(--text-muted); font-size: 0.9rem;
        cursor: pointer; transition: var(--transition);
      }
      .cart-close-btn:hover { background: #fde8e8; color: #e05252; border-color: #e05252; }

      .cart-body { flex: 1; overflow-y: auto; padding: 20px 24px; }

      /* Empty state */
      .cart-empty { text-align: center; padding: 60px 20px; }
      .cart-empty-icon {
        width: 80px; height: 80px;
        border-radius: 50%;
        background: var(--green-light);
        color: var(--green-mid);
        font-size: 2rem;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      }
      .cart-empty h3 { font-size: 1.1rem; color: var(--dark); margin-bottom: 8px; }
      .cart-empty p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; }
      .cart-browse-btn {
        display: inline-block;
        padding: 10px 24px;
        background: var(--green-mid); color: #fff;
        border-radius: 8px; font-weight: 700; font-size: 0.9rem;
        text-decoration: none; transition: var(--transition);
      }
      .cart-browse-btn:hover { background: var(--green-deep); }

      /* Cart items */
      .cart-items { display: flex; flex-direction: column; gap: 16px; }
      .cart-item {
        display: flex; align-items: center; justify-content: space-between; gap: 14px;
        padding: 14px 16px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 12px;
        transition: var(--transition);
      }
      .cart-item:hover { border-color: var(--green-mid); box-shadow: var(--shadow-sm); }
      .cart-item-info { flex: 1; min-width: 0; }
      .cart-item-name { font-weight: 700; font-size: 0.93rem; color: var(--dark); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .cart-item-restaurant { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
      .cart-item-restaurant i { margin-right: 4px; }
      .cart-item-price { font-size: 1rem; font-weight: 800; color: var(--green-deep); }
      .cart-item-controls { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
      .qty-btn {
        width: 28px; height: 28px;
        border-radius: 8px;
        border: 1.5px solid var(--border);
        background: var(--white);
        color: var(--text);
        font-size: 0.7rem;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: var(--transition);
      }
      .qty-btn:hover { background: var(--green-light); border-color: var(--green-mid); color: var(--green-mid); }
      .qty-val { font-weight: 700; font-size: 0.95rem; min-width: 22px; text-align: center; color: var(--dark); }
      .cart-remove-btn {
        width: 28px; height: 28px;
        border-radius: 8px;
        border: 1.5px solid var(--border);
        background: var(--white);
        color: var(--text-muted);
        font-size: 0.7rem;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: var(--transition);
        margin-left: 2px;
      }
      .cart-remove-btn:hover { background: #fde8e8; border-color: #e05252; color: #e05252; }

      /* Footer */
      .cart-footer { padding: 20px 24px; border-top: 1px solid var(--border); flex-shrink: 0; }
      .cart-summary { margin-bottom: 16px; }
      .cart-summary-row {
        display: flex; justify-content: space-between; align-items: center;
        padding: 6px 0;
        font-size: 0.9rem; color: var(--text-muted);
      }
      .cart-summary-row.saving { color: var(--green-mid); font-weight: 600; }
      .cart-summary-row.saving i { margin-right: 6px; }
      .cart-summary-row.delivery { color: var(--text-muted); }
      .cart-summary-row.total {
        font-size: 1.05rem; font-weight: 800; color: var(--dark);
        border-top: 1px solid var(--border);
        margin-top: 8px; padding-top: 12px;
      }
      .cart-checkout-btn {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 20px;
        background: var(--green-mid); color: #fff;
        border-radius: 12px; font-weight: 700; font-size: 0.95rem;
        text-decoration: none; transition: var(--transition);
        width: 100%;
      }
      .cart-checkout-btn:hover { background: var(--green-deep); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(46,139,74,0.35); }
      .cart-checkout-amount { font-size: 0.9rem; opacity: 0.9; }
      .cart-clear-btn {
        width: 100%; margin-top: 10px;
        background: none; border: none;
        color: var(--text-muted); font-size: 0.85rem;
        cursor: pointer; padding: 6px;
        transition: color 0.2s;
        font-family: var(--font-body);
      }
      .cart-clear-btn:hover { color: #e05252; }

      /* Toast */
      .cart-toast {
        position: fixed;
        bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
        background: var(--dark);
        color: #fff;
        padding: 12px 22px;
        border-radius: 50px;
        font-size: 0.88rem;
        font-weight: 600;
        display: flex; align-items: center; gap: 10px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      }
      .cart-toast i { color: var(--green-bright); font-size: 1rem; }
      .cart-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    `;
    document.head.appendChild(s);
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    injectStyles();
    updateBadge();
    wireButtons();

    // Observe for dynamically added cards
    const observer = new MutationObserver(() => wireButtons());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally
  window.lomaCart = {
    add: addToCart,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    getCart: () => cart,
    getTotal: totalPrice,
    getTotalWithDelivery: () => totalPrice() + 2.99,
  };
})();
