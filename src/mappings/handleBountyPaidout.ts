import { BountyPaidout } from "../../generated/OpenQ/OpenQ"
import {
	BountyFundedTokenBalance,
	TokenEvents,
	Payout,
	User,
	UserPayoutTokenBalance,
	OrganizationPayoutTokenBalance,
	PayoutTokenBalance
} from "../../generated/schema"

export default function handleBountyPaidout(event: BountyPaidout): void {
	let bountyPayoutId = `${event.params.payoutAddress.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let payout = new Payout(bountyPayoutId)

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

	// SET BOUNTY TOKEN BALANCE TO CLAIMED
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) {
		bountyTokenBalance = new BountyFundedTokenBalance(bountyTokenBalanceId)
		bountyTokenBalance.bounty = event.params.bountyAddress.toHexString()
		bountyTokenBalance.tokenAddress = event.params.tokenAddress
		bountyTokenBalance.save()
	}

	// SAVE ALL ENTITIES
	payout.save()
	tokenEvents.save()
	bountyTokenBalance.save()
	userPayoutTokenBalance.save()
	payoutTokenBalance.save()
}