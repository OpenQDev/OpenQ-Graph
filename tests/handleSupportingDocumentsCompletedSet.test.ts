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

	test('can handle SupportingDocumentsCompletedSet event', () => {
		let newSupportingDocumentsCompletedSetEvent = createNewSupportingDocumentsCompletedSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.version
		)

		newSupportingDocumentsCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsCompletedSet(newSupportingDocumentsCompletedSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'supportingDocumentsCompleted', 'true')
	})
})

export function createNewSupportingDocumentsCompletedSetEvent(
	bountyAddress: string,
	supportingDocumentsCompleted: boolean,
	data: string,
	version: string
): SupportingDocumentsCompletedSet {
	let newSupportingDocumentsCompletedSetEvent = changetype<SupportingDocumentsCompletedSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("supportingDocumentsCompleted", ethereum.Value.fromBoolean(supportingDocumentsCompleted)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newSupportingDocumentsCompletedSetEvent.parameters = parameters;

	return newSupportingDocumentsCompletedSetEvent
}