import { BigInt } from "@graphprotocol/graph-ts"
import { NFTDepositReceived } from "../../generated/DepositManager/DepositManager"
import {
	User,
	Deposit,
	TokenEvents
} from "../../generated/schema"

export default function handleNftDepositReceived(event: NFTDepositReceived): void {
	// CREATE NEW DEPOSIT ENTITY
	let deposit = new Deposit(event.params.depositId.toHexString())

	deposit.tokenAddress = event.params.tokenAddress
	deposit.bounty = event.params.bountyAddress.toHexString()
	deposit.organization = event.params.organization
	deposit.volume = BigInt.fromString('0')

	deposit.receiveTime = event.params.receiveTime
	deposit.transactionHash = event.transaction.hash
	deposit.tokenId = event.params.tokenId
	deposit.expiration = event.params.expiration
	deposit.isNft = true
	deposit.refunded = false

	// UPSERT USER
	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	deposit.sender = user.id

	// UPSERT TOKEN EVENT
	let tokenEvents = TokenEvents.load(event.params.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(event.params.tokenAddress.toHexString())
		tokenEvents.save()
	}

	deposit.tokenEvents = tokenEvents.id

	// SAVE ALL ENTITIES
	deposit.save()
	tokenEvents.save()
}