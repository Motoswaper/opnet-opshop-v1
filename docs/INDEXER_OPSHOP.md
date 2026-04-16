# OPSHOP v1 — Indexer Schema

This schema defines how indexers should track OPSHOP listings and purchases.

---

## listings

| field          | type   | description |
|----------------|--------|-------------|
| id             | number | listing id |
| seller         | string | seller address |
| token          | string | OP20 token |
| price          | number | price |
| descriptionHash| string | off‑chain description |
| active         | bool   | listing active? |
| blockNumber    | number | block |
| txHash         | string | tx hash |
| timestamp      | number | unix time |

---

## purchases

| field          | type   | description |
|----------------|--------|-------------|
| listingId      | number | listing id |
| buyer          | string | buyer address |
| seller         | string | seller address |
| price          | number | price |
| escrowId       | number | MotoSettle escrow id |
| blockNumber    | number | block |
| txHash         | string | tx hash |
| timestamp      | number | unix time |

---

## events

- `ListingCreated`  
- `ListingDisabled`  
- `ListingPurchased`  
