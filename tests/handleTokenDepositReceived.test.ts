import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenDepositReceived } from "../generated/DepositManager/DepositManager";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, log } from "matchstick-as/assembly/index";
import { handleTokenDepositReceived } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleTokenDepositReceived', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit received - VERSION 1', () => {
		let newTokenDepositReceivedEvent = createNewTokenDepositReceivedEvent(
			Constants.depositId,
			Constants.id,
			Constants.bountyId,
			Constants.organization,
			Constants.tokenAddress,
			Constants.receiveTime,
			Constants.userId,
			Constants.expiration,
			Constants.volume,
			Constants.bountyType_ATOMIC,
			Constants.funderData,
			Constants.VERSION_1
		)

		newTokenDepositReceivedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newTokenDepositReceivedEvent.transaction.from = Address.fromString(Constants.userId)

		handleTokenDepositReceived(newTokenDepositReceivedEvent)

		assert.fieldEquals('Deposit', Constants.depositId, 'id', Constants.depositId)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'volume', Constants.volume)
		assert.fieldEquals('Deposit', Constants.depositId, 'sender', Constants.userId)
		assert.fieldEquals('Deposit', Constants.depositId, 'bounty', Constants.id)
		assert.fieldEquals('Deposit', Constants.depositId, 'receiveTime', Constants.receiveTime)
		assert.fieldEquals('Deposit', Constants.depositId, 'organization', Constants.organization)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenEvents', Constants.tokenAddress)
		assert.fieldEquals('Deposit', Constants.depositId, 'refunded', 'false')
		assert.fieldEquals('Deposit', Constants.depositId, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Deposit', Constants.depositId, 'tokenId', '0')
		assert.fieldEquals('Deposit', Constants.depositId, 'expiration', Constants.expiration)
		assert.fieldEquals('Deposit', Constants.depositId, 'funderUuid', Constants.funderUuid)

		assert.fieldEquals('FundedTokenBalance', Constants.tokenAddress, 'id', Constants.tokenAddress)

		const userFundedTokenBalanceId = `${Constants.userId}-${Constants.tokenAddress}`
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'id', userFundedTokenBalanceId)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'user', Constants.userId)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'volume', '100')

		const bountyFundedTokenBalanceId = `${Constants.id}-${Constants.tokenAddress}`
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'id', bountyFundedTokenBalanceId)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'bounty', Constants.id)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'volume', Constants.volume)

		const organizationFundedTokenBalanceId = `${Constants.organization}-${Constants.tokenAddress}`
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'id', organizationFundedTokenBalanceId)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'organization', Constants.organization)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'volume', Constants.volume)
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
		new ethereum.EventParam("depositId", ethereum.Value.fromBytes(Bytes.fromHexString(depositId))),
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