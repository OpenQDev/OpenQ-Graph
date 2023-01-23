import { log, Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenBalanceClaimed } from "../generated/ClaimManager/ClaimManager";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, logStore } from "matchstick-as/assembly/index";
import { handleTokenBalanceClaimed } from "../src/mapping";
import { seedBounty, seedOrganizationFundedTokenBalance, seedBountyFundedTokenBalance } from './utils';
import Constants from './constants'

describe('handleTokenBalanceClaimed', () => {

	beforeEach(() => {
		seedBounty()
		seedOrganizationFundedTokenBalance()
		seedBountyFundedTokenBalance()
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
			Constants.VERSION_1,
		)

		newTokenBalanceClaimedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newTokenBalanceClaimedEvent.transaction.from = Address.fromString(Constants.closer)

		handleTokenBalanceClaimed(newTokenBalanceClaimedEvent)

		let bountyPayoutId = `${Constants.closer}-${Constants.bountyAddress}-${Constants.tokenAddress}-${Constants.payoutTime}`

		assert.fieldEquals('Payout', bountyPayoutId, 'id', bountyPayoutId)
		assert.fieldEquals('Payout', bountyPayoutId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Payout', bountyPayoutId, 'volume', Constants.volume)
		assert.fieldEquals('Payout', bountyPayoutId, 'closer', Constants.closer)
		assert.fieldEquals('Payout', bountyPayoutId, 'bounty', Constants.id)
		assert.fieldEquals('Payout', bountyPayoutId, 'payoutTime', Constants.payoutTime)
		assert.fieldEquals('Payout', bountyPayoutId, 'organization', Constants.organization)
		assert.fieldEquals('Payout', bountyPayoutId, 'tokenEvents', Constants.tokenAddress)
		assert.fieldEquals('Payout', bountyPayoutId, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Payout', bountyPayoutId, 'volume', Constants.volume)
		assert.fieldEquals('Payout', bountyPayoutId, 'isNft', 'false')

		const organizationFundedTokenBalanceId = `${Constants.organization}-${Constants.tokenAddress}`
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'id', organizationFundedTokenBalanceId)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'organization', Constants.organization)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'volume', '900')

		const organizationPayoutTokenBalanceId = `${Constants.organization}-${Constants.tokenAddress}`
		assert.fieldEquals('OrganizationPayoutTokenBalance', organizationPayoutTokenBalanceId, 'id', organizationPayoutTokenBalanceId)
		assert.fieldEquals('OrganizationPayoutTokenBalance', organizationPayoutTokenBalanceId, 'organization', Constants.organization)
		assert.fieldEquals('OrganizationPayoutTokenBalance', organizationPayoutTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('OrganizationPayoutTokenBalance', organizationPayoutTokenBalanceId, 'volume', Constants.volume)

		const userPayoutTokenBalanceId = `${Constants.closer}-${Constants.tokenAddress}`
		assert.fieldEquals('UserPayoutTokenBalance', userPayoutTokenBalanceId, 'id', userPayoutTokenBalanceId)
		assert.fieldEquals('UserPayoutTokenBalance', userPayoutTokenBalanceId, 'user', Constants.closer)
		assert.fieldEquals('UserPayoutTokenBalance', userPayoutTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('UserPayoutTokenBalance', userPayoutTokenBalanceId, 'volume', Constants.volume)

		assert.fieldEquals('PayoutTokenBalance', Constants.tokenAddress, 'id', Constants.tokenAddress)
		assert.fieldEquals('PayoutTokenBalance', Constants.tokenAddress, 'volume', Constants.volume)

		assert.fieldEquals('TokenEvents', Constants.tokenAddress, 'id', Constants.tokenAddress)
		assert.fieldEquals('PayoutTokenBalance', Constants.tokenAddress, 'volume', Constants.volume)

		const bountyFundedTokenBalanceId = `${Constants.bountyAddress}-${Constants.tokenAddress}`
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'id', bountyFundedTokenBalanceId)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'volume', '900')

		// DELETES OrganizationFundedTokenBalance IF ZERO
		let newerTokenBalanceClaimedEvent = createNewTokenBalanceClaimedEvent(
			Constants.bountyId,
			Constants.bountyAddress,
			Constants.organization,
			Constants.closer,
			Constants.payoutTime,
			Constants.tokenAddress,
			'900',
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.VERSION_1,
		)

		handleTokenBalanceClaimed(newerTokenBalanceClaimedEvent)

		assert.notInStore('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId)
		assert.notInStore('BountyFundedTokenBalance', bountyFundedTokenBalanceId)
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