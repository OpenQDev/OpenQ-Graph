import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { FundingGoalSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleInvoiceableSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleInvoiceableSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new funding goal set event', () => {
		let newInvoiceableSetEvent = createNewInvoiceableSetEvent(
			Constants.id,
			Constants.fundingGoalTokenAddress,
			Constants.fundingGoalVolume,
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.version
		)

		newInvoiceableSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newInvoiceableSetEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'false')

		handleInvoiceableSet(newInvoiceableSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)
	})
})

export function createNewInvoiceableSetEvent(
	bountyAddress: string,
	fundingGoalTokenAddress: string,
	fundingGoalVolume: string,
	bountyType: string,
	data: string,
	version: string
): FundingGoalSet {
	let newInvoiceableSetEvent = changetype<FundingGoalSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("fundingGoalTokenAddress", ethereum.Value.fromAddress(Address.fromString(fundingGoalTokenAddress))),
		new ethereum.EventParam("fundingGoalVolume", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(fundingGoalVolume))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newInvoiceableSetEvent.parameters = parameters;

	return newInvoiceableSetEvent
}