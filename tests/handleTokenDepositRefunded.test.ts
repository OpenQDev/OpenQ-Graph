import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { DepositRefunded } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleDepositRefunded } from "../src/mapping";
import { seedBounty, seedDeposit, constants } from './utils';

describe('handleDepositRefunded', () => {
	const bountyEntityId = '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
	const userId = '0x947f3fc93ab8b74c44f837d3031347ddbb32cf08'
	const depositId = '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b'
	const refundId = '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee6243'
	const tokenAddress = '0x46e09468616365256f11f4544e65ce0c70ee624b'
	const organization = 'mockOrg'
	const mockBountyId = 'mockBountyId'

	beforeEach(() => {
		seedBounty(
			bountyEntityId,
			mockBountyId,
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'1',
			'1',
			organization,
			'1',
			'1',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
		)

		seedDeposit()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit received', () => {
		let newDepositRefundedEvent = createNewDepositRefundedEvent(
			depositId,
			mockBountyId,
			bountyEntityId,
			organization,
			'1',
			tokenAddress,
			'100',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1'
		)

		const transactionHash = Bytes.fromHexString("0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b")
		newDepositRefundedEvent.transaction.hash = transactionHash
		newDepositRefundedEvent.transaction.from = Address.fromString(userId)

		handleDepositRefunded(newDepositRefundedEvent)

		assert.fieldEquals('Refund', refundId, 'id', depositId)
		// assert.fieldEquals('Refund', refundId, 'bounty', bountyEntityId)
		// assert.fieldEquals('Refund', refundId, 'refundTime', '1')
		// assert.fieldEquals('Refund', refundId, 'organization', organization)
		// assert.fieldEquals('Refund', refundId, 'depositId', depositId)
		// assert.fieldEquals('Refund', refundId, 'volume', '100')
		// assert.fieldEquals('Refund', refundId, 'tokenAddress', tokenAddress)
		// assert.fieldEquals('Refund', refundId, 'transactionHash', transactionHash.toHexString())

		// assert.fieldEquals('FundedTokenBalance', tokenAddress, 'id', tokenAddress)

		// const userFundedTokenBalanceId = `${userId}-${tokenAddress}`
		// assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'id', userFundedTokenBalanceId)
		// assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'user', userId)
		// assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		// assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'volume', '100')

		// const bountyFundedTokenBalanceId = `${bountyEntityId}-${tokenAddress}`
		// assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'id', bountyFundedTokenBalanceId)
		// assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'bounty', bountyEntityId)
		// assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		// assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'volume', '100')

		// const organizationFundedTokenBalanceId = `${organization}-${tokenAddress}`
		// assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'id', organizationFundedTokenBalanceId)
		// assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'organization', organization)
		// assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		// assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'volume', '100')
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