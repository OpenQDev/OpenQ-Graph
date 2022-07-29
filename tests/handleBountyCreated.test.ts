import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { BountyCreated } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, logStore, log } from "matchstick-as/assembly/index";
import { handleBountyCreated } from "../src/mapping";
import Constants from './constants';
import { seedBounty } from './utils'

describe('handleBountyCreated', () => {
	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new BountyCreated - SINGLE', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_SINGLE,
			Constants.data,
			Constants.version
		)

		newBountyCreatedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newBountyCreatedEvent.transaction.from = Address.fromString(Constants.userId)

		// ACT
		handleBountyCreated(newBountyCreatedEvent)

		// ASSERT
		assert.fieldEquals('Bounty', Constants.id, 'bountyId', Constants.bountyId)
		assert.fieldEquals('Bounty', Constants.id, 'organization', Constants.organization)
		assert.fieldEquals('Bounty', Constants.id, 'issuer', Constants.userId)
		assert.fieldEquals('Bounty', Constants.id, 'bountyAddress', Constants.id)
		assert.fieldEquals('Bounty', Constants.id, 'bountyMintTime', Constants.bountyMintTime)
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_SINGLE)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.version)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)

		assert.fieldEquals('User', Constants.userId, 'id', Constants.userId)

		assert.fieldEquals('Organization', Constants.organization, 'id', Constants.organization)
		assert.fieldEquals('Organization', Constants.organization, 'bountiesCount', '1')

		assert.fieldEquals('BountiesCounter', Constants.bountiesCounterId, 'count', '1')
	})

	test('can handle new BountyCreated - FUNDING GOAL', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_FUNDING_GOAL,
			Constants.initData_FUNDING_GOAL,
			Constants.version
		)

		newBountyCreatedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newBountyCreatedEvent.transaction.from = Address.fromString(Constants.userId)

		// ACT
		handleBountyCreated(newBountyCreatedEvent)

		// ASSERT
		assert.fieldEquals('Bounty', Constants.id, 'bountyId', Constants.bountyId)
		assert.fieldEquals('Bounty', Constants.id, 'organization', Constants.organization)
		assert.fieldEquals('Bounty', Constants.id, 'issuer', Constants.userId)
		assert.fieldEquals('Bounty', Constants.id, 'bountyAddress', Constants.id)
		assert.fieldEquals('Bounty', Constants.id, 'bountyMintTime', Constants.bountyMintTime)
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_FUNDING_GOAL)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.version)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)

		assert.fieldEquals('User', Constants.userId, 'id', Constants.userId)

		assert.fieldEquals('Organization', Constants.organization, 'id', Constants.organization)
		assert.fieldEquals('Organization', Constants.organization, 'bountiesCount', '1')

		assert.fieldEquals('BountiesCounter', Constants.bountiesCounterId, 'count', '1')
	})
})

export function createNewBountyCreatedEvent(
	bountyId: string,
	organization: string,
	issuerAddress: string,
	bountyAddress: string,
	bountyMintTime: string,
	bountyType: string,
	data: string,
	version: string
): BountyCreated {
	let newBountyCreatedEvent = changetype<BountyCreated>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyId", ethereum.Value.fromString(bountyId)),
		new ethereum.EventParam("organization", ethereum.Value.fromString(organization)),
		new ethereum.EventParam("issuerAddress", ethereum.Value.fromAddress(Address.fromString(issuerAddress))),
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("bountyMintTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyMintTime))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newBountyCreatedEvent.parameters = parameters;

	return newBountyCreatedEvent
}