import { SupportingDocumentsCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleSupportingDocumentsRequiredSet(event: SupportingDocumentsCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	// SAVE ALL ENTITIES
	bounty.save()
}