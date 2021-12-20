import { BigInt, store } from "@graphprotocol/graph-ts"
import { BountyClosed, BountyCreated, DepositReceived, DepositRefunded, BountyPaidout } from "../generated/OpenQ/OpenQ"
import {
	Bounty,
	User,
	Deposit,
	Refund,
	Payout,
	Organization,
	UserFundedTokenBalance,
	UserPayoutTokenBalance,
	BountyFundedTokenBalance,
	OrganizationFundedTokenBalance,
	OrganizationPayoutTokenBalance,
	TokenEvents,
	FundedTokenBalance,
	PayoutTokenBalance
} from "../generated/schema"

export function handleBountyCreated(event: BountyCreated): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		bounty = new Bounty(event.params.bountyAddress.toHexString())
	}

	bounty.bountyAddress = event.params.bountyAddress.toHexString()
	bounty.bountyId = event.params.bountyId
	bounty.bountyMintTime = event.params.bountyMintTime
	bounty.status = "OPEN"

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

	bounty.save()
}

export function handleDepositReceived(event: DepositReceived): void {
	// CREATE NEW DEPOSIT ENTITY
	let depositId = `${event.params.bountyAddress.toHexString()}-${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.receiveTime}`
	let deposit = Deposit.load(depositId)

	if (!deposit) {
		deposit = new Deposit(depositId)
		deposit.volume = new BigInt(0)
	}

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
}

export function handleDepositRefunded(event: DepositRefunded): void {
	let refundId = `${event.params.bountyAddress.toHexString()}-${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.refundTime}`
	let refund = Refund.load(refundId)

	if (!refund) {
		refund = new Refund(refundId)
		refund.volume = new BigInt(0)
	}

	refund.tokenAddress = event.params.tokenAddress
	refund.sender = event.params.sender.toHexString()
	refund.bounty = event.params.bountyAddress.toHexString()
	refund.volume = event.params.volume
	refund.refundTime = event.params.refundTime
	refund.organization = event.params.organization

	// UPSERT TOKEN EVENTS
	let tokenEvents = TokenEvents.load(event.params.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(event.params.tokenAddress.toHexString())
	}

	refund.tokenEvents = tokenEvents.id

	// UPSERT FUNDED TOKEN BALANCES
	let fundedTokenBalance = FundedTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!fundedTokenBalance) {
		fundedTokenBalance = new FundedTokenBalance(event.params.tokenAddress.toHexString())
	}

	fundedTokenBalance.volume = fundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT USER FUNDED TOKEN BALANCES
	const userFundedTokenBalanceId = `${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userFundedTokenBalance = UserFundedTokenBalance.load(userFundedTokenBalanceId)

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(userFundedTokenBalanceId)
		userFundedTokenBalance.user = event.params.sender.toHexString()
		userFundedTokenBalance.tokenAddress = event.params.tokenAddress
	}

	userFundedTokenBalance.volume = userFundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT USER FUNDED TOKEN BALANCES
	const organizationFundedTokenBalanceID = `${event.params.organization}-${event.params.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceID)

	if (!organizationFundedTokenBalance) {
		organizationFundedTokenBalance = new OrganizationFundedTokenBalance(organizationFundedTokenBalanceID)
		organizationFundedTokenBalance.organization = event.params.organization
		organizationFundedTokenBalance.tokenAddress = event.params.tokenAddress
	}

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) {
		bountyTokenBalance = new BountyFundedTokenBalance(bountyTokenBalanceId)
		bountyTokenBalance.bounty = event.params.bountyAddress.toHexString()
		bountyTokenBalance.tokenAddress = event.params.tokenAddress
		bountyTokenBalance.save()
	}

	bountyTokenBalance.volume = bountyTokenBalance.volume.minus(event.params.volume)

	// SAVE ALL ENTITIES
	refund.save()
	tokenEvents.save()
	fundedTokenBalance.save()
	bountyTokenBalance.save()
	userFundedTokenBalance.save()
	organizationFundedTokenBalance.save()

	if (bountyTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('BountyFundedTokenBalance', bountyTokenBalanceId)
	}

	if (organizationFundedTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('OrganizationFundedTokenBalance', organizationFundedTokenBalance.id)
	}

	if (userFundedTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('UserFundedTokenBalance', userFundedTokenBalance.id)
	}

	if (fundedTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('FundedTokenBalance', fundedTokenBalance.id)
	}
}

