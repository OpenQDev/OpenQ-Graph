import { BigInt } from "@graphprotocol/graph-ts"
import { NFTDepositReceived } from "../../generated/OpenQ/OpenQ"
import {
	User,
	Deposit
} from "../../generated/schema"

export default function handleNftDepositReceived(event: NFTDepositReceived): void {
	// CREATE NEW DEPOSIT ENTITY
	let deposit = new Deposit(event.params.depositId.toHexString())

	deposit.tokenAddress = event.params.tokenAddress
	deposit.bounty = event.params.bountyAddress.toHexString()
	deposit.organization = event.params.organization

	deposit.receiveTime = event.params.receiveTime
	deposit.transactionHash = event.transaction.hash
	deposit.tokenId = event.params.tokenId
	deposit.expiration = event.params.expiration
	deposit.volume = new BigInt(0)

	// UPSERT USER
	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	deposit.sender = user.id

	// SAVE ALL ENTITIES
	deposit.save()
}