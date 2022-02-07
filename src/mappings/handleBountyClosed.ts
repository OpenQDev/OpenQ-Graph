import { BountyClosed } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleBountyClosed(event: BountyClosed): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.payoutAddress = event.params.payoutAddress.toHexString()
	bounty.bountyClosedTime = event.params.bountyClosedTime
	bounty.status = "CLOSED"

	// SAVE ALL ENTITIES
	bounty.save()
}