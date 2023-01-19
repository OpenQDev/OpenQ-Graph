import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { TierWinnerSelected } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleTierWinnerSelected } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleTierWinnerSelected.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new tier winner selected event', () => {
		let newTierWinnerSelectedEvent = createNewTierWinnerSelectedEvent(
			Constants.id,
			Constants.tierWinners,
			Constants.data,
			Constants.version
		)

		newTierWinnerSelectedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newTierWinnerSelectedEvent.transaction.from = Address.fromString(Constants.userId)

		handleTierWinnerSelected(newTierWinnerSelectedEvent)

		assert.fieldEquals('Bounty', Constants.id, 'tierWinners', `[${Constants.tierWinners[0]}]`)
	})
})

export function createNewTierWinnerSelectedEvent(
	bountyAddress: string,
	tierWinners: string[],
	data: string,
	version: string
): TierWinnerSelected {
	let newTierWinnerSelectedEvent = changetype<TierWinnerSelected>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("tierWinners", ethereum.Value.fromStringArray(tierWinners)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newTierWinnerSelectedEvent.parameters = parameters;

	return newTierWinnerSelectedEvent
}