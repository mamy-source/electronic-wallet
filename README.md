# electronic-wallet
A web-based electronic wallet platform built with Next.js, Express.js, and TypeScript for managing wallets, transfers, payments, and transaction history.

# Overview
This project aims to design and develop a secure web-based electronic wallet platform that allows users to manage their wallets, perform financial operations, and track their transactions.

Administrators can supervise users, wallets, transactions, and sensitive operations.

# Main Features
# User
- Account management
- Wallet management
- Wallet balance consultation
- Money transfers
- Payments
- Transaction history
# Administrator
- User supervision
- Wallet supervision
- Transaction supervision
- Monitoring of sensitive operations

# Tech Stack
- Next.js
- Express.js
- TypeScript
- REST API
- Database
- Git & GitHub
- Git Flow
# Project Structure
electronic-wallet/
├── apps/
│   ├── web/                # Next.js application
│   └── api/                # Express.js API
│
├── packages/
│   ├── shared/             # Shared types and constants
│   ├── validation/         # Shared validation schemas
│   └── config/             # Shared configuration
│
├── docs/                   # Project documentation
│   ├── architecture/
│   ├── database/
│   ├── api/
│   ├── security/
│   └── diagrams/
│
├── .github/
│   └── workflows/
│
├── package.json
├── tsconfig.json
└── .gitignore

# Development

The project is organized as a monorepo using npm workspaces.

# Install dependencies
npm install
# Run the web application
npm run dev:web
# Run the API
npm run dev:api
# Build the project
npm run build
# Run tests
npm run test
# Run lint
npm run lint
# Run type checking
npm run typecheck

# Status
Project under development