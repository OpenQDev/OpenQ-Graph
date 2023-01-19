import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { PayoutScheduleSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handlePayoutScheduleSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handlePayoutScheduleSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new payout set event', () => {
		let newPayoutScheduleSetEvent = createNewPayoutScheduleSetEvent(
			Constants.id,
			Constants.fundingGoalTokenAddress,
			Constants.payoutSchedule,
			Constants.bountyType_ONGOING,
			Constants.data,
			Constants.version
		)

		newPayoutScheduleSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newPayoutScheduleSetEvent.transaction.from = Address.fromString(Constants.userId)

		handlePayoutScheduleSet(newPayoutScheduleSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenAddress', Constants.fundingGoalTokenAddress)

		// NOTE: This is super space, case and comma-sensitive
		assert.fieldEquals('Bounty', Constants.id, 'payoutSchedule', `[${Constants.payoutSchedule[0]}, ${Constants.payoutSchedule[1]}]`)
	})
})

export function createNewPayoutScheduleSetEvent(
	bountyAddress: string,
	payoutTokenAddress: string,
	payoutSchedule: Array<BigInt>,
	bountyType: string,
	data: string,
	version: string
): PayoutScheduleSet {
	let newPayoutScheduleSetEvent = changetype<PayoutScheduleSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("payoutTokenAddress", ethereum.Value.fromAddress(Address.fromString(payoutTokenAddress))),
		new ethereum.EventParam("payoutSchedule", ethereum.Value.fromUnsignedBigIntArray(payoutSchedule)),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newPayoutScheduleSetEvent.parameters = parameters;

	return newPayoutScheduleSetEvent
}