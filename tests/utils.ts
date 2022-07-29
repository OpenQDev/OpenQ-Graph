import { Bytes, BigInt, Address, store, Entity } from '@graphprotocol/graph-ts';

export default function seedBounty(
	id: string,
	bountyId: string,
	bountyAddress: string,
	issuer: string,
	bountyMintTime: string,
	status: string,
	organization: string,
	bountyType: string,
	version: string,
	transactionHash: string): void {
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