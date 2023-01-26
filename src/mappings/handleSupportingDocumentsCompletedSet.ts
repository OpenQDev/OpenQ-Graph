import { log, ethereum } from "@graphprotocol/graph-ts"
import { SupportingDocumentsCompleteSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import Constants from '../utils'

export default function handleSupportingDocumentsRequiredSet(event: SupportingDocumentsCompleteSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	let bountyType = event.params.bountyType

	if (bountyType == Constants.ATOMIC) {
		let decoded = ethereum.decode("(bool)", event.params.data)
		
		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple();
		
		const invoiceCompleted = decodedTuple[0].toBoolean()
		const foo = ethereum.Value.fromBooleanArray([invoiceCompleted])
		bounty.supportingDocumentsCompleted = invoiceCompleted ? foo.toBooleanArray() : null
	} else {
		let decoded = ethereum.decode("(bool[])", event.params.data)
		
		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple();
		bounty.supportingDocumentsCompleted = decodedTuple[0].toBooleanArray()
	}

	// SAVE ALL ENTITIES
	bounty.save()
}