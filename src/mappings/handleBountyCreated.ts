import { log, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { BountyCreated } from "../../generated/OpenQ/OpenQ"
import {
	Bounty,
	User,
	Organization,
	BountiesCounter
} from "../../generated/schema"
import { addTuplePrefix } from '../utils'

export default function handleBountyCreated(event: BountyCreated): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		bounty = new Bounty(event.params.bountyAddress.toHexString())
	}

	let bountyType = event.params.bountyType
	bounty.bountyAddress = event.params.bountyAddress.toHexString()
	bounty.bountyId = event.params.bountyId
	bounty.bountyMintTime = event.params.bountyMintTime
	bounty.bountyType = bountyType
	bounty.version = event.params.version
	bounty.status = BigInt.fromString('0')
	bounty.transactionHash = event.transaction.hash

	const SINGLE = BigInt.fromString('0')
	const FUNDING_GOAL = BigInt.fromString('3')
	const TIERED = BigInt.fromString('2')
	const ONGOING = BigInt.fromString('1')

	let decoded: ethereum.Value[] = []
	if (bountyType == FUNDING_GOAL) {
		decoded = ethereum.decode("(address,uint256)", event.params.data)!.toTuple();
		bounty.fundingGoalTokenAddress = decoded[0].toAddress()
		bounty.fundingGoalVolume = decoded[1].toBigInt()
	} else if (bountyType == ONGOING) {
		decoded = ethereum.decode("(address,uint256)", event.params.data)!.toTuple();
		bounty.payoutTokenAddress = decoded[0].toAddress()
		bounty.payoutTokenVolume = decoded[1].toBigInt()
	} else if (bountyType == TIERED) {
		decoded = ethereum.decode("(uint256[])", addTuplePrefix(event.params.data))!.toTuple();
		bounty.payoutSchedule = decoded[0].toBigIntArray()
	} else if (bountyType == SINGLE) {
		log.info('single', [])
	}

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