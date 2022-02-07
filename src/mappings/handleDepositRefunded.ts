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
	let refundId = `${event.params.sender.toHexString()}-${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}-${event.params.refundTime}`
	let refund = new Refund(refundId)

	refund.tokenAddress = event.params.tokenAddress
	refund.sender = event.params.sender.toHexString()
	refund.bounty = event.params.bountyAddress.toHexString()
	refund.volume = event.params.volume
	refund.refundTime = event.params.refundTime
	refund.organization = event.params.organization
	refund.depositId = event.params.depositId
	refund.transactionHash = event.transaction.hash

	let deposit = Deposit.load(event.params.depositId.toHexString())
	if (!deposit) { throw "Error" }
	deposit.refunded = true
	deposit.save()

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

	if (!userFundedTokenBalance) { throw "Error" }

	userFundedTokenBalance.volume = userFundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT USER FUNDED TOKEN BALANCES
	const organizationFundedTokenBalanceID = `${event.params.organization}-${event.params.tokenAddress.toHexString()}`
	let organizationFundedTokenBalance = OrganizationFundedTokenBalance.load(organizationFundedTokenBalanceID)

	if (!organizationFundedTokenBalance) { throw "Error" }

	organizationFundedTokenBalance.volume = organizationFundedTokenBalance.volume.minus(event.params.volume)

	// UPSERT BOUNTY TOKEN BALANCE
	const bountyTokenBalanceId = `${event.params.bountyAddress.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let bountyTokenBalance = BountyFundedTokenBalance.load(bountyTokenBalanceId)

	if (!bountyTokenBalance) { throw "Error" }

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