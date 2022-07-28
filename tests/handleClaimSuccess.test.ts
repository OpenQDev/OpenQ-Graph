import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { ClaimSuccess } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleClaimSuccess } from "../src/mapping";
import seedBounty from './utils';

describe('handleClaimSuccess', () => {
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
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
		)
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new bounty closed', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			"1",
			"0x",
			"1")

		newClaimSuccessEvent.transaction.hash = Bytes.fromHexString("0x")
		handleClaimSuccess(newClaimSuccessEvent)

		assert.fieldEquals('Claim', bountyEntityId, 'bountyClosedTime', '12345678')
		assert.fieldEquals('Claim', bountyEntityId, 'bountyClosedTime', '12345678')
		assert.fieldEquals('Claim', bountyEntityId, 'closer', '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4')
	})
})

event ClaimSuccess(uint256 bountyType, bytes data, uint256 version);

export function createNewClaimSuccessEvent(
	bountyType: string,
	data: string,
	version: string): ClaimSuccess {
	let newClaimSuccessEvent = changetype<ClaimSuccess>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newClaimSuccessEvent.parameters = parameters;

	return newClaimSuccessEvent
}