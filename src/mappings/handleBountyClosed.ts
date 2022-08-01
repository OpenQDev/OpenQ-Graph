import { BountyClosed } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import { BigInt } from '@graphprotocol/graph-ts'

export default function handleBountyClosed(event: BountyClosed): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.closer = event.params.closer.toHexString()
	event.params.data
	bounty.bountyClosedTime = event.params.bountyClosedTime

	if (event.params.bountyType == BigInt.fromString('0')) {
		bounty.status = BigInt.fromString('1')
	} else if (event.params.bountyType == BigInt.fromString('1')) {
		bounty.status = BigInt.fromString('2')
	} else if (event.params.bountyType == BigInt.fromString('2')) {
		bounty.status = BigInt.fromString('3')
	}

	bounty.claimedTransactionHash = event.transaction.hash;

	// Only available on updated event
	bounty.closerData = event.params.data

	// SAVE ALL ENTITIES
	bounty.save()
}