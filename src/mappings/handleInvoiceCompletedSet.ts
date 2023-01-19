import { InvoiceCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"

export default function handleInvoiceCompletedSet(event: InvoiceCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	if (!bounty.invoiceCompleted) { 
		bounty.invoiceCompleted = new Array<boolean>()
	}

	let index = event.params.tier.toI32()

	let array = bounty.invoiceCompleted
	array[index] = event.params.invoiceCompletedSet
	bounty.invoiceCompleted = array

	// SAVE ALL ENTITIES
	bounty.save()
}