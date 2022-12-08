import { InvoiceableSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleInvoiceableSet(event: InvoiceableSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	bounty.invoiceable = event.params.invoiceable;

	// SAVE ALL ENTITIES
	bounty.save()
}