import { SupportingDocumentsRequiredSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleSupportingDocumentsRequiredSet(event: SupportingDocumentsRequiredSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.supportingDocumentsRequired = event.params.supportingDocuments;

	// SAVE ALL ENTITIES
	bounty.save()
}