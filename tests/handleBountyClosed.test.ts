import { Bytes, BigInt, Address, ethereum, store, Entity } from '@graphprotocol/graph-ts';
import { BountyClosed } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, logStore, log, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleBountyClosed } from "../src/mapping";

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

afterEach(() => {
	clearStore()
})

export function seedBounty(
	id: string,
	bountyId: string,
	bountyAddress: string,
	issuer: string,
	bountyMintTime: string,
	status: string,
	organization: string,
	transactionHash: string): void {
	let entity = new Entity()
	entity.setString('id', bountyAddress)
	entity.setString('bountyId', bountyId)
	entity.setBytes('bountyAddress', Address.fromString(bountyAddress))
	entity.setString('issuer', issuer)
	entity.setBigInt('bountyMintTime', BigInt.fromString(bountyMintTime))
	entity.setBigInt('status', BigInt.fromString(status))
	entity.setString('organization', organization)
	entity.setBytes('transactionHash', Bytes.fromHexString(transactionHash))

	store.set('Bounty', '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4', entity)
}

beforeEach(() => {
	seedBounty(
		'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
		'mockBountyId',
		'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
		'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
		'1',
		'1',
		'orgMock',
		'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
	)
})



describe('handleBountyClosed', () => {
	test('can handle new bounty closed', () => {

		let newBountyClosedEvent = createNewBountyClosedEvent(
			"mockBountyId",
			"0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4",
			"orgMock",
			"0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4",
			'1',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1')

		logStore()

		newBountyClosedEvent.transaction.hash = Bytes.fromHexString("0x")
		handleBountyClosed(newBountyClosedEvent)

		logStore()

		// assert.fieldEquals('Bounty', '0x', 'bountyId', 'mockId')
		// assert.notInStore('Bounty', '0xnothere')

		// log.success("hi", [])
	})
})