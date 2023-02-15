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
		return 'po';
	}

	static get externalUserId2(): string {
		return 'externalUserId2';
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

	static get userId2(): string {
		return '0x947f3fc93ab8b74c44f837d3031347ddbb32cf08';
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

	static get bountyType_TIERED_PERCENTAGE(): string {
		return '2';
	}

	static get invoiceRequired(): boolean {
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
		return '0x5fbdb2315678afecb367f032d93f642f64180aa3';
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
		return removeTuplePrefix(encoded)
	}

	static get initData_ATOMIC_VERSION_1(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromUnsignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeName),
			ethereum.Value.fromString(Constants.alternativeLogo)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
		
		// ATOMIC - NO FUNDING GOAL
		// return "0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"

		// ATOMIC - FUNDING GOAL
		// return "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa300000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"
	}

	static get initData_ONGOING_VERSION_1(): string {
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
			ethereum.Value.fromString(Constants.alternativeName),
			ethereum.Value.fromString(Constants.alternativeLogo)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)

		// ONGOING - NO FUNDING GOAL
		// return "0x0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"

		// ONGOING - FUNDING GOAL
		// return "0x0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"
	}

	static get initData_TIERED_VERSION_1(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray(Constants.payoutSchedule_ethereumValues),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromAddress(Address.fromString(Constants.fundingGoalTokenAddress)),
			ethereum.Value.fromUnsignedBigInt(BigInt.fromString(Constants.fundingGoalVolume)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeName),
			ethereum.Value.fromString(Constants.alternativeLogo)
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)

		// TIERED PERCENTAGE - NO FUNDING GOAL
		// return "0x000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"

		// TIERED PERCENTAGE - FUNDING GOAL
		// return "0x000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000010000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"
	}

	static get initData_TIERED_FIXED_VERSION_1(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromArray(Constants.payoutSchedule_ethereumValues),
			ethereum.Value.fromAddress(Address.fromString(Constants.payoutTokenAddress)),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromBoolean(true),
			ethereum.Value.fromString(Constants.externalUserId),
			ethereum.Value.fromString(Constants.alternativeName),
			ethereum.Value.fromString(Constants.alternativeLogo)
		]
		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)

		// TIERED FIXED
		// return "0x00000000000000000000000000000000000000000000000000000000000001000000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000460000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002706f000000000000000000000000000000000000000000000000000000000000"
	}

	static get payoutSchedule_string(): string {
		const schedule = [BigInt.fromString('70'), BigInt.fromString('20'), BigInt.fromString('10')].join(', ')
		return `[${schedule}]`
	}

	static get payoutSchedule(): Array<BigInt> {
		return [BigInt.fromString('70'), BigInt.fromString('20'), BigInt.fromString('10')]
	}

	static get payoutSchedule_ethereumValues(): ethereum.Value[] {
		return [ethereum.Value.fromI32(70), ethereum.Value.fromI32(20), ethereum.Value.fromI32(10)]
	}

	static get tier(): string {
		return "0"
	}

	static get tierWinners(): Array<string> {
		return [Constants.externalUserId, ""]
	}

	static get invoiceCompleted(): Array<boolean> {
		return [true, false, true]
	}

	static get invoiceCompleted_string(): string {
		return `[${Constants.invoiceCompleted.join(', ')}]`
	}

	static get supportingDocumentsCompleted(): Array<boolean> {
		return [true, false, true]
	}

	static get supportingDocumentsCompleted_string(): string {
		return `[${Constants.supportingDocumentsCompleted.join(', ')}]`
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

	static get invoiceCompletedData_TIERED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBooleanArray(Constants.invoiceCompleted),
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		log.info('{}', [removeTuplePrefix(encoded)])
		return removeTuplePrefix(encoded)
	}

	static get supportingDocumentsCompletedData_TIERED(): string {
		let tupleArray: Array<ethereum.Value> = [
			ethereum.Value.fromBooleanArray(Constants.supportingDocumentsCompleted),
		]

		let tuple = changetype<ethereum.Tuple>(tupleArray)
		let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
		return removeTuplePrefix(encoded)
	}

	static get invoiceCompletedData_ATOMIC(): string {
		let encoded = ethereum.encode(ethereum.Value.fromBoolean(true))!
		return encoded.toHexString()
	}

	static get invoiceCompletedData_ATOMIC_false(): string {
		let encoded = ethereum.encode(ethereum.Value.fromBoolean(false))!
		return encoded.toHexString()
	}

	static get supportingDocumentsCompletedData_ATOMIC(): string {
		let encoded = ethereum.encode(ethereum.Value.fromBoolean(true))!
		return encoded.toHexString()
	}

	static get supportingDocumentsCompletedData_ATOMIC_false(): string {
		let encoded = ethereum.encode(ethereum.Value.fromBoolean(false))!
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
		return '0x5fbdb2315678afecb367f032d93f642f64180aa3';
	}

	static get VERSION_1(): string {
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