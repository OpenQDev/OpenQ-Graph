import { Bytes, BigInt, Address, ethereum, log } from '@graphprotocol/graph-ts';
import { BountyCreated } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
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

	test('can handle new BountyCreated - ATOMIC', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_ATOMIC,
			Constants.initData_ATOMIC_VERSION_4,
			Constants.VERSION_1
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
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_ATOMIC)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.VERSION_1)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)
		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'externalUserId', Constants.externalUserId)

		assert.fieldEquals('User', Constants.userId, 'id', Constants.userId)

		assert.fieldEquals('Organization', Constants.organization, 'id', Constants.organization)
		assert.fieldEquals('Organization', Constants.organization, 'bountiesCount', '1')

		assert.fieldEquals('BountiesCounter', Constants.bountiesCounterId, 'count', '1')
	})

	test('can handle new BountyCreated - ONGOING', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_ONGOING,
			Constants.initData_ONGOING_VERSION_4,
			Constants.VERSION_1
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
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_ONGOING)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.VERSION_1)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenVolume', Constants.fundingGoalVolume)
		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)
		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'externalUserId', Constants.externalUserId)

		assert.fieldEquals('User', Constants.userId, 'id', Constants.userId)

		assert.fieldEquals('Organization', Constants.organization, 'id', Constants.organization)
		assert.fieldEquals('Organization', Constants.organization, 'bountiesCount', '1')

		assert.fieldEquals('BountiesCounter', Constants.bountiesCounterId, 'count', '1')
	})

	test('can handle new BountyCreated - TIERED', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_TIERED,
			Constants.initData_TIERED_VERSION_4,
			Constants.VERSION_1
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
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_TIERED)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.VERSION_1)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalTokenAddress', Constants.fundingGoalTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'fundingGoalVolume', Constants.fundingGoalVolume)
		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'externalUserId', Constants.externalUserId)

		// This is brittle - relies on proper spacing in the stringified array
		assert.fieldEquals('Bounty', Constants.id, 'payoutSchedule', `[${Constants.payoutSchedule[0]}, ${Constants.payoutSchedule[1]}]`)

		assert.fieldEquals('User', Constants.userId, 'id', Constants.userId)

		assert.fieldEquals('Organization', Constants.organization, 'id', Constants.organization)
		assert.fieldEquals('Organization', Constants.organization, 'bountiesCount', '1')

		assert.fieldEquals('BountiesCounter', Constants.bountiesCounterId, 'count', '1')
	})

	test('can handle new BountyCreated - TIERED FIXED', () => {
		// ARRANGE
		let newBountyCreatedEvent = createNewBountyCreatedEvent(
			Constants.bountyId,
			Constants.organization,
			Constants.userId,
			Constants.bountyAddress,
			Constants.bountyMintTime,
			Constants.bountyType_TIERED_FIXED,
			Constants.initData_TIERED_FIXED_VERSION_4,
			Constants.VERSION_1
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
		assert.fieldEquals('Bounty', Constants.id, 'bountyType', Constants.bountyType_TIERED_FIXED)
		assert.fieldEquals('Bounty', Constants.id, 'version', Constants.VERSION_1)
		assert.fieldEquals('Bounty', Constants.id, 'transactionHash', Constants.transactionHash)
		assert.fieldEquals('Bounty', Constants.id, 'hasFundingGoal', 'false')
		assert.fieldEquals('Bounty', Constants.id, 'payoutTokenAddress', Constants.payoutTokenAddress)
		assert.fieldEquals('Bounty', Constants.id, 'invoiceable', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'supportingDocuments', 'true')
		assert.fieldEquals('Bounty', Constants.id, 'externalUserId', Constants.externalUserId)

		// This is brittle - relies on proper spacing in the stringified array
		assert.fieldEquals('Bounty', Constants.id, 'payoutSchedule', `[${Constants.payoutSchedule[0]}, ${Constants.payoutSchedule[1]}]`)

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