# 🚀 Solana dApp Template

A **beautiful, minimalist template** for building **Solana-based applications** with **wallet integration**, **token transfers**, and a **faucet for test SOL**. Built using **Next.js, TailwindCSS, ShadCN, and Solana Web3.js**.

---

## ✨ Features

✅ **Wallet Connection** – Connect your Solana wallet (Phantom, Solflare, etc.)
✅ **Network Selector** – Switch between **Devnet** and **Testnet**
✅ **SOL Transfer** – Send SOL to another wallet
✅ **Faucet** – Get **1 SOL** for free on Devnet/Testnet
✅ **Explorer Links** – View transactions on **Solana Explorer**
✅ **Dark Mode Support** – Fully responsive and theme-aware

---

## 📦 Tech Stack

- **Next.js** (React framework)
- **TailwindCSS** (UI styling)
- **ShadCN UI** (Pre-built UI components)
- **Solana Web3.js** (Solana blockchain interactions)
- **Lucide Icons** (Modern icons)

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/solana-dapp-template.git
cd solana-dapp-template
```

### 2️⃣ Install Dependencies

Make sure you have **Node.js (v18+)** installed, then run:

```sh
npm install
```

or

```sh
yarn install
```

### 3️⃣ Start the Development Server

```sh
npm run dev
```

The app should now be running at:
👉 **http://localhost:3000**

---

## 💳 Wallet Integration

This template supports **Phantom, Solflare, and other Solana wallets**.

### How to Connect a Wallet?

1. Click the **"Connect Wallet"** button.
2. Select your wallet provider (Phantom, Solflare, etc.).
3. Approve the connection in your wallet extension.
4. You’re now connected! ✅

---

## 💰 Request Free SOL (Faucet)

If you're using **Devnet** or **Testnet**, you can request **1 SOL** every **15 seconds**.

1. Navigate to the **Faucet** tab.
2. Click **"Request 1 SOL"**.
3. The transaction will be processed.
4. View your **updated balance** and transaction on **Solana Explorer**.

---

## 🔄 Sending SOL

1. Go to the **Transfer** tab.
2. Enter a **recipient wallet address**.
3. Specify the **amount of SOL** to send.
4. Click **"Send SOL"** and confirm in your wallet.
5. Your transaction will be broadcasted!

---

## 🛠 Troubleshooting

### 1️⃣ My Wallet Isn’t Connecting

- Make sure you have **Phantom or another Solana wallet installed**.
- Refresh the page and try again.
- Open **Developer Console (F12 → Console)** and check for errors.

### 2️⃣ Faucet Says "Rate Limit Exceeded"

- You can only request **1 SOL every 15 seconds**.
- If rate limits are exceeded, **wait a few minutes and retry**.

### 3️⃣ My Transactions Are Failing

- Ensure you **have enough SOL** in your balance.
- Switch to **Devnet** or **Testnet** in **Network Selector**.

---

## 🛠 Customization Guide

### 🔹 Change Network Defaults

By default, this template runs on **Devnet**. You can change this in:

```ts
// src/lib/solana.ts
export const DEFAULT_NETWORK = "devnet";
```

### 🔹 Modify UI Styles

All styles are managed in **TailwindCSS**.
Modify styles in **`globals.css`** or **components/ui/**.

---

## 🚀 Deployment

Once you're happy with your app, deploy it using **Vercel**:

```sh
npm run build
vercel deploy
```

---

🔥 Happy BUIDLing on **Solana!** 🚀
