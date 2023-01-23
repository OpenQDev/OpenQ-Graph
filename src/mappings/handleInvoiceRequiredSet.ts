import { InvoiceRequiredSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleInvoiceRequiredSet(event: InvoiceRequiredSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.invoiceRequired = event.params.invoiceRequired;

	// SAVE ALL ENTITIES
	bounty.save()
}