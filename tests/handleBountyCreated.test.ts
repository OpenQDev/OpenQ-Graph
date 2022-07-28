import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { BountyCreated } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, logStore, log } from "matchstick-as/assembly/index";
import { handleBountyCreated } from "../src/mapping";

describe('handleBountyCreated', () => {
	const bountyEntityId = '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'

	beforeEach(() => { })

	afterEach(() => {
		clearStore()
	})

	test('can handle new BountyCreated', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			"mockBountyId",
			"orgMock",
			"0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4",
			bountyEntityId,
			'12345678',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1')

		newBountyCreatedEvent.transaction.hash = Bytes.fromHexString("0x")

		// ACT
		handleBountyCreated(newBountyCreatedEvent)

		logStore()

		// ASSERT
		assert.fieldEquals('Bounty', bountyEntityId, 'bountyId', 'mockBountyId')
		assert.fieldEquals('Bounty', bountyEntityId, 'organization', 'orgMock')
		assert.fieldEquals('Bounty', bountyEntityId, 'issuer', '0xa16081f360e3847006db660bae1c6d1b2e17ec2a')
		assert.fieldEquals('Bounty', bountyEntityId, 'bountyAddress', bountyEntityId)
		assert.fieldEquals('Bounty', bountyEntityId, 'bountyMintTime', '12345678')
		assert.fieldEquals('Bounty', bountyEntityId, 'bountyType', '1')
		assert.fieldEquals('Bounty', bountyEntityId, 'version', '1')
	})
})

export function createNewBountyCreatedEvent(
	bountyId: string,
	organization: string,
	issuerAddress: string,
	bountyAddress: string,
	bountyMintTime: string,
	bountyType: string,
	data: string,
	version: string
): BountyCreated {
	let newBountyCreatedEvent = changetype<BountyCreated>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("issuerAddress", ethereum.Value.fromAddress(Address.fromString(issuerAddress))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyMintTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyMintTime))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newBountyCreatedEvent.parameters = parameters;

	return newBountyCreatedEvent
}