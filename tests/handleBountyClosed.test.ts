import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { BountyClosed } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleBountyClosed } from "../src/mapping";
import seedBounty from './utils';

describe('handleBountyClosed', () => {
	const bountyEntityId = '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'

	beforeEach(() => {
		seedBounty(
			bountyEntityId,
			'mockBountyId',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'1',
			'1',
			'orgMock',
			'1',
			'1',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
		)
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new bounty closed', () => {
		let newBountyClosedEvent = createNewBountyClosedEvent(
			"mockBountyId",
			bountyEntityId,
			"orgMock",
			"0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4",
			'12345678',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1')

		newBountyClosedEvent.transaction.hash = Bytes.fromHexString("0x")
		handleBountyClosed(newBountyClosedEvent)

		assert.fieldEquals('Bounty', bountyEntityId, 'bountyClosedTime', '12345678')
		assert.fieldEquals('Bounty', bountyEntityId, 'bountyClosedTime', '12345678')
		assert.fieldEquals('Bounty', bountyEntityId, 'closer', '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4')
		assert.fieldEquals('Bounty', bountyEntityId, 'status', '2')
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