import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { SupportingDocumentsRequiredSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleSupportingDocumentsRequiredSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handlesupportingDocuments.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle SupportingDocumentsRequiredSet event', () => {
		let newSupportingDocumentsRequiredSetEvent = createNewSupportingDocumentsRequiredSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.VERSION_1
		)

		newSupportingDocumentsRequiredSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newSupportingDocumentsRequiredSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleSupportingDocumentsRequiredSet(newSupportingDocumentsRequiredSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
	})
})

export function createNewSupportingDocumentsRequiredSetEvent(
	bountyAddress: string,
	supportingDocuments: boolean,
	data: string,
	version: string
): SupportingDocumentsRequiredSet {
	let newSupportingDocumentsRequiredSetEvent = changetype<SupportingDocumentsRequiredSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("supportingDocuments", ethereum.Value.fromBoolean(supportingDocuments)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newSupportingDocumentsRequiredSetEvent.parameters = parameters;

	return newSupportingDocumentsRequiredSetEvent
}