import { PayoutScheduleSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handlePayoutScheduleSet(event: PayoutScheduleSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.payoutTokenAddress = event.params.payoutTokenAddress
	bounty.payoutSchedule = event.params.payoutSchedule;

	// SAVE ALL ENTITIES
	bounty.save()
}