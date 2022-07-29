import { Bytes, BigInt, Address, store, Entity } from '@graphprotocol/graph-ts';
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
	entity.setString('bountyType', Constants.bountyType_SINGLE)
	entity.setBytes('transactionHash', Bytes.fromHexString(Constants.transactionHash))
	entity.setBigInt('version', BigInt.fromString(Constants.version))

	store.set('Bounty', Constants.id, entity)
}

export function seedDeposit(): void {
	let entity = new Entity()

	entity.setString('id', Constants.id)
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

	store.set('Deposit', Constants.depositId, entity)
}