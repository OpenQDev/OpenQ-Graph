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
			Constants.bountyType,
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
	})

	test('can handle new claim success - ONGOING', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			'1',
			Constants.closerData_TIERED,
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
		assert.fieldEquals('Claim', Constants.claimId, 'tier', '1')
	})

	test('can handle new claim success - TIERED', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			'2',
			Constants.closerData_TIERED,
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
		assert.fieldEquals('Claim', Constants.claimId, 'tier', '1')
	})
})

export function createNewClaimSuccessEvent(bountyType: string, data: string, version: string): ClaimSuccess {
	let newClaimSuccessEvent = changetype<ClaimSuccess>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newClaimSuccessEvent.parameters = parameters;

	return newClaimSuccessEvent
}