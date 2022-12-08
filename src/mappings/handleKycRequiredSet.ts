import { KYCRequiredSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleKycRequiredSet(event: KYCRequiredSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.kycRequired = event.params.kycRequired;

	// SAVE ALL ENTITIES
	bounty.save()
}