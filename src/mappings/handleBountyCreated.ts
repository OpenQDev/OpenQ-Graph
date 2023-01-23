import { log, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { BountyCreated } from "../../generated/OpenQ/OpenQ"
import {
	Bounty,
	User,
	Organization,
	BountiesCounter
} from "../../generated/schema"
import { addTuplePrefix } from '../utils'
import Constants from '../utils'

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
	bounty.status = Constants.OPEN
	bounty.transactionHash = event.transaction.hash

	let decoded: ethereum.Value[] = []
		if (bountyType == Constants.ATOMIC) {
			decoded = ethereum.decode("(bool,address,uint256,bool,bool,bool,string,string,string)", event.params.data)!.toTuple();
			bounty.hasFundingGoal = decoded[0].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[1].toAddress()
			bounty.fundingGoalVolume = decoded[2].toBigInt()
			bounty.invoiceRequired = decoded[3].toBoolean()
			bounty.kycRequired = decoded[4].toBoolean()
			bounty.supportingDocumentsRequired = decoded[5].toBoolean()
			bounty.externalUserId = decoded[6].toString()
		} 
		
		if (bountyType == Constants.ONGOING) {
			decoded = ethereum.decode("(address,uint256,bool,address,uint256,bool,bool,bool,string,string,string)", event.params.data)!.toTuple();
			bounty.payoutTokenAddress = decoded[0].toAddress()
			bounty.payoutTokenVolume = decoded[1].toBigInt()
			bounty.hasFundingGoal = decoded[2].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[3].toAddress()
			bounty.fundingGoalVolume = decoded[4].toBigInt()
			bounty.invoiceRequired = decoded[5].toBoolean()
			bounty.kycRequired = decoded[6].toBoolean()
			bounty.supportingDocumentsRequired = decoded[7].toBoolean()
			bounty.externalUserId = decoded[8].toString()
		} 
		
		if (bountyType == Constants.TIERED) {
			decoded = ethereum.decode("(uint256[],bool,address,uint256,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.hasFundingGoal = decoded[1].toBoolean();
			bounty.fundingGoalTokenAddress = decoded[2].toAddress()
			bounty.fundingGoalVolume = decoded[3].toBigInt()
			bounty.invoiceRequired = decoded[4].toBoolean()
			bounty.kycRequired = decoded[5].toBoolean()
			bounty.supportingDocumentsRequired = decoded[6].toBoolean()
			bounty.externalUserId = decoded[7].toString()
		} 
		
		if (bountyType == Constants.TIERED_FIXED) {
			decoded = ethereum.decode("(uint256[],address,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))!.toTuple();
			bounty.payoutSchedule = decoded[0].toBigIntArray()
			bounty.payoutTokenAddress = decoded[1].toAddress()
			bounty.hasFundingGoal = false
			bounty.invoiceRequired = decoded[2].toBoolean()
			bounty.kycRequired = decoded[3].toBoolean()
			bounty.supportingDocumentsRequired = decoded[4].toBoolean()
			bounty.externalUserId = decoded[5].toString()
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