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

	test('can handle invoiceCompleted set event - ATOMIC', () => {
		let newInvoiceCompletedSetEvent = createNewInvoiceCompletedSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.invoiceCompletedData_ATOMIC,
			Constants.VERSION_1
		)

		let newInvoiceCompletedSetEvent_false = createNewInvoiceCompletedSetEvent(
			Constants.id,
			Constants.bountyType_ATOMIC,
			Constants.invoiceCompletedData_ATOMIC_false,
			Constants.VERSION_1
		)

		newInvoiceCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleInvoiceCompletedSet(newInvoiceCompletedSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'invoiceCompleted', `[true]`)
		handleInvoiceCompletedSet(newInvoiceCompletedSetEvent_false)
		assert.fieldEquals('Bounty', Constants.id, 'invoiceCompleted', 'null')
	})

	test('can handle invoiceCompleted set event - TIERED', () => {
		let newInvoiceCompletedSetEvent = createNewInvoiceCompletedSetEvent(
			Constants.id,
			Constants.bountyType_TIERED,
			Constants.invoiceCompletedData_TIERED,
			Constants.VERSION_1
		)

		newInvoiceCompletedSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceCompletedSetEvent.transaction.from = Address.fromString(Constants.userId)

		handleInvoiceCompletedSet(newInvoiceCompletedSetEvent)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'invoiceCompleted', `[${Constants.invoiceCompleted[0]}, ${Constants.invoiceCompleted[1]}, ${Constants.invoiceCompleted[2]}]`)
	})
})

export function createNewInvoiceCompletedSetEvent(
	bountyAddress: string,
	bountyType: string,
	data: string,
	version: string
): InvoiceCompletedSet {
	let newInvoiceCompletedSetEvent = changetype<InvoiceCompletedSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newInvoiceCompletedSetEvent.parameters = parameters;

	return newInvoiceCompletedSetEvent
}