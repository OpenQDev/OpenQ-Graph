import { BigInt, ethereum } from "@graphprotocol/graph-ts"
import { TokenDepositReceived } from "../../generated/OpenQ/OpenQ"
import {
	User,
	Deposit,
	UserFundedTokenBalance,
	BountyFundedTokenBalance,
	OrganizationFundedTokenBalance,
	TokenEvents,
	FundedTokenBalance,
} from "../../generated/schema"
import { addTuplePrefix } from '../utils'

export default function handleTokenDepositReceived(event: TokenDepositReceived): void {
	// CREATE NEW DEPOSIT ENTITY
	let deposit = new Deposit(event.params.depositId.toHexString())

	deposit.tokenAddress = event.params.tokenAddress
	deposit.bounty = event.params.bountyAddress.toHexString()
	deposit.organization = event.params.organization

	deposit.volume = event.params.volume
	deposit.receiveTime = event.params.receiveTime
	deposit.transactionHash = event.transaction.hash
	deposit.expiration = event.params.expiration
	deposit.isNft = false
	deposit.refunded = false	
	deposit.tokenId = BigInt.fromString('0') ;

	const VERSION_2 = BigInt.fromString('2')

	let decoded: ethereum.Value[] = []
	if (event.params.version == VERSION_2) {
		decoded = ethereum.decode("(string)", event.params.data)!.toTuple();
		deposit.funderUuid = decoded[0].toString()
	}

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
		fundedTokenBalance.volume = BigInt.fromString('0')
		fundedTokenBalance.save()
	}

	fundedTokenBalance.volume = fundedTokenBalance.volume.plus(event.params.volume)

	// UPSERT USER FUNDED TOKEN BALANCE
	const userFundedTokenBalanceId = `${event.params.sender.toHexString()}-${event.params.tokenAddress.toHexString()}`
	let userFundedTokenBalance = UserFundedTokenBalance.load(userFundedTokenBalanceId)

	if (!userFundedTokenBalance) {
		userFundedTokenBalance = new UserFundedTokenBalance(userFundedTokenBalanceId)
		userFundedTokenBalance.user = event.params.sender.toHexString()
		userFundedTokenBalance.tokenAddress = event.params.tokenAddress
		userFundedTokenBalance.volume = BigInt.fromString('0')
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
		bountyTokenBalance.volume = BigInt.fromString('0')
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
		organizationFundedTokenBalance.volume = BigInt.fromString('0')
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