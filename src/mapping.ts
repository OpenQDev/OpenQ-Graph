import { BigInt, Value } from "@graphprotocol/graph-ts"
import { BountyClosed, BountyCreated, DepositReceived, DepositRefunded } from "../generated/OpenQ/OpenQ"
import { Bounty, User, Deposit, } from "../generated/schema"

export function handleBountyCreated(event: BountyCreated): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		bounty = new Bounty(event.params.bountyAddress.toHexString())
	}

	bounty.bountyId = event.params.bountyId
	bounty.bountyMintTime = event.params.bountyMintTime
	bounty.status = "OPEN"

	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	bounty.issuer = user.id;

	bounty.save()
}

export function handleDepositReceived(event: DepositReceived): void {
	let depositId = `${event.params.bountyAddress.toHexString()}-${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let deposit = Deposit.load(depositId)

	if (!deposit) {
		deposit = new Deposit(depositId)
		deposit.value = new BigInt(0)
	}

	deposit.sender = event.params.sender.toHexString()
	deposit.bounty = event.params.bountyAddress.toHexString()

	deposit.value = deposit.value.plus(event.params.value)

	deposit.save()
}

export function handleBountyClosed(event: BountyClosed): void {
	// Entities can be loaded from the store using a string ID; this ID
	// needs to be unique across all entities of the same type
	let bounty = Bounty.load(event.params.bountyId)

	// Entities only exist after they have been saved to the store;
	// `null` checks allow to create entities on demand
	if (!bounty) {
		bounty = new Bounty(event.transaction.from.toHex())
	}

	bounty.save()
}

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
