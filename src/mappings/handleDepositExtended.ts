import { DepositExtended } from "../../generated/DepositManager/DepositManager"
import {
	Deposit
} from "../../generated/schema"

export default function handleDepositExtended(event: DepositExtended): void {
	let deposit = Deposit.load(event.params.depositId.toHexString())

	if (!deposit) { throw "Error" }

	deposit.expiration = event.params.newExpiration

	// SAVE ALL ENTITIES
	deposit.save()
}