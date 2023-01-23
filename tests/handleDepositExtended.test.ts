import { Bytes, BigInt, Address, ethereum } from '@graphprotocol/graph-ts';
import { DepositExtended } from "../generated/DepositManager/DepositManager";
import { newMockEvent, test, assert, clearStore, afterEach, describe, beforeEach } from "matchstick-as/assembly/index";
import { handleDepositExtended } from "../src/mapping";
import { seedBounty, seedDeposit } from './utils';
import Constants from './constants'

describe('handleDepositExtended', () => {

	beforeEach(() => {
		seedBounty()
		seedDeposit()
	})

	afterEach(() => {
		clearStore()
	})

	test('can handle new token deposit received', () => {
		let newDepositExtendedEvent = createNewDepositExtendedEvent(
			Constants.depositId,
			Constants.expiration.concat('1'),
			Constants.bountyType_ATOMIC,
			Constants.data,
			Constants.VERSION_1
		)

		newDepositExtendedEvent.transaction.hash = Bytes.fromHexString(Constants.transactionHash)
		newDepositExtendedEvent.transaction.from = Address.fromString(Constants.userId)

		assert.fieldEquals('Deposit', Constants.depositId, 'expiration', Constants.expiration)

		handleDepositExtended(newDepositExtendedEvent)

		assert.fieldEquals('Deposit', Constants.depositId, 'id', Constants.depositId)
		assert.fieldEquals('Deposit', Constants.depositId, 'expiration', Constants.expiration.concat('1'))
	})
})

export function createNewDepositExtendedEvent(
	depositId: string,
	newExpiration: string,
	bountyType: string,
	data: string,
	version: string
): DepositExtended {
	let newDepositExtendedEvent = changetype<DepositExtended>(newMockEvent());

	let parameters: Array<ethereum.EventParam> = [
		new ethereum.EventParam("depositId", ethereum.Value.fromBytes(Bytes.fromHexString(depositId))),
		new ethereum.EventParam("newExpiration", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(newExpiration))),
		new ethereum.EventParam("bountyType", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(bountyType))),
		new ethereum.EventParam("data", ethereum.Value.fromBytes(Bytes.fromHexString(data))),
		new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString(version)))
	]

	newDepositExtendedEvent.parameters = parameters;

	return newDepositExtendedEvent
}