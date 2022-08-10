import { PayoutSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handlePayoutSet(event: PayoutSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.payoutTokenAddress = event.params.payoutTokenAddress
	bounty.payoutTokenVolume = event.params.payoutTokenVolume;

	// SAVE ALL ENTITIES
	bounty.save()
}