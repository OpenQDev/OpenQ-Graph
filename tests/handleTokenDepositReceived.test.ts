import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TokenDepositReceived } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleTokenDepositReceived } from "../src/mapping";
import seedBounty from './utils';

describe('handleTokenDepositReceived', () => {
	const bountyEntityId = '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4'
	const userId = '0x947f3fc93ab8b74c44f837d3031347ddbb32cf08'
	const depositId = '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b'
	const tokenAddress = '0x46e09468616365256f11f4544e65ce0c70ee624b'
	const organization = 'mockOrg'

	beforeEach(() => {
		seedBounty(
			bountyEntityId,
			'mockBountyId',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4',
			'1',
			'1',
			organization,
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
			depositId,
			bountyEntityId,
			'mockBountyId',
			organization,
			tokenAddress,
			'1',
			userId,
			'1',
			'100',
			'1',
			'0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b',
			'1'
		)

		const transactionHash = Bytes.fromHexString("0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b")
		newTokenDepositReceivedEvent.transaction.hash = transactionHash
		newTokenDepositReceivedEvent.transaction.from = Address.fromString(userId)

		handleTokenDepositReceived(newTokenDepositReceivedEvent)

		assert.fieldEquals('Deposit', depositId, 'id', depositId)
		assert.fieldEquals('Deposit', depositId, 'tokenAddress', tokenAddress)
		assert.fieldEquals('Deposit', depositId, 'volume', '100')
		assert.fieldEquals('Deposit', depositId, 'sender', userId)
		assert.fieldEquals('Deposit', depositId, 'bounty', bountyEntityId)
		assert.fieldEquals('Deposit', depositId, 'receiveTime', '1')
		assert.fieldEquals('Deposit', depositId, 'organization', organization)
		assert.fieldEquals('Deposit', depositId, 'tokenEvents', tokenAddress)
		assert.fieldEquals('Deposit', depositId, 'refunded', 'false')
		assert.fieldEquals('Deposit', depositId, 'transactionHash', transactionHash.toHexString())
		assert.fieldEquals('Deposit', depositId, 'tokenId', '0')
		assert.fieldEquals('Deposit', depositId, 'expiration', '1')

		assert.fieldEquals('FundedTokenBalance', tokenAddress, 'id', tokenAddress)

		const userFundedTokenBalanceId = `${userId}-${tokenAddress}`
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'id', userFundedTokenBalanceId)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'user', userId)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		assert.fieldEquals('UserFundedTokenBalance', userFundedTokenBalanceId, 'volume', '100')

		const bountyFundedTokenBalanceId = `${bountyEntityId}-${tokenAddress}`
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'id', bountyFundedTokenBalanceId)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'bounty', bountyEntityId)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		assert.fieldEquals('BountyFundedTokenBalance', bountyFundedTokenBalanceId, 'volume', '100')

		const organizationFundedTokenBalanceId = `${organization}-${tokenAddress}`
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'id', organizationFundedTokenBalanceId)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'organization', organization)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'tokenAddress', tokenAddress)
		assert.fieldEquals('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId, 'volume', '100')
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