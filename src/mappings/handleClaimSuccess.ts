import { ClaimSuccess } from "../../generated/ClaimManager/ClaimManager"
import {
	Claim
} from "../../generated/schema"
import { ethereum, crypto, BigInt } from '@graphprotocol/graph-ts'
import Constants from '../utils'
import { addTuplePrefix } from '../utils'

export default function handleClaimSuccess(event: ClaimSuccess): void {

	let bountyType = event.params.bountyType;

	let decodedTuple: ethereum.Tuple
	if (bountyType == Constants.ATOMIC || bountyType == Constants.ONGOING) {
		let decoded = ethereum.decode("(address,string,address,string)", addTuplePrefix(event.params.data))

		if (decoded == null) {
			return
		}

		decodedTuple = decoded.toTuple();
	} else {
		let decoded = ethereum.decode("(address,string,address,string,uint256)", addTuplePrefix(event.params.data))

		if (decoded == null) {
			return
		}
		
		decodedTuple = decoded.toTuple();
	}

	let bountyAddress = decodedTuple[0].toAddress().toHexString()
	let closer = decodedTuple[2].toAddress().toHexString()

	let externalUserId = decodedTuple[1].toString()
	let claimantAsset = decodedTuple[3].toString()
	let claimId = generateClaimId(externalUserId, claimantAsset)
	let claim = new Claim(claimId)
	let tier = BigInt.fromString('0')

	if (bountyType == Constants.TIERED_PERCENTAGE || bountyType == Constants.TIERED_FIXED) {
		tier = decodedTuple[4].toBigInt()
	}

	claim.bountyType = bountyType
	claim.bounty = bountyAddress
	claim.externalUserId = externalUserId
	claim.claimant = closer
	claim.claimantAsset = claimantAsset
	claim.tier = tier
	claim.claimTime = event.params.claimTime
	claim.version = event.params.version

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