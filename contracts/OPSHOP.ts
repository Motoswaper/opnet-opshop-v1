// OPSHOP v1 — Trustless Marketplace Protocol for OP_NET
// AssemblyScript (WASM) — deterministic, minimal, indexer‑friendly

@unmanaged
class Listing {
  id: u64;
  seller: Address;
  token: Address;
  price: u64;
  descriptionHash: string;
  active: bool;
}

export class OPSHOP {

  private static nextListingId: u64 = 1;
  private static listings = new Map<u64, Listing>();

  private static motosettle: Address;
  private static trustlayer: Address;

  // Initialize with MotoSettle + TrustLayer addresses
  static init(motosettle: Address, trustlayer: Address): void {
    assert(OPSHOP.motosettle == ZERO_ADDRESS, "ALREADY_INITIALIZED");
    OPSHOP.motosettle = motosettle;
    OPSHOP.trustlayer = trustlayer;
  }

  // Create a listing
  static createListing(token: Address, price: u64, descriptionHash: string): u64 {
    assert(price > 0, "INVALID_PRICE");

    const seller = Context.sender();

    // Seller must be trusted
    assert(
      TrustLayer.reputation(seller) >= 2000,
      "LOW_REPUTATION"
    );

    const id = OPSHOP.nextListingId++;
    const l = new Listing();

    l.id = id;
    l.seller = seller;
    l.token = token;
    l.price = price;
    l.descriptionHash = descriptionHash;
    l.active = true;

    OPSHOP.listings.set(id, l);

    Events.emit("ListingCreated", [
      id.toString(),
      seller.toString(),
      token.toString(),
      price.toString(),
      descriptionHash
    ]);

    return id;
  }

  // Disable listing
  static disableListing(id: u64): void {
    const sender = Context.sender();
    const l = OPSHOP.listings.get(id);

    assert(l != null, "LISTING_NOT_FOUND");
    assert(l.seller == sender, "NOT_SELLER");
    assert(l.active, "ALREADY_DISABLED");

    l.active = false;

    Events.emit("ListingDisabled", [
      id.toString()
    ]);
  }

  // Purchase listing → funds go to MotoSettle escrow
  static purchase(id: u64): u64 {
    const buyer = Context.sender();
    const l = OPSHOP.listings.get(id);

    assert(l != null, "LISTING_NOT_FOUND");
    assert(l.active, "LISTING_DISABLED");
    assert(buyer != l.seller, "CANNOT_BUY_OWN_LISTING");

    // Buyer must be trusted
    assert(
      TrustLayer.reputation(buyer) >= 1000,
      "LOW_REPUTATION"
    );

    // Transfer funds to MotoSettle escrow
    OP20.transferFrom(buyer, OPSHOP.motosettle, l.price);

    // Open escrow in MotoSettle
    const escrowId = MotoSettle.openEscrow(
      l.seller,
      l.token,
      l.price
    );

    Events.emit("ListingPurchased", [
      id.toString(),
      buyer.toString(),
      l.seller.toString(),
      l.price.toString(),
      escrowId.toString()
    ]);

    return escrowId;
  }
}
