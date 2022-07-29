import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenDepositReceived } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleTokenDepositReceived } from "../src/mapping";
import seedBounty from './utils';

describe('handleTokenDepositReceived', () => {
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

	test('can handle new token deposit received', () => {
		let newTokenDepositReceivedEvent = createNewTokenDepositReceivedEvent(
			'depositId',
			bountyEntityId,
			'mockBountyId',
			'mockOrganization',
			bountyEntityId,
			'1',
			bountyEntityId,
			'1',
			'100',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1'
		)

		newTokenDepositReceivedEvent.transaction.hash = Bytes.fromHexString("0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b")
		// newTokenDepositReceivedEvent.transaction.from = Address.fromString(bountyEntityId)

		handleTokenDepositReceived(newTokenDepositReceivedEvent)
	})
})

export function createNewTokenDepositReceivedEvent(
	depositId: string,
	bountyAddress: string,
	bountyId: string,
	organization: string,
	tokenAddress: string,
	receiveTime: string,
	sender: string,
	expiration: string,
	volume: string,
	bountyType: string,
	data: string,
	version: string
): TokenDepositReceived {
	let newTokenDepositReceivedEvent = changetype<TokenDepositReceived>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("depositId", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("tokenAddress", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
		new ethereum.EventParam("receiveTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(receiveTime))),
		new ethereum.EventParam("sender", ethereum.Value.fromAddress(Address.fromString(sender))),
		new ethereum.EventParam("expiration", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(expiration))),
		new ethereum.EventParam("volume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(volume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newTokenDepositReceivedEvent.parameters = parameters;

	return newTokenDepositReceivedEvent
}