import { BountyClosed1 } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleBountyClosed(event: BountyClosed1): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.closer = event.params.closer.toHexString()
	bounty.bountyClosedTime = event.params.bountyClosedTime
	bounty.status = "CLOSED"
	bounty.claimedTransactionHash = event.transaction.hash;

	// SAVE ALL ENTITIES
	bounty.save()
}