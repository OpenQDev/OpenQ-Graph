import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { FundingGoalSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleFundingGoalSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleFundingGoalSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new funding goal set event', () => {
		let newFundingGoalSetEvent = createNewFundingGoalSetEvent(
			Constants.id,
			Constants.fundingGoalTokenAddress,
			Constants.fundingGoalVolume,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version
		)

		newFundingGoalSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newFundingGoalSetEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'false')

		handleFundingGoalSet(newFundingGoalSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)
	})
})

export function createNewFundingGoalSetEvent(
	bountyAddress: string,
	fundingGoalTokenAddress: string,
	fundingGoalVolume: string,
	bountyType: string,
	data: string,
	version: string
): FundingGoalSet {
	let newFundingGoalSetEvent = changetype<FundingGoalSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("fundingGoalTokenAddress", ethereum.Value.fromAddress(Address.fromString(fundingGoalTokenAddress))),
		new ethereum.EventParam("fundingGoalVolume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(fundingGoalVolume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newFundingGoalSetEvent.parameters = parameters;

	return newFundingGoalSetEvent
}