import { BigInt } from "@graphprotocol/graph-ts"
import { DepositReceived } from "../../generated/OpenQ/OpenQ"
import {
	User,
	Deposit,
	UserFundedTokenBalance,
	BountyFundedTokenBalance,
	OrganizationFundedTokenBalance,
	TokenEvents,
	FundedTokenBalance,
	UserBountyTokenDepositCount
} from "../../generated/schema"

export default function handleDepositReceived(event: DepositReceived): void {
	// Increment UserBountyTokenDepositCount
	let userBountyTokenDepositCountId = `${event.params.sender.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userBountyTokenDepositCount = UserBountyTokenDepositCount.load(userBountyTokenDepositCountId)

	if (!userBountyTokenDepositCount) {
		userBountyTokenDepositCount = new UserBountyTokenDepositCount(userBountyTokenDepositCountId)
		userBountyTokenDepositCount.count = BigInt.fromI32(0)
		userBountyTokenDepositCount.save()
	}

	// CREATE NEW DEPOSIT ENTITY
	let depositId = `${event.params.sender.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${userBountyTokenDepositCount.count}`
	let deposit = new Deposit(depositId)

	// important to increment count after assiging deposit id so the deposit IDs begin at 0
	userBountyTokenDepositCount.count = userBountyTokenDepositCount.count.plus(BigInt.fromI32(1))

	deposit.tokenAddress = event.params.tokenAddress
	deposit.bounty = event.params.bountyAddress.toHexString()
	deposit.organization = event.params.organization

	deposit.volume = event.params.volume
	deposit.receiveTime = event.params.receiveTime

	// UPSERT USER
	let user = User.load(event.transaction.from.toHexString())

	if (!user) {
		user = new User(event.transaction.from.toHexString())
		user.save()
	}

	deposit.sender = user.id

	// UPSERT TOKEN EVENT
	let tokenEvents = TokenEvents.load(event.params.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(event.params.tokenAddress.toHexString())
		tokenEvents.save()
	}

	deposit.tokenEvents = tokenEvents.id

	// UPSERT TOTAL FUNDED TOKEN BALANCE
	let fundedTokenBalance = FundedTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!fundedTokenBalance) {
		fundedTokenBalance = new FundedTokenBalance(event.params.tokenAddress.toHexString())
	}

	fundedTokenBalance.volume = fundedTokenBalance.volume.plus(event.params.volume)

	// UPSERT USER FUNDED TOKEN BALANCE
	const userFundedTokenBalanceId = `${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userFundedTokenBalance = UserFundedTokenBalance.load(userFundedTokenBalanceId)

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(userFundedTokenBalanceId)
		userFundedTokenBalance.user = event.params.sender.toHexString()
		userFundedTokenBalance.tokenAddress = event.params.tokenAddress
		userFundedTokenBalance.save()
	}

	userFundedTokenBalance.volume = userFundedTokenBalance.volume.plus(event.params.volume)

	// UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) {
		bountyTokenBalance = new BountyFundedTokenBalance(bountyTokenBalanceId)
		bountyTokenBalance.bounty = event.params.bountyAddress.toHexString()
		bountyTokenBalance.tokenAddress = event.params.tokenAddress
		bountyTokenBalance.save()
	}

	bountyTokenBalance.volume = bountyTokenBalance.volume.plus(event.params.volume)

	// UPSERT ORGANIZATION FUNDED TOKEN BALANCE
	const organizationFundedTokenBalanceID = `${event.params.organization}-${event.params.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceID)

	if (!organizationFundedTokenBalance) {
		organizationFundedTokenBalance = new OrganizationFundedTokenBalance(organizationFundedTokenBalanceID)
		organizationFundedTokenBalance.organization = event.params.organization
		organizationFundedTokenBalance.tokenAddress = event.params.tokenAddress
		organizationFundedTokenBalance.save()
	}

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.plus(event.params.volume)

	// SAVE ALL ENTITIES
	deposit.save()
	tokenEvents.save()
	fundedTokenBalance.save()
	bountyTokenBalance.save()
	userFundedTokenBalance.save()
	organizationFundedTokenBalance.save()
	userBountyTokenDepositCount.save()
}