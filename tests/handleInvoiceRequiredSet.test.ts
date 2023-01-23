import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { InvoiceRequiredSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleInvoiceRequiredSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleInvoiceRequiredSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle invoiceRequired set event', () => {
		let newInvoiceRequiredSetEvent = createNewInvoiceRequiredSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.VERSION_1
		)

		newInvoiceRequiredSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceRequiredSetEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Bounty', Constants.id, 'invoiceRequired', 'false')

		handleInvoiceRequiredSet(newInvoiceRequiredSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'invoiceRequired', 'true')
	})
})

export function createNewInvoiceRequiredSetEvent(
	bountyAddress: string,
	invoiceRequired: boolean,
	data: string,
	version: string
): InvoiceRequiredSet {
	let newInvoiceRequiredSetEvent = changetype<InvoiceRequiredSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("invoiceRequired", ethereum.Value.fromBoolean(invoiceRequired)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newInvoiceRequiredSetEvent.parameters = parameters;

	return newInvoiceRequiredSetEvent
}