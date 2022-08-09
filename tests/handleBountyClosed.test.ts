import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { BountyClosed } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleBountyClosed } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants';

describe('handleBountyClosed', () => {
	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new bounty closed', () => {
		let newBountyClosedEvent = createNewBountyClosedEvent(
			Constants.bountyId,
			Constants.id,
			Constants.organization,
			Constants.userId,
			Constants.bountyClosedTime,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version)

		newBountyClosedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)

		handleBountyClosed(newBountyClosedEvent)

		assert.fieldEquals('Bounty', Constants.id, 'bountyClosedTime', Constants.bountyClosedTime)
		assert.fieldEquals('Bounty', Constants.id, 'closer', Constants.userId)
		assert.fieldEquals('Bounty', Constants.id, 'status', Constants.status_CLOSED)
	})
})

export function createNewBountyClosedEvent(
	bountyId: string,
	bountyAddress: string,
	organization: string,
	closer: string,
	bountyClosedTime: string,
	bountyType: string,
	data: string,
	version: string): BountyClosed {
	let newBountyClosedEvent = changetype<BountyClosed>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("closer", ethereum.Value.fromAddress(Address.fromString(closer))),
		new ethereum.EventParam("bountyClosedTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyClosedTime))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newBountyClosedEvent.parameters = parameters;

	return newBountyClosedEvent
}