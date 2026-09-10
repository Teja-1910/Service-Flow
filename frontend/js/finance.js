/**
 * ==========================================================================
 * SMARTSHOP – FINANCIAL SERVICES & EMI CALCULATOR JAVASCRIPT
 * Smart Demo Wallet, Interactive EMI Formula & Transaction Ledger
 * ==========================================================================
 */

function initFinancePage() {
  loadWalletData();
  calculateEMI();
  loadTransactionsTable();
}

// Load Wallet balance & stats
function loadWalletData() {
  const balance = parseFloat(localStorage.getItem('smartshop_wallet_balance') || '5000');
  const balEl = document.getElementById('walletBalanceDisplay');
  if (balEl) balEl.textContent = formatINR(balance);

  const user = getCurrentUser();
  if (user && document.getElementById('walletUserEmail')) {
    document.getElementById('walletUserEmail').textContent = user.email;
  }
}

// Add Money to Wallet (Demo Top-up)
function addMoneyToWallet(amount) {
  let balance = parseFloat(localStorage.getItem('smartshop_wallet_balance') || '5000');
  balance += amount;
  localStorage.setItem('smartshop_wallet_balance', balance.toString());

  // Record Transaction
  const transactions = JSON.parse(localStorage.getItem('smartshop_transactions') || '[]');
  transactions.unshift({
    id: "TXN_TOP_" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    date: new Date().toLocaleDateString('en-IN'),
    type: "Wallet Top-up",
    amount: amount,
    status: "Success"
  });
  localStorage.setItem('smartshop_transactions', JSON.stringify(transactions));

  // Reward 5% cash points bonus
  const bonusPts = Math.floor(amount * 0.05);
  let pts = parseInt(localStorage.getItem('smartshop_rewards_points') || '1250');
  pts += bonusPts;
  localStorage.setItem('smartshop_rewards_points', pts.toString());

  showToast("Wallet Loaded!", `Added ${formatINR(amount)} to your Smart Wallet! +${bonusPts} Bonus Points earned.`, "success");
  
  loadWalletData();
  loadTransactionsTable();

  const modalEl = document.getElementById('addMoneyModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

function handleCustomTopup(e) {
  e.preventDefault();
  const input = document.getElementById('customTopupAmount');
  const val = parseFloat(input.value);
  if (val && val > 0) {
    addMoneyToWallet(val);
    input.value = '';
  }
}

// ==========================================================================
// INTERACTIVE EMI CALCULATOR
// ==========================================================================
function calculateEMI() {
  const priceInput = document.getElementById('emiProductPrice');
  const downPaymentInput = document.getElementById('emiDownPayment');
  const interestInput = document.getElementById('emiInterestRate');
  const durationInput = document.getElementById('emiDurationMonths');

  if (!priceInput || !downPaymentInput || !interestInput || !durationInput) return;

  const totalPrice = parseFloat(priceInput.value) || 0;
  const downPayment = parseFloat(downPaymentInput.value) || 0;
  const annualInterestRate = parseFloat(interestInput.value) || 0;
  const months = parseInt(durationInput.value) || 12;

  // Update live labels
  document.getElementById('emiProductPriceLabel').textContent = formatINR(totalPrice);
  document.getElementById('emiDownPaymentLabel').textContent = formatINR(downPayment);
  document.getElementById('emiInterestRateLabel').textContent = `${annualInterestRate}% p.a.`;
  document.getElementById('emiDurationLabel').textContent = `${months} Months`;

  const principal = Math.max(0, totalPrice - downPayment);
  const monthlyRate = (annualInterestRate / 12) / 100;

  let emi = 0;
  let totalInterest = 0;
  let totalPayable = principal;

  if (principal > 0 && months > 0) {
    if (monthlyRate > 0) {
      // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
      const powerFactor = Math.pow(1 + monthlyRate, months);
      emi = (principal * monthlyRate * powerFactor) / (powerFactor - 1);
      totalPayable = emi * months;
      totalInterest = totalPayable - principal;
    } else {
      emi = principal / months;
      totalPayable = principal;
      totalInterest = 0;
    }
  }

  document.getElementById('emiMonthlyAmount').textContent = formatINR(Math.round(emi));
  document.getElementById('emiPrincipalAmount').textContent = formatINR(principal);
  document.getElementById('emiTotalInterestAmount').textContent = formatINR(Math.round(totalInterest));
  document.getElementById('emiTotalPayableAmount').textContent = formatINR(Math.round(totalPayable));

  // Progress Bar Ratio
  const principalPercent = totalPayable > 0 ? (principal / totalPayable) * 100 : 100;
  const interestPercent = 100 - principalPercent;

  const barPrincipal = document.getElementById('emiBarPrincipal');
  const barInterest = document.getElementById('emiBarInterest');
  if (barPrincipal && barInterest) {
    barPrincipal.style.width = `${principalPercent}%`;
    barInterest.style.width = `${interestPercent}%`;
  }
}

// ==========================================================================
// TRANSACTION HISTORY TABLE
// ==========================================================================
function loadTransactionsTable() {
  const container = document.getElementById('transactionHistoryTableBody');
  if (!container) return;

  const transactions = JSON.parse(localStorage.getItem('smartshop_transactions') || '[]');

  if (transactions.length === 0) {
    // Seed initial demo transactions
    const initialTxns = [
      { id: "TXN_78491A", date: "2026-09-01", type: "Wallet Top-up", amount: 5000, status: "Success" },
      { id: "TXN_92104B", date: "2026-09-05", type: "Urban Pro Running Shoes", amount: 3499, status: "Success" },
      { id: "TXN_33890C", date: "2026-09-08", type: "The Laugh Boulevard Comedy", amount: 799, status: "Success" }
    ];
    localStorage.setItem('smartshop_transactions', JSON.stringify(initialTxns));
    return loadTransactionsTable();
  }

  container.innerHTML = transactions.map(txn => {
    const isCredit = txn.type === 'Wallet Top-up';
    return `
      <tr>
        <td class="fw-bold text-dark font-monospace small">${txn.id}</td>
        <td class="small text-muted">${txn.date}</td>
        <td>
          <span class="badge ${isCredit ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} px-3 py-1 rounded-pill small">
            <i class="fas ${isCredit ? 'fa-arrow-down-left me-1' : 'fa-arrow-up-right me-1'}"></i> ${txn.type}
          </span>
        </td>
        <td class="fw-bold ${isCredit ? 'text-success' : 'text-dark'}">
          ${isCredit ? '+' : '-'} ${formatINR(txn.amount)}
        </td>
        <td>
          <span class="badge bg-success-subtle text-success px-2 py-1 rounded-pill small">
            ${txn.status}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('walletBalanceDisplay')) {
    initFinancePage();
  }
});
