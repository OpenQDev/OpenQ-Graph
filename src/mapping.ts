import { BigInt, Value } from "@graphprotocol/graph-ts"
import { BountyClosed, BountyCreated, DepositReceived, DepositRefunded, BountyPaidout } from "../generated/OpenQ/OpenQ"
import { Bounty, User, Deposit, Refund, TokenBalance, Payout, UserEarnedTokenBalance, UserFundedTokenBalance } from "../generated/schema"

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

	bounty.save()
}

export function handleDepositReceived(event: DepositReceived): void {
	let depositId = `${event.params.bountyAddress.toHexString()}-${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.receiveTime}`
	let deposit = Deposit.load(depositId)

	if (!deposit) {
		deposit = new Deposit(depositId)
		deposit.value = new BigInt(0)
	}

	deposit.tokenAddress = event.params.tokenAddress
	deposit.sender = event.params.sender.toHexString()
	deposit.bounty = event.params.bountyAddress.toHexString()

	deposit.value = event.params.value
	deposit.receiveTime = event.params.receiveTime

	let tokenBalance = TokenBalance.load(event.params.tokenAddress.toHexString())

	if (!tokenBalance) {
		tokenBalance = new TokenBalance(event.params.tokenAddress.toHexString())
		deposit.tokenBalance = tokenBalance.id
	}

	tokenBalance.totalValue = tokenBalance.totalValue.plus(event.params.value)

	let userFundedTokenBalance = UserFundedTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(event.params.tokenAddress.toHexString())
		userFundedTokenBalance.user = event.params.sender.toHexString()
	}

	userFundedTokenBalance.totalValue.plus(event.params.value)

	userFundedTokenBalance.save()
	tokenBalance.save()
	deposit.save()

}

export function handleDepositRefunded(event: DepositRefunded): void {
	let refundId = `${event.params.bountyAddress.toHexString()}-${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.refundTime}`
	let refund = Refund.load(refundId)

	if (!refund) {
		refund = new Refund(refundId)
		refund.value = new BigInt(0)
	}

	refund.tokenAddress = event.params.tokenAddress
	refund.sender = event.params.sender.toHexString()
	refund.bounty = event.params.bountyAddress.toHexString()
	refund.value = event.params.value
	refund.refundTime = event.params.refundTime

	let tokenBalance = TokenBalance.load(event.params.tokenAddress.toHexString())

	if (!tokenBalance) {
		tokenBalance = new TokenBalance(event.params.tokenAddress.toHexString())
		refund.tokenBalance = tokenBalance.id
	}

	tokenBalance.totalValue = tokenBalance.totalValue.minus(event.params.value)

	let userFundedTokenBalance = UserFundedTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(event.params.tokenAddress.toHexString())
		userFundedTokenBalance.user = event.params.sender.toHexString()
	}

	userFundedTokenBalance.totalValue.minus(event.params.value)

	userFundedTokenBalance.save()
	tokenBalance.save()
	refund.save()
}

export function handleBountyPaidout(event: BountyPaidout): void {
	let bountyPayoutId = `${event.params.bountyAddress.toHexString()}-${event.params.payoutAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.payoutTime}`
	let bountyPayout = Payout.load(bountyPayoutId)

	if (!bountyPayout) {
		bountyPayout = new Payout(bountyPayoutId)
		bountyPayout.value = new BigInt(0)
	}

	bountyPayout.tokenAddress = event.params.tokenAddress
	bountyPayout.payoutAddress = event.params.payoutAddress.toHexString()
	bountyPayout.bounty = event.params.bountyAddress.toHexString()
	bountyPayout.value = event.params.value
	bountyPayout.payoutTime = event.params.payoutTime

	let tokenBalance = TokenBalance.load(event.params.tokenAddress.toHexString())

	if (!tokenBalance) {
		tokenBalance = new TokenBalance(event.params.tokenAddress.toHexString())
		bountyPayout.tokenBalance = tokenBalance.id
	}

	tokenBalance.totalValue = tokenBalance.totalValue.minus(event.params.value)

	let userEarnedTokenBalance = UserEarnedTokenBalance.load(event.params.tokenAddress.toHexString())

	if (!userEarnedTokenBalance) {
		userEarnedTokenBalance = new UserEarnedTokenBalance(event.params.tokenAddress.toHexString())
		userEarnedTokenBalance.user = event.params.payoutAddress.toHexString()
	}

	userEarnedTokenBalance.totalValue.plus(event.params.value)

	tokenBalance.save()
	bountyPayout.save()
	userEarnedTokenBalance.save()
}

export function handleBountyClosed(event: BountyClosed): void {
	let bounty = Bounty.load(event.params.bountyAddress.toHexString())

	if (!bounty) {
		throw Error("Closing a bounty that does not exit? Should have reverted in OpenQ.sol")
	}

	bounty.payoutAddress = event.params.payoutAddress.toHexString()
	bounty.bountyClosedTime = event.params.bountyClosedTime
	bounty.status = "CLOSED"

	bounty.save()
}
