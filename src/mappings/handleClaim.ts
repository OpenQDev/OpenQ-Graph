import { Claim } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleClaim(event: Claim): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.closer = event.params.closer.toHexString()
	bounty.bountyClosedTime = event.params.bountyClosedTime
	bounty.status = "CLOSED"
	bounty.claimedTransactionHash = event.transaction.hash;

	// Only available on updated event
	bounty.closerData = event.params.closerData

	// SAVE ALL ENTITIES
	bounty.save()
}