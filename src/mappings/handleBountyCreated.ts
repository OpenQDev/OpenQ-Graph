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

	const ATOMIC = BigInt.fromString('0')
	const ONGOING = BigInt.fromString('1')
	const TIERED = BigInt.fromString('2')
	const TIERED_FIXED = BigInt.fromString('3')

	const VERSION_1 = BigInt.fromString('1')
	const VERSION_2 = BigInt.fromString('2')
	const VERSION_3 = BigInt.fromString('3')

	let decoded: ethereum.Value[] = []
	if (event.params.version == VERSION_1 || event.params.version == VERSION_2) {
		if (bountyType == ATOMIC) {
			decoded = ethereum.decode("(bool,address,uint256,bytes)", event.params.data)!.toTuple();
			bounty.hasFundingGoal = decoded[0].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[1].toAddress()
			bounty.fundingGoalVolume = decoded[2].toBigInt()
		} else if (bountyType == ONGOING) {
			decoded = ethereum.decode("(address,uint256,bool,address,uint256)", event.params.data)!.toTuple();
			bounty.payoutTokenAddress = decoded[0].toAddress()
			bounty.payoutTokenVolume = decoded[1].toBigInt()
			bounty.hasFundingGoal = decoded[2].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[3].toAddress()
			bounty.fundingGoalVolume = decoded[4].toBigInt()
		} else if (bountyType == TIERED) {
			decoded = ethereum.decode("(uint256[],bool,address,uint256)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.hasFundingGoal = decoded[1].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[2].toAddress()
			bounty.fundingGoalVolume = decoded[3].toBigInt()
		} else {
			decoded = ethereum.decode("(uint256[],address)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.payoutTokenAddress = decoded[1].toAddress()
			bounty.hasFundingGoal = false
		}
	} else {
		if (bountyType == ATOMIC) {
			decoded = ethereum.decode("(bool,address,uint256,bool,bool)", event.params.data)!.toTuple();
			bounty.hasFundingGoal = decoded[0].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[1].toAddress()
			bounty.fundingGoalVolume = decoded[2].toBigInt()
			bounty.invoiceable = decoded[3].toBoolean()
			bounty.kycRequired = decoded[4].toBoolean()
		} else if (bountyType == ONGOING) {
			decoded = ethereum.decode("(address,uint256,bool,address,uint256,bool,bool)", event.params.data)!.toTuple();
			bounty.payoutTokenAddress = decoded[0].toAddress()
			bounty.payoutTokenVolume = decoded[1].toBigInt()
			bounty.hasFundingGoal = decoded[2].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[3].toAddress()
			bounty.fundingGoalVolume = decoded[4].toBigInt()
			bounty.invoiceable = decoded[5].toBoolean()
			bounty.kycRequired = decoded[6].toBoolean()
		} else if (bountyType == TIERED) {
			decoded = ethereum.decode("(uint256[],bool,address,uint256,bool,bool)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.hasFundingGoal = decoded[1].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[2].toAddress()
			bounty.fundingGoalVolume = decoded[3].toBigInt()
			bounty.invoiceable = decoded[4].toBoolean()
			bounty.kycRequired = decoded[5].toBoolean()
		} else {
			decoded = ethereum.decode("(uint256[],address,bool,bool)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.payoutTokenAddress = decoded[1].toAddress()
			bounty.hasFundingGoal = false
			bounty.invoiceable = decoded[2].toBoolean()
			bounty.kycRequired = decoded[3].toBoolean()
		}
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
		organization.bountiesCount = BigInt.fromString('0')
		organization.save()
	}

	bounty.organization = organization.id
	organization.bountiesCount = organization.bountiesCount.plus(BigInt.fromString('1'))

	let bountiesCounter = BountiesCounter.load('bountiesCounterId')

	if (!bountiesCounter) {
		bountiesCounter = new BountiesCounter('bountiesCounterId')
		bountiesCounter.count = BigInt.fromString('0')
		bountiesCounter.save()
	}

	bountiesCounter.count = bountiesCounter.count.plus(BigInt.fromString('1'))

	bounty.save()
	organization.save()
	bountiesCounter.save()
}
