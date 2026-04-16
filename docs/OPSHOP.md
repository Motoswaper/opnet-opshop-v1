# OPSHOP v1 — Trustless Marketplace Protocol for OP_NET

OPSHOP v1 is the official marketplace primitive of the OP_NET ecosystem.

It enables:

- creation of listings  
- trust‑aware purchases  
- escrow via MotoSettle  
- reputation enforcement via TrustLayer  
- OP20‑based payments  

OPSHOP is minimal, deterministic, and fully composable.

---

## 🧱 Core Concepts

### Listing
Each listing contains:

- `seller`  
- `token` (OP20)  
- `price`  
- `descriptionHash`  
- `active` flag  

### Purchase Flow
1. Buyer purchases listing  
2. OP20 funds are transferred to MotoSettle  
3. MotoSettle opens escrow  
4. Seller delivers item  
5. Seller releases escrow OR buyer opens dispute  

---

## 🔗 Integrations

### TrustLayer
- Sellers must have reputation ≥ 2000  
- Buyers must have reputation ≥ 1000  

### MotoSettle
- All purchases create an escrow  
- Disputes handled by MotoSettle  
- Arbiters validated via TrustLayer  

### OP20
- Payments  
- Escrow funding  

---

## 🧩 Contract Methods

### `init(motosettle, trustlayer)`
Initialize OPSHOP with dependency addresses.

### `createListing(token, price, descriptionHash)`
Creates a listing.

### `disableListing(id)`
Seller disables their listing.

### `purchase(id)`
Buyer purchases listing → funds go to MotoSettle escrow.

---

OPSHOP v1 is the commerce layer of OP_NET.
