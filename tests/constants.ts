import { Bytes, BigInt, ByteArray, Address, ethereum, crypto, log } from '@graphprotocol/graph-ts';
import { removeTuplePrefix } from './utils'

export default class Constants {
	constructor () { }

	static get id(): string {
		return '0x06b306c85e5f33b1b2d971822ce0ed42fb7ab9a1';
	}

	static get depositId2(): string {
		return '0xb0f8fb2093c515e5f40f7b43ee99bb758befa9d4';
	}

	static get externalUserId(): string {
		return 'externalUserId';
	}

	static get alternativeLogo(): string {
		return 'alternativeLogo';
	}

	static get alternativeName(): string {
		return 'alternativeName';
	}

	static get claimTime(): string {
		return '1234567';
	}

	static get claimantAsset(): string {
		return 'https://github.com/OpenQDev/OpenQ-Frontend/pull/398';
	}

	static get claimantAsset2(): string {
		return 'https://github.com/OpenQDev/OpenQ-Frontend/pull/399';
	}

	static get claimantAsset3(): string {
		return 'https://github.com/OpenQDev/OpenQ-Frontend/pull/400';
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

	static get SECOND_PLACE(): string {
		return '1';
	}

	static get THIRD_PLACE(): string {
		return '2';
	}

	static get refundTime(): string {
		return '123';
	}

	static get bountyType_ATOMIC(): string {
		return '0';
	}

	static get bountyType_ONGOING(): string {
		return '1';
	}

	static get bountyType_TIERED(): string {
		return '2';
	}

	static get invoiceable(): boolean {
		return true;
	}

	static get kycRequired(): boolean {
		return true;
	}

	static get bountyType_TIERED_FIXED(): string {
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

	static get claimId_Second(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.claimantAsset2)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)

		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!

		let claimId = crypto.keccak256(encoded).toHexString()

		return claimId;
	}

	static get claimId_Third(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.claimantAsset3)
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

	static get funderUuid(): string {
		return 'randomFunderUuid';
	}

	static get funderData(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromString(Constants.funderUuid)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ATOMIC(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ATOMIC_VERSION_3(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ATOMIC_VERSION_4(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeLogo),
			ethereum.Value.fromString(Constants.alternativeName)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ONGOING(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ONGOING_VERSION_3(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_ONGOING_VERSION_4(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeLogo),
			ethereum.Value.fromString(Constants.alternativeName)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return encoded.toHexString()
	}

	static get initData_TIERED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume))
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get initData_TIERED_VERSION_3(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get initData_TIERED_VERSION_4(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeLogo),
			ethereum.Value.fromString(Constants.alternativeName)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get initData_TIERED_FIXED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromAddress(Address.fromString(Constants.payoutTokenAddress)),
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get initData_TIERED_FIXED_VERSION_3(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromAddress(Address.fromString(Constants.payoutTokenAddress)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get initData_TIERED_FIXED_VERSION_4(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray([ethereum.Value.fromI32(80), ethereum.Value.fromI32(20)]),
			ethereum.Value.fromAddress(Address.fromString(Constants.payoutTokenAddress)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeLogo),
			ethereum.Value.fromString(Constants.alternativeName)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get payoutSchedule(): Array<BigInt> {
		return [BigInt.fromString('80'), BigInt.fromString('20')]
	}

	static get tier(): string {
		return "0"
	}

	static get tierWinners(): Array<string> {
		return [Constants.externalUserId]
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
		return removeTuplePrefix(encoded)
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
		return removeTuplePrefix(encoded)
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
		return removeTuplePrefix(encoded)
	}

	static get closerData_TIERED_2(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.id)),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromAddress(Address.fromString(Constants.userId)),
			ethereum.Value.fromString(Constants.claimantAsset2),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.SECOND_PLACE))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get closerData_TIERED_3(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromAddress(Address.fromString(Constants.id)),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromAddress(Address.fromString(Constants.userId)),
			ethereum.Value.fromString(Constants.claimantAsset3),
			ethereum.Value.fromSignedBigInt(BigInt.fromString(Constants.THIRD_PLACE))
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
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

	static get payoutTokenAddress(): string {
		return '0x814f9a1b407ba75d9e685fa007ba60783440804e';
	}

	static get version(): string {
		return '1';
	}

	static get VERSION_2(): string {
		return '2';
	}

	static get VERSION_3(): string {
		return '3';
	}

	static get VERSION_4(): string {
		return '4';
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

	static get payoutTime(): string {
		return '54321';
	}

	static get expiration(): string {
		return '12345';
	}

	static get volume(): string {
		return '100';
	}

	static get volume_900(): string {
		return '900';
	}

	static get tokenId(): string {
		return '1';
	}

	static get tokenAddress(): string {
		return '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063';
	}

	// @dev This is hardcoded in the handleBountyCreated mapping
	static get bountiesCounterId(): string {
		return 'bountiesCounterId';
	}

}