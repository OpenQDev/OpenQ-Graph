import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { SupportingDocumentsSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleSupportingDocumentsSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handlesupportingDocuments.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle SupportingDocumentsSet event', () => {
		let newSupportingDocumentsSetEvent = createNewSupportingDocumentsSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.version
		)

		newSupportingDocumentsSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsSet(newSupportingDocumentsSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
	})
})

export function createNewSupportingDocumentsSetEvent(
	bountyAddress: string,
	supportingDocuments: boolean,
	data: string,
	version: string
): SupportingDocumentsSet {
	let newSupportingDocumentsSetEvent = changetype<SupportingDocumentsSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("supportingDocuments", ethereum.Value.fromBoolean(supportingDocuments)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newSupportingDocumentsSetEvent.parameters = parameters;

	return newSupportingDocumentsSetEvent
}