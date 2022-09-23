import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { DepositRefunded } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleDepositRefunded } from "../src/mapping";
import { seedBounty, seedDeposit, seedDeposit2, seedBountyFundedTokenBalance, seedOrganizationFundedTokenBalance, seedUserFundedTokenBalance, seedFundedTokenBalance } from './utils';
import Constants from './constants'

describe('handleDepositRefunded', () => {

	beforeEach(() => {
		seedBounty()
		seedDeposit()
		seedDeposit2()
		seedBountyFundedTokenBalance()
		seedOrganizationFundedTokenBalance()
		seedUserFundedTokenBalance()
		seedFundedTokenBalance()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit received', () => {
		let newDepositRefundedEvent = createNewDepositRefundedEvent(
			Constants.depositId,
			Constants.bountyId,
			Constants.id,
			Constants.organization,
			Constants.refundTime,
			Constants.tokenAddress,
			Constants.volume,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version
		)

		newDepositRefundedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newDepositRefundedEvent.transaction.from = Address.fromString(Constants.userId)

		handleDepositRefunded(newDepositRefundedEvent)

		assert.fieldEquals('Refund', Constants.depositId, 'id', Constants.depositId)
		assert.fieldEquals('Refund', Constants.depositId, 'bounty', Constants.id)
		assert.fieldEquals('Refund', Constants.depositId, 'refundTime', Constants.refundTime)
		assert.fieldEquals('Refund', Constants.depositId, 'organization', Constants.organization)
		assert.fieldEquals('Refund', Constants.depositId, 'depositId', Constants.depositId)
		assert.fieldEquals('Refund', Constants.depositId, 'volume', Constants.volume)
		assert.fieldEquals('Refund', Constants.depositId, 'tokenAddress', Constants.tokenAddress)
		assert.fieldEquals('Refund', Constants.depositId, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Refund', Constants.depositId, 'sender', Constants.userId)

		assert.fieldEquals('Deposit', Constants.depositId, 'refunded', 'true')
		assert.fieldEquals('Deposit', Constants.depositId, 'refundTime', Constants.refundTime)

		assert.fieldEquals('TokenEvents', Constants.tokenAddress, 'id', Constants.tokenAddress)

		assert.fieldEquals('FundedTokenBalance', Constants.tokenAddress, 'id', Constants.tokenAddress)
		assert.fieldEquals('FundedTokenBalance', Constants.tokenAddress, 'volume', '900')

		const userFundedTokenBalanceId = `${Constants.userId}-${Constants.tokenAddress}`
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'id', userFundedTokenBalanceId)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'volume', '900')

		const organizationFundedTokenBalanceId = `${Constants.organization}-${Constants.tokenAddress}`
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'id', organizationFundedTokenBalanceId)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'volume', '900')

		const bountyFundedTokenBalanceId = `${Constants.id}-${Constants.tokenAddress}`
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'id', bountyFundedTokenBalanceId)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'volume', '900')

		let secondDepositRefundedEvent = createNewDepositRefundedEvent(
			Constants.depositId2,
			Constants.bountyId,
			Constants.id,
			Constants.organization,
			Constants.refundTime,
			Constants.tokenAddress,
			Constants.volume_900,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version
		)

		newDepositRefundedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newDepositRefundedEvent.transaction.from = Address.fromString(Constants.userId)

		handleDepositRefunded(secondDepositRefundedEvent)

		assert.notInStore('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId)
		assert.notInStore('BountyFundedTokenBalance', bountyFundedTokenBalanceId)
		assert.notInStore('UserFundedTokenBalance', userFundedTokenBalanceId)
		assert.notInStore('FundedTokenBalance', Constants.tokenAddress)
	})
})

export function createNewDepositRefundedEvent(
	depositId: string,
	bountyId: string,
	bountyAddress: string,
	organization: string,
	refundTime: string,
	tokenAddress: string,
	volume: string,
	bountyType: string,
	data: string,
	version: string
): DepositRefunded {
	let newDepositRefundedEvent = changetype<DepositRefunded>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("depositId", ethereum.Value.fromBytes(Bytes.fromHexString(depositId))),
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("refundTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(refundTime))),
		new ethereum.EventParam("tokenAddress", ethereum.Value.fromAddress(Address.fromString(tokenAddress))),
		new ethereum.EventParam("volume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(volume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newDepositRefundedEvent.parameters = parameters;

	return newDepositRefundedEvent
}