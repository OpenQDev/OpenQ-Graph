import { log, ethereum } from "@graphprotocol/graph-ts"
import { InvoiceCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import Constants from '../utils'

export default function handleInvoiceCompletedSet(event: InvoiceCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	let bountyType = event.params.bountyType

	if (bountyType == Constants.ATOMIC) {
		let decoded: ethereum.Value[] = []
		decoded = ethereum.decode("(bool)", event.params.data)!.toTuple();
		const invoiceCompleted = decoded[0].toBoolean()
		const foo = ethereum.Value.fromBooleanArray([invoiceCompleted])
		bounty.invoiceCompleted = foo.toBooleanArray()
	} else {
		let decoded: ethereum.Value[] = []
		decoded = ethereum.decode("(bool[])", event.params.data)!.toTuple();
		bounty.invoiceCompleted = decoded[0].toBooleanArray()
	}

	// SAVE ALL ENTITIES
	bounty.save()
}