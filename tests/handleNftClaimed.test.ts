import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { NFTClaimed } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleNftClaimed } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleNftClaimed', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit claimed event', () => {
		let newNFTClaimedEvent = createNewNFTClaimedEvent(
			Constants.bountyId,
			Constants.bountyAddress,
			Constants.organization,
			Constants.closer,
			Constants.payoutTime,
			Constants.tokenAddress,
			Constants.tokenId,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.VERSION_1
		)

		newNFTClaimedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newNFTClaimedEvent.transaction.from = Address.fromString(Constants.userId)

		handleNftClaimed(newNFTClaimedEvent)

		let payoutId = `${Constants.closer}-${Constants.id}-${Constants.tokenAddress}-${Constants.payoutTime}`

		assert.fieldEquals('Payout', payoutId, 'id', payoutId)
		assert.fieldEquals('Payout', payoutId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Payout', payoutId, 'bounty', Constants.id)
		assert.fieldEquals('Payout', payoutId, 'payoutTime', Constants.payoutTime)
		assert.fieldEquals('Payout', payoutId, 'isNft', 'true')
		assert.fieldEquals('Payout', payoutId, 'tokenId', Constants.tokenId)
		assert.fieldEquals('Payout', payoutId, 'organization', Constants.organization)
		assert.fieldEquals('Payout', payoutId, 'transactionHash', Constants.transactionHash)

		assert.fieldEquals('User', Constants.closer, 'id', Constants.closer)
	})
})

export function createNewNFTClaimedEvent(
	bountyId: string,
	bountyAddress: string,
	organization: string,
	closer: string,
	payoutTime: string,
	tokenAddress: string,
	tokenId: string,
	bountyType: string,
	data: string,
	version: string
): NFTClaimed {
	let newNFTClaimedEvent = changetype<NFTClaimed>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyId", ethereum.Value.fromBytes(Bytes.fromHexString(bountyId))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("closer", ethereum.Value.fromAddress(Address.fromString(closer))),
		new ethereum.EventParam("payoutTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(payoutTime))),
		new ethereum.EventParam("tokenAddress", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
		new ethereum.EventParam("tokenId", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newNFTClaimedEvent.parameters = parameters;

	return newNFTClaimedEvent
}