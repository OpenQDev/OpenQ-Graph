import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { SupportingDocumentsCompletedSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleSupportingDocumentsCompletedSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleSupportingDocumentsCompleted.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle SupportingDocumentsCompletedSet event - ATOMIC', () => {
		let newSupportingDocumentsCompletedSetEvent = createNewSupportingDocumentsCompletedSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.supportingDocumentsCompletedData_ATOMIC,
			Constants.VERSION_1
		)

		let newSupportingDocumentsCompletedSetEvent_false = createNewSupportingDocumentsCompletedSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.supportingDocumentsCompletedData_ATOMIC_false,
			Constants.VERSION_1
		)

		newSupportingDocumentsCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsCompletedSet(newSupportingDocumentsCompletedSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', `[true]`)

		handleSupportingDocumentsCompletedSet(newSupportingDocumentsCompletedSetEvent_false)

		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', 'null')
	})

	test('can handle SupportingDocumentsCompletedSet event - TIERED', () => {
		let newSupportingDocumentsCompletedSetEvent = createNewSupportingDocumentsCompletedSetEvent(
			Constants.id,
			Constants.bountyType_TIERED,
			Constants.supportingDocumentsCompletedData_TIERED,
			Constants.VERSION_1
		)

		newSupportingDocumentsCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsCompletedSet(newSupportingDocumentsCompletedSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', `[${Constants.supportingDocumentsCompleted[0]}, ${Constants.supportingDocumentsCompleted[1]}, ${Constants.supportingDocumentsCompleted[2]}]`)
	})
})

export function createNewSupportingDocumentsCompletedSetEvent(
	bountyAddress: string,
	bountyType: string,
	data: string,
	version: string
): SupportingDocumentsCompletedSet {
	let newSupportingDocumentsCompletedSetEvent = changetype<SupportingDocumentsCompletedSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newSupportingDocumentsCompletedSetEvent.parameters = parameters;

	return newSupportingDocumentsCompletedSetEvent
}