import { SupportingDocumentsSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleSupportingDocumentsSet(event: SupportingDocumentsSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.supportingDocuments = event.params.supportingDocuments;

	// SAVE ALL ENTITIES
	bounty.save()
}