import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { ExternalUserIdAssociatedWithAddress } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleExternalUserIdAssociatedWithAddress } from "../src/mapping";
import { seedUser } from './utils';
import Constants from './constants';

describe('handleExternalUserIdAssociatedWithAddress', () => {
	beforeEach(() => {
		seedUser()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new external user id associated to address', () => {
		let newExternalUserIdAssociatedWithAddressEvent = createNewExternalUserIdAssociatedWithAddress(
			Constants.externalUserId,
			Constants.userId,
			Constants.data,
			Constants.version)

		newExternalUserIdAssociatedWithAddressEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)

		handleExternalUserIdAssociatedWithAddress(newExternalUserIdAssociatedWithAddressEvent)

		assert.fieldEquals('User', Constants.userId, 'externalUserId', Constants.externalUserId);
	})
})

export function createNewExternalUserIdAssociatedWithAddress(
	externalUserId: string,
	newAddress: string,
	data: string,
	version: string): ExternalUserIdAssociatedWithAddress {
	let newExternalUserIdAssociatedWithAddressEvent = changetype<ExternalUserIdAssociatedWithAddress>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("externalUserId", ethereum.Value.fromString(externalUserId)),
		new ethereum.EventParam("newAddress", ethereum.Value.fromAddress(Address.fromString(newAddress))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newExternalUserIdAssociatedWithAddressEvent.parameters = parameters;

	return newExternalUserIdAssociatedWithAddressEvent
}