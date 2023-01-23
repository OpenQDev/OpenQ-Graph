import { ethereum } from "@graphprotocol/graph-ts"
import { InvoiceCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import Constants from '../utils'

export default function handleInvoiceCompletedSet(event: InvoiceCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	let bountyType = event.params.bountyType

	let decoded: ethereum.Value[] = []
	if (bountyType == Constants.ATOMIC) {
		decoded = ethereum.decode("(bool)", event.params.data)!.toTuple();
		bounty.invoiceCompleted?.push(decoded[0].toBoolean());
	} else if (bountyType == Constants.ONGOING) {

	} else if (bountyType == Constants.TIERED || bountyType == Constants.TIERED_FIXED) {
		decoded = ethereum.decode("(uint256,bool)", event.params.data)!.toTuple();
		bounty.invoiceCompleted
	}

	// SAVE ALL ENTITIES
	bounty.save()
}