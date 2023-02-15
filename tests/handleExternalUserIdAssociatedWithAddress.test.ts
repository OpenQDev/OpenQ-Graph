import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { ExternalUserIdAssociatedWithAddress } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleExternalUserIdAssociatedWithAddress } from "../src/mapping";
import Constants from './constants';

describe('handleExternalUserIdAssociatedWithAddress', () => {
	afterEach(() => {
		clearStore()
	})

	test('can handle new external user id associated to address', () => {
		let newExternalUserIdAssociatedWithAddressEvent = createNewExternalUserIdAssociatedWithAddress(
			Constants.externalUserId,
			Constants.userId,
			Constants.externalUserId2,
			Constants.userId2,
			Constants.data,
			Constants.VERSION_1)

		newExternalUserIdAssociatedWithAddressEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)

		handleExternalUserIdAssociatedWithAddress(newExternalUserIdAssociatedWithAddressEvent)

		assert.fieldEquals('User', Constants.userId, 'externalUserId', Constants.externalUserId);

		/// CALL AGAIN TO ERASE OLD EXTERNAL USER ID - SAME USER ID, NEW ADDRESS
		let newExternalUserIdAssociatedWithAddressEvent2 = createNewExternalUserIdAssociatedWithAddress(
			Constants.externalUserId,
			Constants.userId2,
			Constants.externalUserId,
			Constants.userId,
			Constants.data,
			Constants.VERSION_1)

			newExternalUserIdAssociatedWithAddressEvent2.transaction.hash = Bytes.fromHexString(Constants.transactionHash)

		handleExternalUserIdAssociatedWithAddress(newExternalUserIdAssociatedWithAddressEvent2)

		assert.fieldEquals('User', Constants.userId, 'externalUserId', 'null');
		assert.fieldEquals('User', Constants.userId2, 'externalUserId', Constants.externalUserId);

		/// CALL AGAIN TO ERASE OLD EXTERNAL USER ID - SAME ADDRESS, NEW USER ID
		let newExternalUserIdAssociatedWithAddressEvent3 = createNewExternalUserIdAssociatedWithAddress(
			Constants.externalUserId2,
			Constants.userId2,
			Constants.externalUserId,
			Constants.userId2,
			Constants.data,
			Constants.VERSION_1)

			newExternalUserIdAssociatedWithAddressEvent3.transaction.hash = Bytes.fromHexString(Constants.transactionHash)

		handleExternalUserIdAssociatedWithAddress(newExternalUserIdAssociatedWithAddressEvent3)

		assert.fieldEquals('User', Constants.userId2, 'externalUserId', Constants.externalUserId2);

	})
})

export function createNewExternalUserIdAssociatedWithAddress(
	newExternalUserId: string,
	newAddress: string,
	formerExternalUserId: string,
	formerAddress: string,
	data: string,
	version: string): ExternalUserIdAssociatedWithAddress {
	let newExternalUserIdAssociatedWithAddressEvent = changetype<ExternalUserIdAssociatedWithAddress>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("newExternalUserId", ethereum.Value.fromString(newExternalUserId)),
		new ethereum.EventParam("newAddress", ethereum.Value.fromAddress(Address.fromString(newAddress))),
		new ethereum.EventParam("formerExternalUserId", ethereum.Value.fromString(formerExternalUserId)),
		new ethereum.EventParam("formerAddress", ethereum.Value.fromAddress(Address.fromString(formerAddress))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newExternalUserIdAssociatedWithAddressEvent.parameters = parameters;

	return newExternalUserIdAssociatedWithAddressEvent
}