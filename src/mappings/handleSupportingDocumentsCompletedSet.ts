import { SupportingDocumentsCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleSupportingDocumentsSet(event: SupportingDocumentsCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.supportingDocumentsCompleted = event.params.supportingDocumentsCompleted;

	// SAVE ALL ENTITIES
	bounty.save()
}