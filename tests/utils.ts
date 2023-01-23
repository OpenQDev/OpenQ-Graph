import { log, Bytes, BigInt, Address, store, ethereum, Entity } from '@graphprotocol/graph-ts';
import Constants from './constants'

export function seedBounty(): void {
	let entity = new Entity()

	entity.setString('id', Constants.id)
	entity.setString('bountyId', Constants.bountyId)
	entity.setBytes('bountyAddress', Address.fromString(Constants.bountyAddress))
	entity.setString('issuer', Constants.userId)
	entity.setBigInt('bountyMintTime', BigInt.fromString(Constants.bountyMintTime))
	entity.setBigInt('status', BigInt.fromString(Constants.status))
	entity.setString('organization', Constants.organization)
	entity.setString('bountyType', Constants.bountyType_ATOMIC)
	entity.setBytes('transactionHash', Bytes.fromHexString(Constants.transactionHash))
	entity.setBigInt('version', BigInt.fromString(Constants.VERSION_1))
	entity.setBoolean('hasFundingGoal', false)
	entity.setBoolean('invoiceRequired', false)
	entity.setBoolean('kycRequired', false)

	store.set('Bounty', Constants.id, entity)
}

export function seedOrganizationFundedTokenBalance(): void {
	let entity = new Entity()

	const organizationId = `${Constants.organization}-${Constants.tokenAddress}`

	entity.setString('id', organizationId)
	entity.setString('organization', Constants.organization)
	entity.setBytes('tokenAddress', Bytes.fromHexString(Constants.tokenAddress))
	entity.setBigInt('volume', BigInt.fromString('1000'))

	store.set('OrganizationFundedTokenBalance', organizationId, entity)
}

export function seedUserFundedTokenBalance(): void {
	let entity = new Entity()

	const userFundedTokenBalanceId = `${Constants.userId}-${Constants.tokenAddress}`

	entity.setString('id', userFundedTokenBalanceId)
	entity.setString('user', Constants.userId)
	entity.setBytes('tokenAddress', Bytes.fromHexString(Constants.tokenAddress))
	entity.setBigInt('volume', BigInt.fromString('1000'))

	store.set('UserFundedTokenBalance', userFundedTokenBalanceId, entity)
}

export function seedUser(): void {
	let entity = new Entity()

	entity.setString('id', Constants.userId)

	store.set('User', Constants.userId, entity)
}

export function seedFundedTokenBalance(): void {
	let entity = new Entity()

	const fundedTokenBalanceId = Constants.tokenAddress;

	entity.setString('id', fundedTokenBalanceId)
	entity.setBigInt('volume', BigInt.fromString('1000'))

	store.set('FundedTokenBalance', fundedTokenBalanceId, entity)
}

export function seedBountyFundedTokenBalance(): void {
	let entity = new Entity()

	const bountyFundedTokenBalanceId = `${Constants.bountyAddress}-${Constants.tokenAddress}`

	entity.setString('id', bountyFundedTokenBalanceId)
	entity.setString('bounty', Constants.bountyAddress)
	entity.setBytes('tokenAddress', Bytes.fromHexString(Constants.tokenAddress))
	entity.setBigInt('volume', BigInt.fromString('1000'))

	store.set('BountyFundedTokenBalance', bountyFundedTokenBalanceId, entity)
}

export function seedDeposit(): void {
	let entity = new Entity()

	entity.setString('id', Constants.depositId)
	entity.setBytes('tokenAddress', Bytes.fromHexString(Constants.tokenAddress))
	entity.setBigInt('volume', BigInt.fromString(Constants.volume))
	entity.setString('sender', Constants.userId)
	entity.setString('bounty', Constants.id)
	entity.setBigInt('receiveTime', BigInt.fromString(Constants.receiveTime))
	entity.setString('organization', Constants.organization)
	entity.setString('tokenEvents', Constants.tokenAddress)
	entity.setBoolean('refunded', false)
	entity.setBytes('transactionHash', Bytes.fromHexString(Constants.transactionHash))
	entity.setBigInt('tokenId', BigInt.fromString('0'))
	entity.setBigInt('expiration', BigInt.fromString(Constants.expiration))
	entity.setBigInt('refundTime', BigInt.fromString('0'))
	entity.setBoolean('isNft', false)

	store.set('Deposit', Constants.depositId, entity)
}

export function seedDeposit2(): void {
	let entity = new Entity()

	entity.setString('id', Constants.depositId2)
	entity.setBytes('tokenAddress', Bytes.fromHexString(Constants.tokenAddress))
	entity.setBigInt('volume', BigInt.fromString(Constants.volume_900))
	entity.setString('sender', Constants.userId)
	entity.setString('bounty', Constants.id)
	entity.setBigInt('receiveTime', BigInt.fromString(Constants.receiveTime))
	entity.setString('organization', Constants.organization)
	entity.setString('tokenEvents', Constants.tokenAddress)
	entity.setBoolean('refunded', false)
	entity.setBytes('transactionHash', Bytes.fromHexString(Constants.transactionHash))
	entity.setBigInt('tokenId', BigInt.fromString('0'))
	entity.setBigInt('expiration', BigInt.fromString(Constants.expiration))
	entity.setBigInt('refundTime', BigInt.fromString('0'))
	entity.setBoolean('isNft', false)

	store.set('Deposit', Constants.depositId2, entity)
}

export const removeTuplePrefix = (encoded: Bytes): string => {
	const tuplePrefix = '0x0000000000000000000000000000000000000000000000000000000000000020'
	const noTuplePrefix = encoded.toHexString().replace(tuplePrefix, '')
	const withoutTuplePrefixWith0x = '0x'.concat(noTuplePrefix)
	return withoutTuplePrefixWith0x
}