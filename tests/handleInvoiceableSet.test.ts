import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { InvoiceableSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleInvoiceableSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleInvoiceableSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle invoiceable set event', () => {
		let newInvoiceableSetEvent = createNewInvoiceableSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.version
		)

		newInvoiceableSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceableSetEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'false')

		handleInvoiceableSet(newInvoiceableSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'true')
	})
})

export function createNewInvoiceableSetEvent(
	bountyAddress: string,
	invoiceable: boolean,
	data: string,
	version: string
): InvoiceableSet {
	let newInvoiceableSetEvent = changetype<InvoiceableSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("invoiceable", ethereum.Value.fromBoolean(invoiceable)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newInvoiceableSetEvent.parameters = parameters;

	return newInvoiceableSetEvent
}