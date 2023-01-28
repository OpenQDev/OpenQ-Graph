import { log, ethereum } from "@graphprotocol/graph-ts"
import { SupportingDocumentsCompleteSet } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import Constants from '../utils'
import { addTuplePrefix } from '../utils'

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
		
		const supportingDocumentsComplete = decodedTuple[0].toBoolean()
		bounty.supportingDocumentsCompleted = supportingDocumentsComplete ? [supportingDocumentsComplete] : null
	} else if (bountyType == Constants.TIERED_PERCENTAGE || bountyType == Constants.TIERED_FIXED) {
		let decoded = ethereum.decode("(bool[])", addTuplePrefix(event.params.data))
		
		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple();
		bounty.supportingDocumentsCompleted = decodedTuple[0].toBooleanArray()
	} else if (bountyType == Constants.ONGOING) {
		let decoded = ethereum.decode("(bytes32[])", addTuplePrefix(event.params.data))
		
		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple();
		bounty.supportingDocumentsCompleted = decodedTuple[0].toBooleanArray()
	} else {
		return
	}

	// SAVE ALL ENTITIES
	bounty.save()
}