import { Bytes, BigInt, ByteArray, Address, ethereum, crypto, log } from '@graphprotocol/graph-ts';

export default class Constants {
	constructor () { }

	static get id(): string {
		return '0x06b306c85e5f33b1b2d971822ce0ed42fb7ab9a1';
	}

	static get externalUserId(): string {
		return 'externalUserId';
	}

	static get claimantAsset(): string {
		return 'https://github.com/OpenQDev/OpenQ-Frontend/pull/398';
	}

	static get bountyId(): string {
		return 'bountyId';
	}

	static get bountyAddress(): string {
		return '0x06b306c85e5f33b1b2d971822ce0ed42fb7ab9a1';
	}

	static get userId(): string {
		return '0x46e09468616365256f11f4544e65ce0c70ee624b';
	}

	static get FIRST_PLACE(): string {
		return '0';
	}

	static get refundTime(): string {
		return '123';
	}

	static get bountyType_SINGLE(): string {
		return '0';
	}

	static get bountyType_ONGOING(): string {
		return '1';
	}

	static get bountyType_TIERED(): string {
		return '2';
	}

	static get bountyType_FUNDING_GOAL(): string {
		return '3';
	}

	static get bountyMintTime(): string {
		return '123';
	}

	static get bountyClosedTime(): string {
		return '321';
	}

	static get status(): string {
		return '0';
	}

	static get status_CLOSED(): string {
		return '1';
	}

	static get closer(): string {
		return '0x814f9a1b407ba75d9e685fa007ba60783440804e';
	}

	static get claimId(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.claimantAsset)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)

		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!

		let claimId = crypto.keccak256(encoded).toHexString()

		return claimId;
	}

	static get fundingGoalTokenAddress(): string {
		return '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
	}

	static get fundingGoalVolume(): string {
		return '100';
	}

	static get initData_FUNDING_GOAL(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_TIERED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ONGOING(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get payoutSchedule(): Array<BigInt> {
		return [BigInt.fromString('80'), BigInt.fromString('20')]
	}

	static encodeTuple(tupleArray: ethereum.Value[]): string {
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString();
	}

	static get closerData_SINGLE(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.id)),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromAddress(Address.fromString(Constants.userId)),
			ethereum.Value.fromString(Constants.claimantAsset)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get closerData_ONGOING(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.id)),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromAddress(Address.fromString(Constants.userId)),
			ethereum.Value.fromString(Constants.claimantAsset)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get closerData_TIERED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.id)),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromAddress(Address.fromString(Constants.userId)),
			ethereum.Value.fromString(Constants.claimantAsset),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.FIRST_PLACE))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get organization(): string {
		return 'organization';
	}

	static get transactionHash(): string {
		return '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b';
	}

	static get claimedTransactionHash(): string {
		return '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b';
	}

	static get payoutAddress(): string {
		return '0x44c3a45362992eb87d3ad46f6b210a0b587827c8';
	}

	static get version(): string {
		return '1';
	}

	static get data(): string {
		return '0x00000000000000000000000046e09468616365256f11f4544e65ce0c70ee624b';
	}

	static get depositId(): string {
		return '0x06b306c85e5f33b1b2d971822ce0ed42fb7ab9a1';
	}

	static get receiveTime(): string {
		return '12345';
	}

	static get expiration(): string {
		return '12345';
	}

	static get volume(): string {
		return '100';
	}

	static get tokenAddress(): string {
		return '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
	}

	// @dev This is hardcoded in the handleBountyCreated mapping
	static get bountiesCounterId(): string {
		return 'bountiesCounterId';
	}

}