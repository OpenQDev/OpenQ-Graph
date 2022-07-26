import { Claim } from "../../generated/OpenQ/OpenQ"
import {
	Bounty
} from "../../generated/schema"
import { ethereum } from '@graphprotocol/graph-ts'

export default function handleClaim(event: Claim): void {
	// let decoded = ethereum.decode('(address,uint256)', event.params.data);

	// let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	// if (!bounty) { throw "Error" }

	// bounty.save()
}