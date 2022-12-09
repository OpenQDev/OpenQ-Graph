import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { KYCRequiredSet } from "../generated/OpenQ/OpenQ";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleKycRequiredSet } from "../src/mapping";
import { seedBounty } from './utils';
import Constants from './constants'

describe('handleKycRequiredSet.test', () => {

	beforeEach(() => {
		seedBounty()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle kyc required set event', () => {
		let newKycRequiredSetEvent = createNewKycRequiredSetEvent(
			Constants.id,
			true,
			Constants.data,
			Constants.version
		)

		newKycRequiredSetEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newKycRequiredSetEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'false')

		handleKycRequiredSet(newKycRequiredSetEvent)

		assert.fieldEquals('Bounty', Constants.id, 'kycRequired', 'true')
	})
})

export function createNewKycRequiredSetEvent(
	bountyAddress: string,
	kycRequired: boolean,
	data: string,
	version: string
): KYCRequiredSet {
	let newKycRequiredSetEvent = changetype<KYCRequiredSet>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("bountyAddress", ethereum.Value.fromAddress(Address.fromString(bountyAddress))),
		new ethereum.EventParam("kycRequired", ethereum.Value.fromBoolean(kycRequired)),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newKycRequiredSetEvent.parameters = parameters;

	return newKycRequiredSetEvent
}