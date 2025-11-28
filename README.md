# Blockchain Supply Chain Management DApp

This document provides a detailed guide to setting up, running, and demonstrating the blockchain-based supply-chain tracking DApp included in this repository. The application uses a Solidity smart contract, a Hardhat development environment, and a Next.js interface to manage shipment lifecycles (create → start → complete) with full on-chain transparency.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Environment Configuration](#environment-configuration)
6. [Running the DApp](#running-the-dapp)
7. [Using the Interface](#using-the-interface)
8. [Transaction Lifecycle Demo](#transaction-lifecycle-demo)
9. [Smart Contract Summary](#smart-contract-summary)
10. [Testing & Demo Checklist](#testing--demo-checklist)
11. [Helpful Links](#helpful-links)

---

## Project Overview

* **Problem:** Traditional supply chains often lack transparency and tamper-proof records, making shipment tracking and automated payments challenging.
* **Solution:** This DApp records each shipment event on-chain, requires a deposit equal to the shipment cost, and automatically releases payment when delivery is confirmed.
* **Tech Stack:**
  Hardhat, Solidity, ethers.js, MetaMask, Next.js/React, TailwindCSS.

---

## Architecture Diagram

```
MetaMask (wallet)
      ↓
 Next.js UI
      ↓
 ethers.js / web3modal
      ↓
 Hardhat Local Network (RPC)
      ↓
 Tracking.sol (Smart Contract)
```

* The UI uses React Context to expose contract functions (create/start/complete/get).
* Hardhat simulates a local Ethereum network with unlocked accounts and PoW-like behavior.

---

## Prerequisites

| Tool     | Requirement                 |
| -------- | --------------------------- |
| Node.js  | ≥ 16                        |
| npm      | ≥ 8                         |
| Git      | Latest                      |
| MetaMask | Browser Extension           |
| Hardhat  | Installed locally (via npm) |

---

## Installation & Setup

### 1. Clone the repository

```bash
gh repo clone tde13/SupplyChainManagement-main
cd SupplyChainManagement-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Hardhat (if not already installed)

```bash
npm install --save-dev hardhat
```

### 4. Start the Hardhat network (Terminal #1)

```bash
npx hardhat node
```

### 5. Deploy the contract (Terminal #2)

```bash
npx hardhat run --network localhost scripts/deploy.js
```

Copy the deployed contract address (e.g., `0x5FbDB2...`).

---

## Environment Configuration

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_NETWORK_RPC=http://127.0.0.1:8545/
```

Restart the frontend after editing `.env.local`.
These values are automatically injected into `Context/TrackingContext.js`.

---

## Running the DApp

### 1. Configure MetaMask

* **Network Name:** Hardhat Localhost
* **RPC URL:** `http://127.0.0.1:8545`
* **Chain ID:** `31337`
* **Currency Symbol:** ETH
* Import a private key from the Hardhat node output (Account #0 recommended).

### 2. Run the frontend (Terminal #3)

```bash
npm run dev
```

Visit:
`http://localhost:3000`
and click **Connect Wallet**.

### 3. Required running processes

* `npx hardhat node`
* `npm run dev`
* (Optional) Additional terminals for deploying or testing contracts

---

## Using the Interface

### 1. Create Shipment

* Enter receiver address, pickup date, distance, and price.
* MetaMask prompts for approval.
* On success, the new shipment appears in the table.

### 2. Start Shipment

* Provide receiver address + shipment index.
* Status updates from `PENDING → IN_TRANSIT`.

### 3. Complete Shipment

* Provide receiver address + index.
* Marks delivery, records timestamp, and releases held funds.

### 4. Get Shipment

* Retrieves full details for a specific shipment.

### 5. User Profile

* Shows the connected wallet address and total shipments created.

### 6. Shipment Table

* Columns include sender, receiver, timestamps, price, delivery status, and more.
* Long hashes are fully visible; horizontal scrolling is supported.

Screenshots:

<img width="1780" height="1166" src="https://github.com/user-attachments/assets/83ee0707-53aa-4197-877d-15094dcd875f" />

---

# Transaction Lifecycle Demo

(All actions performed using **MetaMask Account #1**)

This section demonstrates how transactions are created, approved, and updated through the DApp. Each step shows the MetaMask approval flow and the corresponding UI changes.

---

## 1. Creating Transactions

* User fills shipment details in the UI.
* MetaMask requests approval from Account #1.
* After confirmation, the transaction appears in the shipment list.

Screenshots:

<img width="1780" height="1166" src="https://github.com/user-attachments/assets/83ee0707-53aa-4197-877d-15094dcd875f" />

***Transactions being confirmed and added by Account #1***

<img width="1878" height="1177" src="https://github.com/user-attachments/assets/240c690c-ca83-44db-afbe-066a548ee222" />

MetaMask approval prompt:

<img width="2994" height="1768" src="https://github.com/user-attachments/assets/5fc05c7e-87a1-4653-9529-0a77013eb376" />

Reflected in UI:

<img width="1781" height="1126" src="https://github.com/user-attachments/assets/ce1f7d5e-4e36-4f09-b64b-0b5fc58a8fb9" />

---

## 2. Updating Status to `IN_TRANSIT`

* User enters shipment index and receiver address.
* MetaMask prompts Account #1 for confirmation.
* Status updates to `IN_TRANSIT`.

Screenshots:

<img width="1813" height="1100" src="https://github.com/user-attachments/assets/8adf89c5-c28c-4f1d-8caf-b0fff613aa4d" />

MetaMask approval:

<img width="2806" height="1776" src="https://github.com/user-attachments/assets/01507487-d8ad-4919-baab-5789f697a8cc" />

Updated UI:

<img width="1823" height="1097" src="https://github.com/user-attachments/assets/fc047bcf-bbad-4272-b846-3207203cfd06" />

---

## 3. Completing Transactions (`COMPLETED`)

* User triggers completion for a specific shipment.
* MetaMask prompts for a final confirmation.
* Shipment is marked `DELIVERED`, and payment is released.

Screenshots:

<img width="1730" height="1044" src="https://github.com/user-attachments/assets/3a1948fa-37e2-4b4d-9c93-5cb880f710a0" />

<img width="2960" height="1774" src="https://github.com/user-attachments/assets/b8fd4c2e-17c9-4408-a793-deb7147fea84" />

<img width="1849" height="1049" src="https://github.com/user-attachments/assets/05b50c1e-57f8-4b24-a774-e8e30050f118" />

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

Key features:

* Shipment payments are escrowed in the contract until delivery is confirmed.
* Events are emitted at every stage for integrations and indexing.

---

## Testing & Demo Checklist

* [x] `npx hardhat node` running
* [x] `npm run dev` running
* [x] MetaMask connected to Localhost 31337
* [x] Contract deployed; address added in `.env.local`
* [x] Create several shipments with different parameters
* [x] Run full lifecycle: Create → Start → Complete
* [x] Validate timestamps & status updates
* [x] Verify error handling: invalid addresses, incorrect index, repeated completion
* [x] Optional: Capture screenshots or record a walkthrough

---

## Helpful Links

* Hardhat Documentation: [https://hardhat.org/getting-started/](https://hardhat.org/getting-started/)
* Ethers.js Documentation: [https://docs.ethers.io](https://docs.ethers.io)
* MetaMask Documentation: [https://docs.metamask.io](https://docs.metamask.io)
* Remix IDE (optional): [https://remix-project.org](https://remix-project.org)

---

Feel free to extend this document with additional diagrams, screenshots, or deployment-specific notes. This README can also serve as a reference during presentations or technical demos to explain the end-to-end blockchain workflow.
