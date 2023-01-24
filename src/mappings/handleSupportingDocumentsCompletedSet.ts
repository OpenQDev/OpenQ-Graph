import { log, ethereum } from "@graphprotocol/graph-ts"
import { SupportingDocumentsCompletedSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import Constants from '../utils'

export default function handleSupportingDocumentsRequiredSet(event: SupportingDocumentsCompletedSet): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) { throw "Error" }

	let bountyType = event.params.bountyType

	if (bountyType == Constants.ATOMIC) {
		let decoded: ethereum.Value[] = []
		decoded = ethereum.decode("(bool)", event.params.data)!.toTuple();
		const supportingDocumentsCompleted = decoded[0].toBoolean()
		const foo = ethereum.Value.fromBooleanArray([supportingDocumentsCompleted])
		bounty.supportingDocumentsCompleted = supportingDocumentsCompleted ? foo.toBooleanArray() : null
	} else {
		let decoded: ethereum.Value[] = []
		decoded = ethereum.decode("(bool[])", event.params.data)!.toTuple();
		bounty.supportingDocumentsCompleted = decoded[0].toBooleanArray()
	}

	// SAVE ALL ENTITIES
	bounty.save()
}