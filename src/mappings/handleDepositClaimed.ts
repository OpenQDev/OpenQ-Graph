import { DepositClaimed } from "../../generated/OpenQ/OpenQ"
import {
	TokenEvents,
	Payout,
	User,
	UserPayoutTokenBalance,
	OrganizationPayoutTokenBalance,
	PayoutTokenBalance,
	Deposit
} from "../../generated/schema"

export default function handleDepositClaimed(event: DepositClaimed): void {
	let bountyPayoutId = `${event.params.payoutAddress.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let payout = new Payout(bountyPayoutId)

	payout.tokenAddress = event.params.tokenAddress
	payout.bounty = event.params.bountyAddress.toHexString()
	payout.volume = event.params.volume
	payout.payoutTime = event.params.payoutTime
	payout.organization = event.params.organization
	payout.transactionHash = event.transaction.hash;

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

	// UPDATE DEPOSIT CLAIMED
	let deposit = Deposit.load(event.params.depositId.toHexString())

	if (!deposit) {
		throw "Error"
	}

	deposit.claimed = true;

	// SAVE ALL ENTITIES
	payout.save()
	tokenEvents.save()
	userPayoutTokenBalance.save()
	payoutTokenBalance.save()
	deposit.save()
}