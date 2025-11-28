
# Blockchain Supply Chain Management DApp

This document explains how to set up, run, and demo the supply-chain tracking DApp included in this repository. The app combines a Solidity smart contract, a Hardhat development environment, and a Next.js UI to manage shipment lifecycles (create → start → complete) with on-chain transparency.

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Architecture Diagram](#architecture-diagram)  
3. [Prerequisites](#prerequisites)  a
4. [Installation & Setup](#installation--setup)  
5. [Environment Configuration](#environment-configuration)  
6. [Running the DApp](#running-the-dapp)  
7. [Using the Interface](#using-the-interface)  
8. [Smart Contract Summary](#smart-contract-summary)  
9. [Testing & Demo Checklist](#testing--demo-checklist)  
10. [Helpful Links](#helpful-links)

---

## Project Overview
- **Problem:** Supply chains need tamper-proof shipment logs and automated payment triggers.
- **Solution:** A blockchain-backed DApp that records every shipment event, requires a deposit equal to the shipment cost, and releases the funds when delivery is confirmed.
- **Tech stack:** Hardhat, Solidity, ethers.js, MetaMask, Next.js/React, Tailwind CSS.

---

## Architecture Diagram
```
MetaMask (wallet) ──> Next.js UI ──> ethers.js/web3modal ──> Hardhat RPC ──> Tracking.sol
```
- The UI uses React context to share contract functions (create/start/complete/get).
- Hardhat simulates an Ethereum network with proof-of-work rules and funded accounts.

---

## Prerequisites
| Tool | Version/Notes |
|------|---------------|
| Node.js | ≥ 16 |
| npm | ≥ 8 |
| Git | Latest |
| MetaMask | Browser extension |
| Hardhat | Installed via npm (step below) |

---

## Installation & Setup
1. **Clone repository**
   ```bash
   git clone https://github.com/ThisIsSahaj/SupplyChainManagement.git
   cd SupplyChainManagement
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Install Hardhat locally (if needed)**
   ```bash
   npm install --save-dev hardhat
   ```
4. **Start Hardhat node** (Terminal #1, keep running)
   ```bash
   npx hardhat node
   ```
5. **Deploy contract** (Terminal #2)
   ```bash
   npx hardhat run --network localhost scripts/deploy.js
   ```
   Copy the contract address printed in the console (e.g., `0x5FbDB2...`).

---

## Environment Configuration
Create a file named `.env.local` in the project root.
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_NETWORK_RPC=http://127.0.0.1:8545/
```
- Restart `npm run dev` after editing `.env.local`.
- The values automatically flow into `Conetxt/TrackingContext.js`.

---

## Running the DApp
1. **MetaMask configuration**
   - Network Name: `Hardhat Localhost`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
   - Import a private key from the Hardhat node output (Account #0 recommended).

2. **Start the frontend (Terminal #3)**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` and click **Connect Wallet**.

3. **Processes to keep running**
   - `npx hardhat node`
   - `npm run dev`
   - optional: additional terminals for deployment/testing scripts

---

## Using the Interface
1. **Add Tracking**
   - Opens modal: enter receiver (valid 0x address), pickup date, distance, price.
   - MetaMask pops up → confirm → shipment appears in the table.

2. **Start Shipment**
   - Input receiver address + shipment index.
   - Sets status `PENDING → IN_TRANSIT`, modal closes, table refreshes automatically.

3. **Complete Shipment**
   - Input receiver + index.
   - Marks delivery, records timestamp, refunds sender, sets Paid = Completed.

4. **Get Shipment**
   - Fetches and displays full details for a single shipment index.

5. **User Profile**
   - Shows connected wallet address and total shipment count.

6. **Shipment Table**
   - Columns: Serial #, Sender, Receiver, Pickup Time, Distance, Price (ETH), Delivery Time, Paid, Status.
   - Full addresses displayed; horizontal scroll available for narrow screens.

---

## Smart Contract Summary
`contracts/Tracking.sol`

```solidity
enum ShipmentStatus { PENDING, IN_TRANSIT, DELIVERED }

function createShipment(address receiver, uint pickupTime, uint distance, uint price) payable
function startShipment(address sender, address receiver, uint index)
function completeShipment(address sender, address receiver, uint index)
function getShipment(address sender, uint index) view returns (...)
function getShipmentsCount(address sender) view returns (uint)
function getAllTransactions() view returns (TypeShipment[])
```
- Payment held in contract until `completeShipment` succeeds.
- Events emit for creation, transit, delivery, and payment, enabling indexer integrations.

---

## Testing & Demo Checklist
- [x] `npm run dev` + `npx hardhat node` running in parallel.
- [x] MetaMask connected to Hardhat Localhost and showing 10,000 ETH.
- [x] Create multiple shipments with varying receivers/distances.
- [x] Start & complete shipments; ensure table auto-refreshes.
- [x] Verify `Get Shipment` modal returns accurate status & timestamps.
- [x] Error handling: invalid addresses, negative indexes, double completion attempts.
- [x] Screen capture or live demo using the presentation deck.

---

## Helpful Links
- Hardhat docs: https://hardhat.org/getting-started/
- ethers.js docs: https://docs.ethers.io
- MetaMask docs: https://docs.metamask.io
- Remix (optional ABI generation): https://remix-project.org

---

Feel free to extend this README with custom screenshots, architecture diagrams, or deployment links specific to your environment. Use it as a reference during demos or presentations to showcase how the blockchain pipeline works end to end.

