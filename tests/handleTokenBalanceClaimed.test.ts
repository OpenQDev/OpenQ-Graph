import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenBalanceClaimed } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleTokenBalanceClaimed } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleTokenBalanceClaimed', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit claimed event', () => {
		let newTokenBalanceClaimedEvent = createNewTokenBalanceClaimedEvent(
			Constants.bountyId,
			Constants.bountyAddress,
			Constants.organization,
			Constants.closer,
			Constants.payoutTime,
			Constants.tokenAddress,
			Constants.volume,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version,
		)

		newTokenBalanceClaimedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newTokenBalanceClaimedEvent.transaction.from = Address.fromString(Constants.userId)

		handleTokenBalanceClaimed(newTokenBalanceClaimedEvent)

		assert.fieldEquals('Deposit', Constants.depositId, 'id', Constants.depositId)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'volume', Constants.volume)
		assert.fieldEquals('Deposit', Constants.depositId, 'payoutAddress', Constants.closer)
		assert.fieldEquals('Deposit', Constants.depositId, 'bounty', Constants.id)
		assert.fieldEquals('Deposit', Constants.depositId, 'payoutTime', Constants.payoutTime)
		assert.fieldEquals('Deposit', Constants.depositId, 'organization', Constants.organization)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenEvents', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenId', '0')
		assert.fieldEquals('Deposit', Constants.depositId, 'isNft', 'false')
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenId', '0')
	})
})

export function createNewTokenBalanceClaimedEvent(
	bountyId: string,
	bountyAddress: string,
	organization: string,
	closer: string,
	payoutTime: string,
	tokenAddress: string,
	volume: string,
	bountyType: string,
	data: string,
	version: string
): TokenBalanceClaimed {
	let newTokenBalanceClaimedEvent = changetype<TokenBalanceClaimed>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyId", ethereum.Value.fromBytes(Bytes.fromHexString(bountyId))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("closer", ethereum.Value.fromAddress(Address.fromString(closer))),
		new ethereum.EventParam("payoutTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(payoutTime))),
		new ethereum.EventParam("tokenAddress", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
		new ethereum.EventParam("volume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(volume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newTokenBalanceClaimedEvent.parameters = parameters;

	return newTokenBalanceClaimedEvent
}