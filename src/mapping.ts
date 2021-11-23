import { BigInt } from "@graphprotocol/graph-ts"
import { OpenQ, IssueClosed, IssueCreated } from "../generated/OpenQ/OpenQ"
import { Issue } from "../generated/schema"
import { Address } from '@graphprotocol/graph-ts'

export function handleIssueCreated(event: IssueCreated): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let entity = Issue.load(event.params.issueId)

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	entity = new Issue(event.transaction.from.toHex())

	// Entity fields can be set based on event parameters
	entity.id = event.params.issueId
	entity.issueAddress = event.params.issueAddress
	entity.issuer = event.params.issuer
	entity.issueMintTime = event.params.issueMintTime
	entity.claimed = false

	// Entities can be written to the store with `.save()`
	entity.save()

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

export function handleIssueClosed(event: IssueClosed): void {
	let entity = Issue.load(event.params.issueId)

	entity.claimed = true
	entity.issueClosedTime = event.params.issueClosedTime

	entity.save()
}
