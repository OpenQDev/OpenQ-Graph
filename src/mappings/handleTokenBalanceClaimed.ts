import { BigInt, store } from "@graphprotocol/graph-ts"
import { TokenBalanceClaimed } from "../../generated/OpenQ/OpenQ"
import {
	TokenEvents,
	Payout,
	User,
	UserPayoutTokenBalance,
	OrganizationPayoutTokenBalance,
	OrganizationFundedTokenBalance,
	PayoutTokenBalance
} from "../../generated/schema"

export default function handleTokenBalanceClaimed(event: TokenBalanceClaimed): void {
	let bountyPayoutId = `${event.params.closer.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let payout = new Payout(bountyPayoutId)

	payout.tokenAddress = event.params.tokenAddress
	payout.bounty = event.params.bountyAddress.toHexString()
	payout.volume = event.params.volume
	payout.payoutTime = event.params.payoutTime
	payout.organization = event.params.organization
	payout.transactionHash = event.transaction.hash;

	// UPSERT USER
	let user = User.load(event.params.closer.toHexString())

	if (!user) {
		user = new User(event.params.closer.toHexString())
		user.save()
	}

	payout.closer = user.id

	// UPSERT TOKEN EVENTS
	let tokenEvents = TokenEvents.load(event.params.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(event.params.tokenAddress.toHexString())
		payout.tokenEvents = tokenEvents.id
	}

	// UPSERT USER PAYOUT TOKEN BALANCE
	const userPayoutTokenBalanceId = `${event.params.closer.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userPayoutTokenBalance = UserPayoutTokenBalance.load(userPayoutTokenBalanceId)

	if (!userPayoutTokenBalance) {
		userPayoutTokenBalance = new UserPayoutTokenBalance(userPayoutTokenBalanceId)
		userPayoutTokenBalance.user = event.params.closer.toHexString()
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

	// UPDATE ORGANIZATION FUNDED TOKEN BALANCE
	const organizationFundedTokenBalanceId = `${event.params.organization}-${event.params.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceId)

	if (!organizationFundedTokenBalance) {
		throw "Error"
	}

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT TOTAL FUNDED TOKEN BALANCE
	let payoutTokenBalance = PayoutTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!payoutTokenBalance) {
		payoutTokenBalance = new PayoutTokenBalance(event.params.tokenAddress.toHexString())
	}

	payoutTokenBalance.volume = payoutTokenBalance.volume.plus(event.params.volume)

	// SAVE ALL ENTITIES
	payout.save()
	tokenEvents.save()
	userPayoutTokenBalance.save()
	payoutTokenBalance.save()
	organizationFundedTokenBalance.save()

	if (organizationFundedTokenBalance.volume.equals(new BigInt(0))) {
		store.remove('OrganizationFundedTokenBalance', organizationFundedTokenBalanceId)
	}
}