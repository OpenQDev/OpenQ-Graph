import { BigInt, store } from "@graphprotocol/graph-ts"
import { DepositRefunded } from "../../generated/OpenQ/OpenQ"
import {
	Deposit,
	Refund,
	UserFundedTokenBalance,
	BountyFundedTokenBalance,
	OrganizationFundedTokenBalance,
	TokenEvents,
	FundedTokenBalance,
} from "../../generated/schema"

export default function handleDepositRefunded(event: DepositRefunded): void {
	let refundId = event.params.depositId.toHexString();
	let refund = new Refund(refundId)

	refund.bounty = event.params.bountyAddress.toHexString()
	refund.refundTime = event.params.refundTime
	refund.organization = event.params.organization
	refund.depositId = event.params.depositId
	refund.volume = event.params.volume
	refund.tokenAddress = event.params.tokenAddress
	refund.transactionHash = event.transaction.hash
	refund.sender = event.transaction.from.toHexString();

	let deposit = Deposit.load(event.params.depositId.toHexString())
	if (!deposit) { throw "Error" }
	deposit.refunded = true
	deposit.refundTime = event.params.refundTime
	deposit.save()

	// UPSERT TOKEN EVENTS
	let tokenEvents = TokenEvents.load(deposit.tokenAddress.toHexString())

	if (!tokenEvents) {
		tokenEvents = new TokenEvents(deposit.tokenAddress.toHexString())
	}

	refund.tokenEvents = tokenEvents.id
	tokenEvents.save()
	refund.save()

	// // UPSERT FUNDED TOKEN BALANCES
	let fundedTokenBalance = FundedTokenBalance.load(deposit.tokenAddress.toHexString())

	if (!fundedTokenBalance) {
		fundedTokenBalance = new FundedTokenBalance(deposit.tokenAddress.toHexString())
	}

	fundedTokenBalance.volume = fundedTokenBalance.volume.minus(refund.volume)
	fundedTokenBalance.save()

	// // UPSERT USER FUNDED TOKEN BALANCES
	const userFundedTokenBalanceId = `${deposit.sender}-${deposit.tokenAddress.toHexString()}`
	let userFundedTokenBalance = UserFundedTokenBalance.load(userFundedTokenBalanceId)

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(userFundedTokenBalanceId)
	}

	userFundedTokenBalance.volume = userFundedTokenBalance.volume.minus(refund.volume)
	userFundedTokenBalance.save()

	// // UPSERT USER FUNDED TOKEN BALANCES
	const organizationFundedTokenBalanceID = `${event.params.organization}-${deposit.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceID)

	if (!organizationFundedTokenBalance) {
		organizationFundedTokenBalance = new OrganizationFundedTokenBalance(organizationFundedTokenBalanceID)
	}

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.minus(refund.volume)
	organizationFundedTokenBalance.save()

	// // UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${deposit.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) {
		bountyTokenBalance = new BountyFundedTokenBalance(bountyTokenBalanceId)
	}

	bountyTokenBalance.volume = bountyTokenBalance.volume.minus(refund.volume)
	bountyTokenBalance.save()

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