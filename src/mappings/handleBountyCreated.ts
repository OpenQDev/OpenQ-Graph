import { BigInt } from "@graphprotocol/graph-ts"
import { BountyCreated } from "../../generated/OpenQ/OpenQ"
import {
	Bounty,
	User,
	Organization,
	BountiesCounter
} from "../../generated/schema"

export default function handleBountyCreated(event: BountyCreated): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		bounty = new Bounty(event.params.bountyAddress.toHexString())
	}

	bounty.bountyAddress = event.params.bountyAddress.toHexString()
	bounty.bountyId = event.params.bountyId
	bounty.bountyMintTime = event.params.bountyMintTime
	bounty.status = "OPEN"
	bounty.transactionHash = event.transaction.hash

	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	bounty.issuer = user.id;

	let organization = Organization.load(event.params.organization)

	if (!organization) {
		organization = new Organization(event.params.organization)
		organization.save()
	}

	bounty.organization = organization.id
	organization.bountiesCount = organization.bountiesCount.plus(BigInt.fromString('1'))

	let bountiesCounter = BountiesCounter.load('bountiesCounterId')

	if (!bountiesCounter) {
		bountiesCounter = new BountiesCounter('bountiesCounterId')
		bountiesCounter.save()
	}

	bountiesCounter.count = bountiesCounter.count.plus(BigInt.fromString('1'))

	bounty.save()
	organization.save()
	bountiesCounter.save()
}