import { TierWinnerSelected } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleTierWinnerSelected(event: TierWinnerSelected): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	// const index = Number(event.params.tier)

	bounty.tierWinners = event.params.tierWinners;

	// SAVE ALL ENTITIES
	bounty.save()
}