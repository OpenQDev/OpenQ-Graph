import { Bytes, BigInt, Address, store, Entity } from '@graphprotocol/graph-ts';
import Constants from './constants'

export function seedBounty(): void {
	let entity = new Entity()

	entity.setString('id', Constants.id)
	entity.setString('bountyId', Constants.bountyId)
	entity.setBytes('bountyAddress', Address.fromString(Constants.bountyAddress))
	entity.setString('issuer', Constants.issuer)
	entity.setBigInt('bountyMintTime', BigInt.fromString(Constants.bountyMintTime))
	entity.setBigInt('status', BigInt.fromString(Constants.status))
	entity.setString('organization', Constants.organization)
	entity.setString('bountyType', Constants.bountyType)
	entity.setBytes('transactionHash', Bytes.fromHexString(Constants.transactionHash))
	entity.setBigInt('version', BigInt.fromString(Constants.version))

	store.set('Bounty', Constants.id, entity)
}

export function seedDeposit(): void {
	let entity = new Entity()
	entity.setString('id', bountyAddress)
	entity.setString('bountyId', bountyId)
	entity.setBytes('bountyAddress', Address.fromString(bountyAddress))
	entity.setString('issuer', issuer)
	entity.setBigInt('bountyMintTime', BigInt.fromString(bountyMintTime))
	entity.setBigInt('status', BigInt.fromString(status))
	entity.setString('organization', organization)
	entity.setString('bountyType', bountyType)
	entity.setBytes('transactionHash', Bytes.fromHexString(transactionHash))
	entity.setBigInt('version', BigInt.fromString(version))

	store.set('Bounty', '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4', entity)
}