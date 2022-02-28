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
	refund.transactionHash = event.transaction.hash

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

	// UPSERT FUNDED TOKEN BALANCES
	let fundedTokenBalance = FundedTokenBalance.load(deposit.tokenAddress.toHexString())

	if (!fundedTokenBalance) {
		fundedTokenBalance = new FundedTokenBalance(deposit.tokenAddress.toHexString())
	}

	fundedTokenBalance.volume = fundedTokenBalance.volume.minus(deposit.volume)

	// UPSERT USER FUNDED TOKEN BALANCES
	const userFundedTokenBalanceId = `${deposit.sender}-${deposit.tokenAddress.toHexString()}`
	let userFundedTokenBalance = UserFundedTokenBalance.load(userFundedTokenBalanceId)

	if (!userFundedTokenBalance) { throw "Error" }

	userFundedTokenBalance.volume = userFundedTokenBalance.volume.minus(deposit.volume)

	// UPSERT USER FUNDED TOKEN BALANCES
	const organizationFundedTokenBalanceID = `${event.params.organization}-${deposit.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceID)

	if (!organizationFundedTokenBalance) { throw "Error" }

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.minus(deposit.volume)

	// UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${deposit.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) { throw "Error" }

	bountyTokenBalance.volume = bountyTokenBalance.volume.minus(deposit.volume)

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