import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { ClaimSuccess } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach, log } from "matchstick-as/assembly/index";
import { handleClaimSuccess } from "../src/mapping";
import Constants from './constants'

describe('handleClaimSuccess', () => {

	beforeEach(() => { })

	afterEach(() => {
		clearStore()
	})

	test('can handle new claim success - SINGLE', () => {
		let newClaimSuccessEvent = createNewClaimSuccessEvent(
			Constants.bountyType_SINGLE,
			Constants.closerData_SINGLE,
			Constants.version
		)

		log.info('ok: {}', [Constants.closerData_SINGLE.toHexString()]);

		newClaimSuccessEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newClaimSuccessEvent.transaction.from = Address.fromString(Constants.userId)

		handleClaimSuccess(newClaimSuccessEvent)

		assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
		assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
		assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
		assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
		assert.fieldEquals('Claim', Constants.claimId, 'tier', 'null')
	})

	// test('can handle new claim success - ONGOING', () => {
	// 	let newClaimSuccessEvent = createNewClaimSuccessEvent(
	// 		Constants.bountyType_ONGOING,
	// 		Constants.closerData_TIERED,
	// 		Constants.version
	// 	)

	// 	newClaimSuccessEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
	// 	newClaimSuccessEvent.transaction.from = Address.fromString(Constants.userId)

	// 	handleClaimSuccess(newClaimSuccessEvent)

	// 	assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'tier', 'null')
	// })

	// test('can handle new claim success - TIERED', () => {
	// 	let newClaimSuccessEvent = createNewClaimSuccessEvent(
	// 		Constants.bountyType_TIERED,
	// 		Constants.closerData_TIERED,
	// 		Constants.version
	// 	)

	// 	newClaimSuccessEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
	// 	newClaimSuccessEvent.transaction.from = Address.fromString(Constants.userId)

	// 	handleClaimSuccess(newClaimSuccessEvent)

	// 	assert.fieldEquals('Claim', Constants.claimId, 'id', Constants.claimId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'bounty', Constants.id)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'externalUserId', Constants.externalUserId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'claimant', Constants.userId)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'claimantAsset', Constants.claimantAsset)
	// 	assert.fieldEquals('Claim', Constants.claimId, 'tier', Constants.FIRST_PLACE)
	// })
})

export function createNewClaimSuccessEvent(bountyType: string, data: Bytes, version: string): ClaimSuccess {
	let newClaimSuccessEvent = changetype<ClaimSuccess>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(data)),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version))),
	]

	newClaimSuccessEvent.parameters = parameters;

	return newClaimSuccessEvent
}