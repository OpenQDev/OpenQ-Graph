import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { SupportingDocumentsCompleteSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleSupportingDocumentsCompleteSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleSupportingDocumentsCompleted.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle SupportingDocumentsCompleteSet event - ATOMIC', () => {
		let newSupportingDocumentsCompleteSetEvent = createNewSupportingDocumentsCompleteSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.supportingDocumentsCompletedData_ATOMIC,
			Constants.VERSION_1
		)

		let newSupportingDocumentsCompleteSetEvent_false = createNewSupportingDocumentsCompleteSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.supportingDocumentsCompletedData_ATOMIC_false,
			Constants.VERSION_1
		)

		newSupportingDocumentsCompleteSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsCompleteSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsCompleteSet(newSupportingDocumentsCompleteSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', `[true]`)

		handleSupportingDocumentsCompleteSet(newSupportingDocumentsCompleteSetEvent_false)

		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', 'null')
	})

	test('can handle SupportingDocumentsCompleteSet event - TIERED', () => {
		let newSupportingDocumentsCompleteSetEvent = createNewSupportingDocumentsCompleteSetEvent(
			Constants.id,
			Constants.bountyType_TIERED,
			Constants.supportingDocumentsCompletedData_TIERED,
			Constants.VERSION_1
		)

		newSupportingDocumentsCompleteSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsCompleteSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsCompleteSet(newSupportingDocumentsCompleteSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', Constants.supportingDocumentsCompleted_string)
	})
})

export function createNewSupportingDocumentsCompleteSetEvent(
	bountyAddress: string,
	bountyType: string,
	data: string,
	version: string
): SupportingDocumentsCompleteSet {
	let newSupportingDocumentsCompleteSetEvent = changetype<SupportingDocumentsCompleteSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newSupportingDocumentsCompleteSetEvent.parameters = parameters;

	return newSupportingDocumentsCompleteSetEvent
}