import { BigInt, Value } from "@graphprotocol/graph-ts"
import { OpenQ, BountyClosed, BountyCreated, DepositReceived, DepositRefunded } from "../generated/OpenQ/OpenQ"
import { Bounty, User } from "../generated/schema"
import { Address } from '@graphprotocol/graph-ts'

export function handleBountyCreated(event: BountyCreated): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!bounty) {
		bounty = new Bounty(event.params.bountyAddress.toHexString())
	}

	if (!bounty) {
		bounty = new Bounty(event.transaction.from.toHexString())
	}

	// Set bounty parameters
	bounty.bountyId = event.params.bountyId
	bounty.bountyMintTime = event.params.bountyMintTime
	bounty.status = "OPEN"

	let user = User.load(event.transaction.from.toHexString())

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	bounty.issuer = user.id;

	// Entities can be written to the store with `.save()`
	bounty.save()

	// Note: If a handler doesn't require existing field values, it is faster
	// _not_ to load the entity from the store. Instead, create it fresh with
	// `new Entity(...)`, set the fields that should be updated and save the
	// entity back to the store. Fields that were not set or unset remain
	// unchanged, allowing for partial updates to be applied.

	// It is also possible to access smart contracts from mappings. For
	// example, the contract that has emitted the event can be connected to
	// with:
	//
	// let contract = Contract.bind(event.address)
	//
	// The following functions can then be called on this contract to access
	// state variables and other data:
	//
	// - contract.addressToIssue(...)
	// - contract.getBountyAddress(...)
	// - contract.getIssueIds(...)
	// - contract.issueIds(...)
	// - contract.issueIsOpen(...)
	// - contract.issueToAddress(...)
	// - contract.mintBounty(...)
	// - contract.tokenAddresses(...)
}

// event BountyClosed(
// 	string bountyId,
// 	address indexed bountyAddress,
// 	address indexed payoutAddress,
// 	uint256 bountyClosedTime
// );
export function handleBountyClosed(event: BountyClosed): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let entity = Bounty.load(event.params.bountyId)

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!entity) {
		entity = new Bounty(event.transaction.from.toHex())
	}

	entity.save()
}

// event DepositReceived(
// 	string bountyId,
// 	address bountyAddress,
// 	address tokenAddress,
// 	address sender,
// 	uint256 value,
// 	uint256 receiveTime
// );
export function handleDepositReceived(event: DepositReceived): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let entity = Bounty.load(event.params.bountyId)

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!entity) {
		entity = new Bounty(event.transaction.from.toHex())
	}

	entity.save()
}

// event DepositRefunded(
// 	string bountyId,
// 	address bountyAddress,
// 	address tokenAddress,
// 	address funder,
// 	uint256 value,
// 	uint256 refundTime
// );
export function handleDepositRefunded(event: DepositRefunded): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let entity = Bounty.load(event.params.bountyId)

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!entity) {
		entity = new Bounty(event.transaction.from.toHex())
	}
	entity.save()
}
