import { ClaimSuccess } from "../../generated/OpenQ/OpenQ"
import {
	Claim
} from "../../generated/schema"
import { ethereum, crypto, BigInt, Address } from '@graphprotocol/graph-ts'

export default function handleClaimSuccess(event: ClaimSuccess): void {
	const SINGLE = BigInt.fromString('0');
	const ONGOING = BigInt.fromString('1');
	const TIERED = BigInt.fromString('2');

	let bountyType = event.params.bountyType;

	let decoded = ethereum.decode('(address,string,address,string)', event.params.data)!.toTuple();

	let closerAddress = decoded[1].toAddress()
	let claimantAsset = decoded[2].toString()
	let externalUserId = decoded[2].toString()

	// Recreate claimantId from externalUserId (GitHub ID) and claimantAsset (PR URL)
	let tupleArray: Array<ethereum.Value> = [
		ethereum.Value.fromString(externalUserId),
		ethereum.Value.fromString(claimantAsset)
	]

	let tuple = tupleArray as ethereum.Tuple
	let encoded = ethereum.encode(ethereum.Value.fromTuple(tuple))!
	let claimantId = crypto.keccak256(encoded).toString()

	let claim = Claim.load(claimantId.toString());

	if (!claim) {
		claim = new Claim(claimantId)
	}

	let bountyAddress = decoded[0].toAddress().toHexString()

	claim.bountyType = bountyType;
	claim.claimant = closerAddress.toString();
	claim.claimantAsset = claimantAsset
	claim.bounty = bountyAddress;

	claim.save()
}