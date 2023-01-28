import { log, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { BountyCreated } from "../../generated/OpenQ/OpenQ"
import {
	Bounty,
	User,
	Organization,
	BountiesCounter
} from "../../generated/schema"
import Constants from '../utils'
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
	bounty.status = Constants.OPEN
	bounty.transactionHash = event.transaction.hash

	if (bountyType == Constants.ATOMIC) {
		let decoded = ethereum.decode("(bool,address,uint256,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))
		
		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple();
		bounty.hasFundingGoal = decodedTuple[0].toBoolean();
		bounty.fundingGoalTokenAddress = decodedTuple[1].toAddress()
		bounty.fundingGoalVolume = decodedTuple[2].toBigInt()
		bounty.invoiceRequired = decodedTuple[3].toBoolean()
		bounty.kycRequired = decodedTuple[4].toBoolean()
		bounty.supportingDocumentsRequired = decodedTuple[5].toBoolean()
		bounty.externalUserId = decodedTuple[6].toString()
	}
		
	if (bountyType == Constants.ONGOING) {
		let decoded = ethereum.decode("(address,uint256,bool,address,uint256,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))
		
		if (decoded == null) {
			return
		}
		
		let decodedTuple = decoded.toTuple();
		bounty.payoutTokenAddress = decodedTuple[0].toAddress()
		bounty.payoutTokenVolume = decodedTuple[1].toBigInt()
		bounty.hasFundingGoal = decodedTuple[2].toBoolean();
		bounty.fundingGoalTokenAddress = decodedTuple[3].toAddress()
		bounty.fundingGoalVolume = decodedTuple[4].toBigInt()
		bounty.invoiceRequired = decodedTuple[5].toBoolean()
		bounty.kycRequired = decodedTuple[6].toBoolean()
		bounty.supportingDocumentsRequired = decodedTuple[7].toBoolean()
		bounty.externalUserId = decodedTuple[8].toString()
	}
		
	if (bountyType == Constants.TIERED_PERCENTAGE) {
		let decoded = ethereum.decode("(uint256[],bool,address,uint256,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))

		if (decoded == null) {
			return
		}

		let decodedTuple = decoded.toTuple()
		bounty.payoutSchedule = decodedTuple[0].toBigIntArray()
		bounty.hasFundingGoal = decodedTuple[1].toBoolean();
		bounty.fundingGoalTokenAddress = decodedTuple[2].toAddress()
		bounty.fundingGoalVolume = decodedTuple[3].toBigInt()
		bounty.invoiceRequired = decodedTuple[4].toBoolean()
		bounty.kycRequired = decodedTuple[5].toBoolean()
		bounty.supportingDocumentsRequired = decodedTuple[6].toBoolean()
		bounty.externalUserId = decodedTuple[7].toString()
	}
		
	if (bountyType == Constants.TIERED_FIXED) {
		let decoded = ethereum.decode("(uint256[],address,bool,bool,bool,string,string,string)", addTuplePrefix(event.params.data))
		
		if (decoded == null) {
			return
		}
		
		let decodedTuple = decoded.toTuple()
		bounty.payoutSchedule = decodedTuple[0].toBigIntArray()
		bounty.payoutTokenAddress = decodedTuple[1].toAddress()
		bounty.hasFundingGoal = false
		bounty.invoiceRequired = decodedTuple[2].toBoolean()
		bounty.kycRequired = decodedTuple[3].toBoolean()
		bounty.supportingDocumentsRequired = decodedTuple[4].toBoolean()
		bounty.externalUserId = decodedTuple[5].toString()
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