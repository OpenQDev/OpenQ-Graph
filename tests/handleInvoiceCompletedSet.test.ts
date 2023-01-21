import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { InvoiceCompletedSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleInvoiceCompletedSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleInvoiceCompletedSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle invoiceCompleted set event', () => {
		let newInvoiceCompletedSetEvent = createNewInvoiceCompletedSetEvent(
			Constants.id,
			Constants.invoiceCompleted,
			Constants.data,
			Constants.VERSION_1
		)

		newInvoiceCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleInvoiceCompletedSet(newInvoiceCompletedSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'invoiceCompleted', `[${Constants.invoiceCompleted[0]}, ${Constants.invoiceCompleted[1]}]`)
	})
})

export function createNewInvoiceCompletedSetEvent(
	bountyAddress: string,
	invoiceCompleted: boolean[],
	data: string,
	version: string
): InvoiceCompletedSet {
	let newInvoiceCompletedSetEvent = changetype<InvoiceCompletedSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("invoiceCompleted", ethereum.Value.fromBooleanArray(invoiceCompleted)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newInvoiceCompletedSetEvent.parameters = parameters;

	return newInvoiceCompletedSetEvent
}