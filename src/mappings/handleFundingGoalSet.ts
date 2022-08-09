import { FundingGoalSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleFundingGoalSet(event: FundingGoalSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.hasFundingGoal = true;
	bounty.fundingGoalTokenAddress = event.params.fundingGoalTokenAddress;
	bounty.fundingGoalVolume = event.params.fundingGoalVolume;

	// SAVE ALL ENTITIES
	bounty.save()
}