import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { PayoutSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handlePayoutSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handlePayoutSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new payout set event', () => {
		let newPayoutSetEvent = createNewPayoutSetEvent(
			Constants.id,
			Constants.fundingGoalTokenAddress,
			Constants.fundingGoalVolume,
			Constants.bountyType_ONGOING,
			Constants.data,
			Constants.version
		)

		newPayoutSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newPayoutSetEvent.transaction.from = Address.fromString(Constants.userId)

		handlePayoutSet(newPayoutSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenVolume', Constants.fundingGoalVolume)
	})
})

export function createNewPayoutSetEvent(
	bountyAddress: string,
	payoutTokenAddress: string,
	payoutTokenVolume: string,
	bountyType: string,
	data: string,
	version: string
): PayoutSet {
	let newPayoutSetEvent = changetype<PayoutSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("payoutTokenAddress", ethereum.Value.fromAddress(Address.fromString(payoutTokenAddress))),
		new ethereum.EventParam("payoutTokenVolume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(payoutTokenVolume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newPayoutSetEvent.parameters = parameters;

	return newPayoutSetEvent
}