export function handleBountyPaidout(event: BountyPaidout): void {
	let bountyPayoutId = `${event.params.bountyAddress.toHexString()}-${event.params.payoutAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let payout = Payout.load(bountyPayoutId)

	if (!payout) {
		payout = new Payout(bountyPayoutId)
		payout.volume = new BigInt(0)
	}

	payout.tokenAddress = event.params.tokenAddress
	payout.bounty = event.params.bountyAddress.toHexString()
	payout.volume = event.params.volume
	payout.payoutTime = event.params.payoutTime
	payout.organization = event.params.organization

	// UPSERT USER
	let user = User.load(event.params.payoutAddress.toHexString())

	if (!user) {
		user = new User(event.params.payoutAddress.toHexString())
		user.save()
	}

	payout.payoutAddress = user.id

	// UPSERT TOKEN EVENTS
	let tokenEvents = TokenEvents.load(event.params.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(event.params.tokenAddress.toHexString())
		payout.tokenEvents = tokenEvents.id
	}

	// UPSERT USER PAYOUT TOKEN BALANCE
	const userPayoutTokenBalanceId = `${event.params.payoutAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userPayoutTokenBalance = UserPayoutTokenBalance.load(userPayoutTokenBalanceId)

	if (!userPayoutTokenBalance) {
		userPayoutTokenBalance = new UserPayoutTokenBalance(userPayoutTokenBalanceId)
		userPayoutTokenBalance.user = event.params.payoutAddress.toHexString()
		userPayoutTokenBalance.tokenAddress = event.params.tokenAddress
	}

	userPayoutTokenBalance.volume = userPayoutTokenBalance.volume.plus(event.params.volume)

	// UPSERT ORGANIZATION PAYOUT TOKEN BALANCE
	const organizationPayoutTokenBalanceId = `${event.params.organization}-${event.params.tokenAddress.toHexString()}`
	let organizationPayoutTokenBalance = OrganizationPayoutTokenBalance.load(organizationPayoutTokenBalanceId)

	if (!organizationPayoutTokenBalance) {
		organizationPayoutTokenBalance = new OrganizationPayoutTokenBalance(organizationPayoutTokenBalanceId)
		organizationPayoutTokenBalance.organization = event.params.organization
		organizationPayoutTokenBalance.tokenAddress = event.params.tokenAddress
	}

	organizationPayoutTokenBalance.volume = organizationPayoutTokenBalance.volume.plus(event.params.volume)

	// UPSERT TOTAL FUNDED TOKEN BALANCE
	let payoutTokenBalance = PayoutTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!payoutTokenBalance) {
		payoutTokenBalance = new PayoutTokenBalance(event.params.tokenAddress.toHexString())
	}

	payoutTokenBalance.volume = payoutTokenBalance.volume.plus(event.params.volume)

	// UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) {
		bountyTokenBalance = new BountyFundedTokenBalance(bountyTokenBalanceId)
		bountyTokenBalance.bounty = event.params.bountyAddress.toHexString()
		bountyTokenBalance.tokenAddress = event.params.tokenAddress
		bountyTokenBalance.save()
	}

	bountyTokenBalance.volume = bountyTokenBalance.volume.minus(event.params.volume)

	// SAVE ALL ENTITIES
	payout.save()
	tokenEvents.save()
	bountyTokenBalance.save()
	userPayoutTokenBalance.save()
	payoutTokenBalance.save()

	if (bountyTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('BountyFundedTokenBalance', bountyTokenBalanceId)
	}
}

export function handleBountyClosed(event: BountyClosed): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		throw Error("Closing a bounty that does not exit? Should have reverted in OpenQ.sol")
	}

	bounty.payoutAddress = event.params.payoutAddress.toHexString()
	bounty.bountyClosedTime = event.params.bountyClosedTime
	bounty.status = "CLOSED"

	// SAVE ALL ENTITIES
	bounty.save()
}
