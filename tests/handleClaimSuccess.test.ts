import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { ClaimSuccess } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, log, logStore } from "matchstick-as/assembly/index";
import { handleClaimSuccess } from "../src/mapping";
import Constants from './constants'

describe('handleClaimSuccess', () => {

	beforeEach(() => { })

	afterEach(() => {
		clearStore()
	})

	test('can handle new claim success - SINGLE', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			Constants.claimTime,
			Constants.bountyType_ATOMIC,
			Constants.closerData_SINGLE,
			Constants.version
		)

		newClaimSuccessEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEvent.transaction.from = Address.fromString(Constants.userId)

		handleClaimSuccess(newClaimSuccessEvent)

		assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
		assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
		assert.fieldEquals('Claim', Constants.claimId, 'tier', '0')
		assert.fieldEquals('Claim', Constants.claimId, 'claimTime', Constants.claimTime)
	})

	test('can handle new claim success - ONGOING', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			Constants.claimTime,
			Constants.bountyType_ONGOING,
			Constants.closerData_ONGOING,
			Constants.version
		)

		newClaimSuccessEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEvent.transaction.from = Address.fromString(Constants.userId)

		handleClaimSuccess(newClaimSuccessEvent)

		assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
		assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
		assert.fieldEquals('Claim', Constants.claimId, 'tier', '0')
		assert.fieldEquals('Claim', Constants.claimId, 'claimTime', Constants.claimTime)
	})

	test('can handle new claim success - TIERED', () => {
		let newClaimSuccessEventCompetition_FIRST = createNewClaimSuccessEvent(
			Constants.claimTime,
			Constants.bountyType_TIERED,
			Constants.closerData_TIERED,
			Constants.version
		)

		let newClaimSuccessEventCompetition_SECOND = createNewClaimSuccessEvent(
			Constants.claimTime,
			Constants.bountyType_TIERED,
			Constants.closerData_TIERED_2,
			Constants.version
		)

		let newClaimSuccessEventCompetition_THIRD = createNewClaimSuccessEvent(
			Constants.claimTime,
			Constants.bountyType_TIERED,
			Constants.closerData_TIERED_3,
			Constants.version
		)

		newClaimSuccessEventCompetition_FIRST.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEventCompetition_FIRST.transaction.from = Address.fromString(Constants.userId)

		newClaimSuccessEventCompetition_SECOND.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEventCompetition_SECOND.transaction.from = Address.fromString(Constants.userId)

		newClaimSuccessEventCompetition_THIRD.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEventCompetition_THIRD.transaction.from = Address.fromString(Constants.userId)

		handleClaimSuccess(newClaimSuccessEventCompetition_FIRST)
		handleClaimSuccess(newClaimSuccessEventCompetition_SECOND)
		handleClaimSuccess(newClaimSuccessEventCompetition_THIRD)

		assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
		assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
		assert.fieldEquals('Claim', Constants.claimId, 'tier', Constants.FIRST_PLACE)
		assert.fieldEquals('Claim', Constants.claimId, 'claimTime', Constants.claimTime)

		assert.fieldEquals('Claim', Constants.claimId_Second, 'id', Constants.claimId_Second)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'claimantAsset', Constants.claimantAsset2)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'tier', Constants.SECOND_PLACE)
		assert.fieldEquals('Claim', Constants.claimId_Second, 'claimTime', Constants.claimTime)

		assert.fieldEquals('Claim', Constants.claimId_Third, 'id', Constants.claimId_Third)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'claimantAsset', Constants.claimantAsset3)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'tier', Constants.THIRD_PLACE)
		assert.fieldEquals('Claim', Constants.claimId_Third, 'claimTime', Constants.claimTime)
	})
})

export function createNewClaimSuccessEvent(claimTime: string, bountyType: string, data: string, version: string): ClaimSuccess {
	let newClaimSuccessEvent = changetype<ClaimSuccess>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("claimTime", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(claimTime))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newClaimSuccessEvent.parameters = parameters;

	return newClaimSuccessEvent
}