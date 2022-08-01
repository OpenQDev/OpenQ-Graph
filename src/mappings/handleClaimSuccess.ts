import { ClaimSuccess } from "../../generated/OpenQ/OpenQ"
import {
	Claim
} from "../../generated/schema"
import { ethereum, crypto, BigInt, Address, log, ByteArray, Bytes } from '@graphprotocol/graph-ts'
import { tuplify } from '../utils'

export default function handleClaimSuccess(event: ClaimSuccess): void {
	const SINGLE = BigInt.fromString('0');
	const ONGOING = BigInt.fromString('1');
	const TIERED = BigInt.fromString('2');

	let bountyType = event.params.bountyType;

	const tuplifyEncodedData = tuplify(event.params.data)

	let decoded: ethereum.Value[] = []
	if (bountyType == SINGLE || bountyType == ONGOING) {
		decoded = ethereum.decode("(address,string,address,string)", tuplifyEncodedData)!.toTuple();
	} else {
		decoded = ethereum.decode("(address,string,address,string,uint256)", tuplifyEncodedData)!.toTuple();
	}

	let bountyAddress = decoded[0].toAddress().toHexString()
	let externalUserId = decoded[1].toString()
	let closer = decoded[2].toAddress().toHexString()
	let claimantAsset = decoded[3].toString()
	let tier = bountyType == TIERED ? decoded[4].toBigInt() : null

	let claimId = generateClaimId(externalUserId, claimantAsset)

	let claim = new Claim(claimId)

	claim.bountyType = bountyType
	claim.bounty = bountyAddress
	claim.externalUserId = externalUserId
	claim.claimant = closer
	claim.claimantAsset = claimantAsset
	claim.tier = tier

	claim.save()
}

function generateClaimId(externalUserId: string, claimantAsset: string): string {
	let claimantIdArray: Array<ethereum.Value> = [
		ethereum.Value.fromString(externalUserId),
		ethereum.Value.fromString(claimantAsset)
	]

	let tuple = changetype<ethereum.Tuple>(claimantIdArray)

	let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!

	let claimId = crypto.keccak256(encoded).toHexString()

	return claimId;
}